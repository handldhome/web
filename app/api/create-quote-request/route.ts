import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getHandldDb } from '@/lib/supabase/handld';

const SERVICES_LIST = [
  { name: 'Gutter Cleaning', icon: '🏠', description: 'Full gutter cleaning & flush' },
  { name: 'Window Washing - Exterior', icon: '🪟', description: 'All exterior windows' },
  { name: 'Window Washing - Interior & Exterior', icon: '✨', description: 'Inside and out' },
  { name: 'Pressure Washing - Home Exterior', icon: '🏡', description: 'Siding, stucco & more' },
  { name: 'Pressure Washing - Driveway & Patio', icon: '🧹', description: 'Concrete & stone surfaces' },
  { name: 'Holiday Lights Install & Take Down', icon: '🎄', description: 'Professional install & removal' },
  { name: 'Outdoor Furniture Cleaning', icon: '🪑', description: 'Patio furniture refresh' },
  { name: 'Handyman', icon: '🔧', description: 'General repairs & fixes' },
  { name: 'Plumbing Repairs', icon: '🔧', description: 'Faucets, toilets, drains & more' },
  { name: 'Electrical Repairs', icon: '⚡', description: 'Outlets, switches, fixtures & more' },
  { name: 'Home TuneUp', icon: '🔍', description: '30-point preventative inspection' },
  { name: 'Trash Bin Cleaning', icon: '🗑️', description: 'Sanitize & deodorize bins' },
  { name: 'Pest Control', icon: '🐜', description: 'Treatment & prevention' },
];

async function generateQuoteId(): Promise<string> {
  const { data } = await getHandldDb()
    .from('quote_requests')
    .select('quote_id')
    .like('quote_id', 'HNDLD%')
    .order('quote_id', { ascending: false })
    .limit(1) as { data: { quote_id: string }[] | null };

  let nextNum = 400;
  if (data && data.length > 0) {
    const lastNum = parseInt(data[0].quote_id.replace('HNDLD', ''), 10);
    if (!isNaN(lastNum)) nextNum = lastNum + 1;
  }

  return 'HNDLD' + String(nextNum).padStart(4, '0');
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verify authenticated user (on Handld Pro Supabase)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { service, profileId } = body;

    // Validate service
    const validService = SERVICES_LIST.find(s => s.name === service);
    if (!validService) {
      return NextResponse.json({ error: 'Invalid service' }, { status: 400 });
    }

    // Get customer profile (from Handld Pro Supabase)
    const { data: profile, error: profileError } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('id', profileId)
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const email = (profile.email || '').trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: 'Profile missing email' }, { status: 400 });
    }

    // Upsert customer in Handld Home database
    const { data: customer, error: customerError } = await getHandldDb()
      .from('customers')
      .upsert(
        {
          email,
          first_name: profile.first_name || undefined,
          last_name: profile.last_name || undefined,
          phone: profile.phone || undefined,
        },
        { onConflict: 'email' }
      )
      .select('id')
      .single() as { data: { id: string } | null; error: any };

    if (customerError) {
      console.error('Customer upsert error:', customerError);
      return NextResponse.json({ error: 'Failed to create customer record' }, { status: 500 });
    }

    const address = profile.formatted_address ||
      [profile.address_line1, profile.city, profile.state, profile.zip_code].filter(Boolean).join(', ');

    // Build quote request
    const quoteRequest: Record<string, unknown> = {
      quote_id: await generateQuoteId(),
      customer_id: customer.id,
      address,
      city: profile.city || undefined,
      state: profile.state || undefined,
      zip_code: profile.zip_code || undefined,
      selected_services: [service],
      property_data_source: profile.property_data_source || 'Manual',
    };

    if (profile.square_footage) {
      quoteRequest.exact_square_footage = profile.square_footage;
    }
    if (profile.lot_size) {
      quoteRequest.exact_lot_size = profile.lot_size;
    }
    if (profile.stories) {
      quoteRequest.exact_stories = profile.stories;
    }

    // Insert quote request into Handld Home database
    const { data: quoteReq, error: quoteError } = await getHandldDb()
      .from('quote_requests')
      .insert(quoteRequest)
      .select('id')
      .single() as { data: { id: string } | null; error: any };

    if (quoteError) {
      console.error('Quote request insert error:', quoteError);
      return NextResponse.json({ error: 'Failed to create quote request' }, { status: 500 });
    }

    // Create line item (pricing trigger auto-calculates for RentCast customers)
    const { error: lineItemError } = await getHandldDb()
      .from('quote_line_items')
      .insert({
        quote_request_id: quoteReq.id,
        service,
        name: service,
        service_selected: true,
      });

    if (lineItemError) {
      console.error('Line item insert error:', lineItemError);
    }

    return NextResponse.json({
      success: true,
      message: `Quote request for ${service} created successfully`,
    });
  } catch (err) {
    console.error('Create quote request error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
