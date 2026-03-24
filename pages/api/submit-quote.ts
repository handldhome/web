import type { NextApiRequest, NextApiResponse } from 'next';
import { getHandldDb } from '@/lib/supabase/handld';

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

    // Fire Zapier webhook to text customer their quote link via Heymarket
    const quoteLink = `https://handld-quote-viewer.vercel.app/q/${quoteRequest.quote_id}`;
    const webhookUrl = process.env.ZAPIER_QUOTE_WEBHOOK_URL;
    if (webhookUrl && body.phone && !isFreeHealthCheck) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: firstName,
            phone: body.phone,
            quote_link: quoteLink,
          }),
        });
      } catch (webhookErr) {
        console.error('Zapier webhook error:', webhookErr);
        // Don't fail the quote submission if the text fails
      }
    }

    return res.status(200).json({ success: true, serviceType: body.serviceType || null });
  } catch (err) {
    console.error('Quote submission error:', err);
    return res.status(500).json({
      error: `Server error: ${err instanceof Error ? err.message : 'Unknown error'}`,
    });
  }
}
