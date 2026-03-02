import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

function mapSqftToBucket(sqft: number | null): string | null {
  if (!sqft) return null;
  if (sqft < 1600) return 'Less than 1,600 sq. feet';
  if (sqft < 2500) return '1,600-2,500 sq. feet';
  if (sqft < 4500) return '2,500-4,500 sq. feet';
  return '4,500+ sq. feet';
}

function mapLotToBucket(lot: number | null): string | null {
  if (!lot) return null;
  if (lot < 5000) return 'Less than 5,000 sq. feet';
  if (lot < 10000) return '5,000-10,000 sq. feet';
  if (lot < 20000) return '10,000-20,000 sq. feet';
  return 'Greater than 20,000 sq. feet';
}

function mapStoriesToBucket(stories: number | null): string | null {
  if (!stories) return null;
  if (stories <= 1) return 'One';
  return 'Two';
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verify authenticated user
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

    // Get customer profile
    const { data: profile, error: profileError } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('id', profileId)
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Create Airtable record
    const pat = process.env.AIRTABLE_PAT;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!pat || !baseId) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const address = profile.formatted_address ||
      [profile.address_line1, profile.city, profile.state, profile.zip_code].filter(Boolean).join(', ');

    const fields: Record<string, unknown> = {
      'First Name': profile.first_name || '',
      'Last Name': profile.last_name || '',
      'Email': profile.email,
      'Customer Phone': profile.phone || '',
      'Address': address,
      'Selected Services': [service],
      'Source': 'Customer Portal',
      'Property Data Source': profile.property_data_source || 'Manual',
    };

    // Add bucket values
    if (profile.square_footage) {
      fields['Square Footage'] = mapSqftToBucket(profile.square_footage);
      fields['Exact Square Footage'] = profile.square_footage;
    }
    if (profile.lot_size) {
      fields['Lot Size'] = mapLotToBucket(profile.lot_size);
      fields['Exact Lot Size'] = profile.lot_size;
    }
    if (profile.stories) {
      fields['Stories'] = mapStoriesToBucket(profile.stories);
      fields['Exact Stories'] = profile.stories;
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
      return NextResponse.json({ error: 'Failed to create quote request' }, { status: 500 });
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
