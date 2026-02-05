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

    const fields: Record<string, string> = {};

    const fieldMap: [string, string | undefined][] = [
      ['Customer Name', body.name],
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
      ['Selected Services', body.selectedServices?.join(', ')],
      ['Service Detail', body.serviceType],
      ['Plumbing Detail', body.plumbingIssues?.join(', ')],
      ['Electrical Detail', body.electricalIssues?.join(', ')],
      ['Bundle Type', body.bundleChoice],
    ];

    for (const [key, value] of fieldMap) {
      if (value && value.trim() !== '') {
        fields[key] = value;
      }
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
