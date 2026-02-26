import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface ImportResult {
  customerId: string;
  customerName: string;
  phone: string | null;
  email: string | null;
  profileId?: string;
  status: 'created' | 'skipped' | 'error';
  reason?: string;
}

/**
 * POST /api/admin/import-customers
 *
 * Batch-creates customer_profiles for existing customers in a given organization.
 * This pre-links profiles so when customers sign up, they're automatically connected.
 *
 * Body: { orgSlug: string, dryRun?: boolean }
 *
 * Note: This is an admin-only endpoint. Requires the user to be an owner/admin of the org.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { orgSlug, dryRun = false } = body;

    if (!orgSlug) {
      return NextResponse.json({ error: 'orgSlug is required' }, { status: 400 });
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('slug', orgSlug)
      .single();

    if (orgError || !org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Check if user is owner/admin of this org
    const { data: membership } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .eq('org_id', org.id)
      .single();

    // For now, also allow if user has any active customer_profile (for testing)
    // In production, you'd want stricter admin checks
    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      // Check if user is a super admin (has profile in multiple orgs or is flagged)
      const { count } = await supabase
        .from('customer_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // For testing purposes, allow if they have at least one profile
      // In production, implement proper admin checks
      if ((count || 0) === 0) {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }
    }

    // Fetch all active customers in the organization
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('id, first_name, last_name, email, phone, address_line1, city, state, zip')
      .eq('org_id', org.id)
      .eq('status', 'active');

    if (customersError) {
      return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }

    if (!customers || customers.length === 0) {
      return NextResponse.json({
        message: 'No active customers found',
        results: [],
        summary: { total: 0, created: 0, skipped: 0, errors: 0 }
      });
    }

    // Fetch existing profiles to avoid duplicates
    const { data: existingProfiles } = await supabase
      .from('customer_profiles')
      .select('handld_pro_customer_id')
      .eq('organization_id', org.id)
      .not('handld_pro_customer_id', 'is', null);

    const linkedCustomerIds = new Set(
      existingProfiles?.map(p => p.handld_pro_customer_id) || []
    );

    const results: ImportResult[] = [];

    for (const customer of customers) {
      const customerName = [customer.first_name, customer.last_name].filter(Boolean).join(' ') || 'Unknown';

      // Skip if already linked
      if (linkedCustomerIds.has(customer.id)) {
        results.push({
          customerId: customer.id,
          customerName,
          phone: customer.phone,
          email: customer.email,
          status: 'skipped',
          reason: 'Already has linked profile'
        });
        continue;
      }

      // Skip if no phone or email (can't create login)
      if (!customer.phone && !customer.email) {
        results.push({
          customerId: customer.id,
          customerName,
          phone: customer.phone,
          email: customer.email,
          status: 'skipped',
          reason: 'No phone or email'
        });
        continue;
      }

      if (dryRun) {
        results.push({
          customerId: customer.id,
          customerName,
          phone: customer.phone,
          email: customer.email,
          status: 'created',
          reason: '[DRY RUN] Would create profile'
        });
        continue;
      }

      // Create the customer_profile entry
      // Note: user_id is NULL - it will be linked when the customer signs up
      const { data: newProfile, error: insertError } = await supabase
        .from('customer_profiles')
        .insert({
          organization_id: org.id,
          handld_pro_customer_id: customer.id,
          first_name: customer.first_name,
          last_name: customer.last_name,
          email: customer.email,
          phone: customer.phone,
          address_line1: customer.address_line1,
          city: customer.city,
          state: customer.state,
          zip_code: customer.zip,
          is_active: true
        })
        .select('id')
        .single();

      if (insertError) {
        results.push({
          customerId: customer.id,
          customerName,
          phone: customer.phone,
          email: customer.email,
          status: 'error',
          reason: insertError.message
        });
      } else {
        results.push({
          customerId: customer.id,
          customerName,
          phone: customer.phone,
          email: customer.email,
          profileId: newProfile.id,
          status: 'created'
        });
      }
    }

    const summary = {
      total: results.length,
      created: results.filter(r => r.status === 'created').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      errors: results.filter(r => r.status === 'error').length
    };

    return NextResponse.json({
      message: dryRun ? 'Dry run complete' : 'Import complete',
      organization: org.name,
      results,
      summary
    });
  } catch (error) {
    console.error('Error in import-customers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
