import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Diagnostic GET — visit /api/quote in browser to check env vars on THIS route
export async function GET() {
  const pat = process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID;
  return NextResponse.json({
    pat_exists: !!pat,
    pat_length: pat?.length ?? 0,
    base_id_exists: !!baseId,
    base_id_length: baseId?.length ?? 0,
    route: '/api/quote',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const pat = process.env.AIRTABLE_PAT;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!pat || !baseId) {
      return NextResponse.json(
        { error: `Missing credentials — PAT: ${!!pat}, BASE_ID: ${!!baseId}` },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Build fields object, only including non-empty values
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
      return NextResponse.json(
        { error: `Airtable: ${detail}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Quote submission error:', err);
    return NextResponse.json(
      { error: `Server error: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
