import type { NextApiRequest, NextApiResponse } from 'next';
import { getHandldDb } from '@/lib/supabase/handld';

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
    const body = req.body;

    // Split name into first/last
    const nameParts = (body.name || '').trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const email = (body.email || '').trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

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
      .select('id')
      .single();

    if (quoteError) {
      console.error('Quote request insert error:', quoteError);
      return res.status(500).json({ error: `Database error: ${quoteError.message}` });
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
    // (Previously a Zapier webhook -> Heymarket; Heymarket was canceled Aug 2026.)
    // NOTE: use the /quote/ path — this is the canonical, production-proven route
    // (the admin/tuneup app stores quote links as /quote/HNDLD####). The old /q/
    // path was not guaranteed to resolve in the quote-viewer SPA router.
    const quoteLink = `https://handld-quote-viewer.vercel.app/quote/${quoteRequest.quote_id}`;
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
    if (twilioSid && twilioToken && twilioFrom && body.phone && !isFreeHealthCheck) {
      try {
        // Normalize to E.164 (assume US numbers)
        const digits = String(body.phone).replace(/\D/g, '');
        const to = digits.length === 10 ? `+1${digits}` : digits.length === 11 && digits.startsWith('1') ? `+${digits}` : `+${digits}`;

        const smsBody = `Hi${firstName ? ` ${firstName}` : ''}! Thanks for your Handld quote request. View your personalized quote here: ${quoteLink}`;

        const twilioRes = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization: 'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64'),
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ To: to, From: twilioFrom, Body: smsBody }),
          }
        );

        if (!twilioRes.ok) {
          console.error('Twilio SMS error:', twilioRes.status, await twilioRes.text());
        }
      } catch (smsErr) {
        console.error('Twilio SMS error:', smsErr);
        // Don't fail the quote submission if the text fails
      }
    } else if (body.phone && !isFreeHealthCheck) {
      console.error('Twilio not configured — quote SMS not sent for', quoteRequest.quote_id);
    }

    return res.status(200).json({ success: true, serviceType: body.serviceType || null });
  } catch (err) {
    console.error('Quote submission error:', err);
    return res.status(500).json({
      error: `Server error: ${err instanceof Error ? err.message : 'Unknown error'}`,
    });
  }
}
