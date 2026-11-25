import type { NextApiRequest, NextApiResponse } from 'next';
import { getHandldDb } from '@/lib/supabase/handld';
import { buildQuoteSms, isHoneypotFilled, normalizeUsMobile, sanitizeFirstName } from '@/lib/quoteSms';
import { createRateLimiter, getClientIp } from '@/lib/rateLimit';
import { SMS_CONSENT_TEXT_CUSTOMER, SMS_CONSENT_VERSION } from '@/lib/smsConsent';
import { TWILIO_UNSUBSCRIBED_CODE, isOptedOut, recordTwilioOptOut, twilioErrorCode } from '@/lib/smsOptOuts';

// In-memory, so per serverless instance (see lib/rateLimit.ts).
// Per IP: caps how fast one client can create quotes and trigger texts.
export const ipLimiter = createRateLimiter({ limit: 10, windowMs: 60 * 60 * 1000 });
// Per destination phone: caps how many quote texts one number can receive.
export const phoneLimiter = createRateLimiter({ limit: 3, windowMs: 24 * 60 * 60 * 1000 });

// Why a text was not sent. Returned to the form so the success screen can
// show the quote link directly instead of "check your texts".
type SmsSkipReason = 'no_phone' | 'opt_out' | 'rate_limit' | 'not_configured' | 'send_failed' | 'health_check';

// The sms_consents.ip column is inet, so only pass something that looks like
// an IP address (first hop of x-forwarded-for, via getClientIp).
function consentIp(req: NextApiRequest): string | null {
  const ip = getClientIp(req);
  return /^[0-9a-fA-F.:]+$/.test(ip) ? ip : null;
}

function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 for clarity
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function generateQuoteId(): Promise<string> {
  // Get the highest existing quote number
  const { data } = await getHandldDb()
    .from('quote_requests')
    .select('quote_id')
    .like('quote_id', 'HNDLD%')
    .order('quote_id', { ascending: false })
    .limit(1);

  let nextNum = 400; // Start at 400 if no records found
  if (data && data.length > 0) {
    const lastNum = parseInt(data[0].quote_id.replace('HNDLD', ''), 10);
    if (!isNaN(lastNum)) nextNum = lastNum + 1;
  }

  return 'HNDLD' + String(nextNum).padStart(4, '0');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};

    // Honeypot: a hidden form field people never see. If it's filled in, a bot
    // submitted the form; answer as if it worked, but save and send nothing.
    if (isHoneypotFilled(body)) {
      return res.status(200).json({ success: true, serviceType: body.serviceType || null });
    }

    if (!ipLimiter.hit(getClientIp(req))) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later or call us at (626) 298-7128.',
      });
    }

    // Split name into first/last
    const nameParts = (body.name || '').trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const email = (body.email || '').trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Quote texts only go to US mobile numbers.
    const smsTo = body.phone ? normalizeUsMobile(body.phone) : null;
    if (body.phone && !smsTo) {
      return res.status(400).json({ error: 'Please enter a valid US mobile number' });
    }
    // A phone number is only accepted together with explicit SMS consent.
    if (body.phone && body.smsConsent !== true) {
      return res.status(400).json({
        error: 'Please agree to receive text messages or remove your phone number',
      });
    }
    const smsConsentGiven = !!smsTo && body.smsConsent === true;

    // Upsert customer by email
    const { data: customer, error: customerError } = await getHandldDb()
      .from('customers')
      .upsert(
        {
          email,
          first_name: firstName || undefined,
          last_name: lastName || undefined,
          phone: body.phone || undefined,
        },
        { onConflict: 'email' }
      )
      .select('id')
      .single();

    if (customerError) {
      console.error('Customer upsert error:', customerError);
      return res.status(500).json({ error: `Database error: ${customerError.message}` });
    }

    // Generate a referral code for this customer if they don't have one
    const { data: existingRefCode } = await getHandldDb()
      .from('referral_codes')
      .select('id, code')
      .eq('customer_id', customer.id)
      .single();

    if (!existingRefCode) {
      const code = generateReferralCode();
      await getHandldDb()
        .from('referral_codes')
        .insert({ customer_id: customer.id, code });
    }

    // Build quote request record
    // propertyAddress is set by RentCast lookup, address is manual entry
    const resolvedAddress = body.propertyAddress || body.address || undefined;

    const quoteRequest: Record<string, unknown> = {
      quote_id: await generateQuoteId(),
      customer_id: customer.id,
      address: resolvedAddress,
      address_line_2: body.addressLine2 || undefined,
      city: body.city || undefined,
      state: body.state || undefined,
      zip_code: body.zipCode || undefined,
      square_footage: body.squareFootage || undefined,
      stories: body.stories || undefined,
      lot_size: body.lotSize || undefined,
      bundle_type: body.bundleChoice || undefined,
      handyman_projects: body.handymanProjects || undefined,
      property_data_source: body.propertyDataSource || 'Manual',
      selected_services: body.serviceType === 'Free Home Health Check'
        ? ['Home Health Check']
        : (body.selectedServices || []),
      plumbing_detail: body.plumbingIssues?.join(', ') || undefined,
      electrical_detail: body.electricalIssues?.join(', ') || undefined,
      preferred_date: body.preferredDate || undefined,
      preferred_time: body.preferredTime || undefined,
      referral_code: body.referralCode || undefined,
    };

    // Exact property values from RentCast
    if (typeof body.exactSquareFootage === 'number' && body.exactSquareFootage > 0) {
      quoteRequest.exact_square_footage = body.exactSquareFootage;
    }
    if (typeof body.exactLotSize === 'number' && body.exactLotSize > 0) {
      quoteRequest.exact_lot_size = body.exactLotSize;
    }
    if (typeof body.exactStories === 'number' && body.exactStories > 0) {
      quoteRequest.exact_stories = body.exactStories;
    }

    // Insert quote request
    const { data: quoteReq, error: quoteError } = await getHandldDb()
      .from('quote_requests')
      .insert(quoteRequest)
      .select('id, token')
      .single();

    if (quoteError) {
      console.error('Quote request insert error:', quoteError);
      return res.status(500).json({ error: `Database error: ${quoteError.message}` });
    }

    // Record the customer's SMS consent against this quote request.
    if (smsConsentGiven) {
      const userAgent = req.headers['user-agent'];
      const { error: consentError } = await getHandldDb()
        .from('sms_consents')
        .insert({
          phone: smsTo,
          party: 'customer',
          purpose: 'transactional',
          source: 'web_quote_form',
          consent_text: SMS_CONSENT_TEXT_CUSTOMER,
          consent_version: SMS_CONSENT_VERSION,
          ip: consentIp(req),
          user_agent: typeof userAgent === 'string' ? userAgent.slice(0, 512) : null,
          reference_id: quoteReq.id,
        });
      if (consentError) {
        // The quote is saved; log loudly but don't fail the submission.
        console.error('sms_consents insert error:', consentError);
      }
    }

    // Create referral record if a referral code was used
    if (body.referralCode) {
      try {
        const refCode = body.referralCode.toUpperCase().trim();
        const { data: referrerCode } = await getHandldDb()
          .from('referral_codes')
          .select('id, customer_id')
          .eq('code', refCode)
          .single();

        if (referrerCode) {
          // Self-referral guard: check referrer is not the same customer
          if (referrerCode.customer_id !== customer.id) {
            await getHandldDb()
              .from('referrals')
              .insert({
                referrer_code_id: referrerCode.id,
                referred_quote_request_id: quoteReq.id,
                referred_customer_id: customer.id,
                status: 'pending',
              });
          }
        }
      } catch (refErr) {
        console.error('Referral tracking error:', refErr);
        // Don't fail the quote submission if referral tracking fails
      }
    }

    // Create quote line items for each selected service
    // The pricing trigger will auto-calculate prices for RentCast customers
    const resolvedServices = body.serviceType === 'Free Home Health Check'
      ? ['Home Health Check']
      : (body.selectedServices || []);
    if (resolvedServices.length) {
      const lineItems = resolvedServices.map((service: string) => ({
        quote_request_id: quoteReq.id,
        service,
        name: service,
        service_selected: true,
      }));

      const { error: lineItemError } = await getHandldDb()
        .from('quote_line_items')
        .insert(lineItems);

      if (lineItemError) {
        console.error('Line items insert error:', lineItemError);
        // Quote was created, just log the line item error
      }
    }

    // For Free Home Health Check, create a job directly in the scheduling system
    const isFreeHealthCheck = body.serviceType === 'Free Home Health Check';
    if (isFreeHealthCheck) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 2);
      const targetDateStr = targetDate.toISOString().split('T')[0];

      const { error: jobError } = await getHandldDb()
        .from('jobs')
        .insert({
          service: 'Home Health Check',
          name: 'Home Health Check',
          status: 'Planned',
          target_date: targetDateStr,
          expected_time_to_complete: 0.75,
          other_notes: `Quote ID: ${quoteRequest.quote_id}`,
          quote_request_id: quoteReq.id,
        });

      if (jobError) {
        console.error('Job creation error:', jobError);
        // Don't fail the submission if job creation fails
      }
    }

    // Text the customer their quote link via Twilio.
    // Link by the random token, not the sequential HNDLD#### id, so quote links
    // can't be guessed. handldhome.com/quote/:token redirects to the quote viewer
    // (see next.config.mjs).
    const quoteLink = `https://handldhome.com/quote/${quoteReq.token}`;
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

    let smsSent = false;
    let smsSkipped: SmsSkipReason | undefined;
    if (!smsTo) {
      smsSkipped = 'no_phone';
    } else if (isFreeHealthCheck) {
      smsSkipped = 'health_check';
    } else if (await isOptedOut(smsTo)) {
      // They told us (or Twilio) to stop. The quote is saved; the form shows the link.
      smsSkipped = 'opt_out';
      console.warn('Quote SMS skipped (opt-out) for', quoteRequest.quote_id);
    } else if (!phoneLimiter.hit(smsTo)) {
      // The quote is saved; just don't text the same number again so soon.
      smsSkipped = 'rate_limit';
      console.warn('Quote SMS rate limit hit — not texting for', quoteRequest.quote_id);
    } else if (twilioSid && twilioToken && twilioFrom) {
      try {
        // Only a sanitized first name is echoed back; anything else gets "Hi there".
        const smsBody = buildQuoteSms(sanitizeFirstName(firstName), quoteLink);

        const twilioRes = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization: 'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64'),
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ To: smsTo, From: twilioFrom, Body: smsBody }),
          }
        );

        if (twilioRes.ok) {
          smsSent = true;
        } else {
          smsSkipped = 'send_failed';
          const errorText = await twilioRes.text();
          console.error('Twilio SMS error:', twilioRes.status, errorText);
          if (twilioErrorCode(errorText) === TWILIO_UNSUBSCRIBED_CODE) {
            // Twilio says this number replied STOP: remember it ourselves too.
            await recordTwilioOptOut(smsTo);
          }
        }
      } catch (smsErr) {
        smsSkipped = 'send_failed';
        console.error('Twilio SMS error:', smsErr);
        // Don't fail the quote submission if the text fails
      }
    } else {
      smsSkipped = 'not_configured';
      console.error('Twilio not configured — quote SMS not sent for', quoteRequest.quote_id);
    }

    return res.status(200).json({
      success: true,
      serviceType: body.serviceType || null,
      quoteUrl: quoteLink,
      smsSent,
      ...(smsSkipped ? { smsSkipped } : {}),
    });
  } catch (err) {
    console.error('Quote submission error:', err);
    return res.status(500).json({
      error: `Server error: ${err instanceof Error ? err.message : 'Unknown error'}`,
    });
  }
}
