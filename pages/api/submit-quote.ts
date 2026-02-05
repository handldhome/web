import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pat = process.env.AIRTABLE_PAT;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!pat || !baseId) {
      return res.status(500).json({
        error: `Missing credentials — PAT: ${!!pat}, BASE_ID: ${!!baseId}`,
        airtable_keys: Object.keys(process.env).filter(k => k.includes('AIRTABLE')),
        all_env_count: Object.keys(process.env).length,
        ts: Date.now(),
      });
    }

    const body = req.body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields: Record<string, any> = {};

    // Split name into first/last — "Customer Name" is a formula field in Airtable
    const nameParts = (body.name || '').trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // String fields
    const stringFields: [string, string | undefined][] = [
      ['First Name', firstName],
      ['Last Name', lastName],
      ['Customer Phone', body.phone],
      ['Email', body.email],
      ['Address', body.address],
      ['Address line 2', body.addressLine2],
      ['City', body.city],
      ['State', body.state],
      ['Zip Code', body.zipCode],
      ['Square Footage', body.squareFootage],
      ['Stories', body.stories],
      ['Lot Size', body.lotSize],
      ['Service Detail', body.serviceType],
      ['Bundle Type', body.bundleChoice],
    ];

    for (const [key, value] of stringFields) {
      if (value && value.trim() !== '') {
        fields[key] = value;
      }
    }

    // Multi-select fields — Airtable expects arrays, not comma-separated strings
    if (body.selectedServices?.length) {
      fields['Selected Services'] = body.selectedServices;
    }
    if (body.plumbingIssues?.length) {
      fields['Plumbing Detail'] = body.plumbingIssues;
    }
    if (body.electricalIssues?.length) {
      fields['Electrical Detail'] = body.electricalIssues;
    }

    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${baseId}/Quote%20Requests`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pat}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [{ fields }],
        }),
      }
    );

    if (!airtableResponse.ok) {
      const error = await airtableResponse.json();
      console.error('Airtable error:', JSON.stringify(error, null, 2));
      const detail = error?.error?.message || error?.error?.type || 'Unknown Airtable error';
      return res.status(500).json({ error: `Airtable: ${detail}` });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Quote submission error:', err);
    return res.status(500).json({
      error: `Server error: ${err instanceof Error ? err.message : 'Unknown error'}`,
    });
  }
}
