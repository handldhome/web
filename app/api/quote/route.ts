import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.AIRTABLE_PAT || !process.env.AIRTABLE_BASE_ID) {
      console.error('Missing Airtable credentials. Set AIRTABLE_PAT and AIRTABLE_BASE_ID in environment variables.');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body = await request.json();

    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Quote%20Requests`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_PAT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                'Customer Name': body.name || '',
                'Customer Phone': body.phone || '',
                'Email': body.email || '',
                'Address': body.address || '',
                'Address line 2': body.addressLine2 || '',
                'City': body.city || '',
                'State': body.state || '',
                'Zip Code': body.zipCode || '',
                'Square Footage': body.squareFootage || '',
                'Stories': body.stories || '',
                'Lot Size': body.lotSize || '',
                'Selected Services': body.selectedServices?.join(', ') || '',
                'Service Detail': body.serviceType || '',
                'Plumbing Detail': body.plumbingIssues?.join(', ') || '',
                'Electrical Detail': body.electricalIssues?.join(', ') || '',
                'Bundle Type': body.bundleChoice || '',
              },
            },
          ],
        }),
      }
    );

    if (!airtableResponse.ok) {
      const error = await airtableResponse.json();
      console.error('Airtable error:', error);
      return NextResponse.json(
        { error: 'Failed to submit quote request' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Quote submission error:', err);
    return NextResponse.json(
      { error: 'Failed to submit quote request' },
      { status: 500 }
    );
  }
}
