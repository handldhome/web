import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/account/link-customer
 *
 * Auto-links a customer_profile to a customer in the customers table
 * by matching phone or email. Called after login.
 *
 * Also claims any pre-created profiles (from import) that match the user's
 * phone or email but don't have a user_id yet.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's phone and email
    const userPhone = user.phone?.replace(/\D/g, '') || null;
    const userEmail = user.email || null;

    if (!userPhone && !userEmail) {
      return NextResponse.json({ error: 'No phone or email to match' }, { status: 400 });
    }

    const results: { profileId: string; customerId: string | null; matched: boolean; claimed?: boolean }[] = [];

    // Step 1: Claim any orphaned profiles (pre-created from import, no user_id)
    // These profiles have handld_pro_customer_id already set but no user_id
    if (userPhone || userEmail) {
      // Build query to find orphaned profiles matching user's phone/email
      let orphanQuery = supabase
        .from('customer_profiles')
        .select('id, organization_id, email, phone, handld_pro_customer_id')
        .is('user_id', null)
        .eq('is_active', true);

      // Match by phone or email
      const conditions: string[] = [];
      if (userPhone) {
        conditions.push(`phone.ilike.%${userPhone}%`);
      }
      if (userEmail) {
        conditions.push(`email.ilike.${userEmail}`);
      }
      if (conditions.length > 0) {
        orphanQuery = orphanQuery.or(conditions.join(','));
      }

      const { data: orphanedProfiles } = await orphanQuery;

      // Claim orphaned profiles by setting user_id
      for (const profile of orphanedProfiles || []) {
        const { error: claimError } = await supabase
          .from('customer_profiles')
          .update({ user_id: user.id })
          .eq('id', profile.id);

        if (!claimError) {
          results.push({
            profileId: profile.id,
            customerId: profile.handld_pro_customer_id,
            matched: !!profile.handld_pro_customer_id,
            claimed: true
          });
        }
      }
    }

    // Step 2: Find existing profiles owned by this user that need customer linking
    const { data: profiles, error: profilesError } = await supabase
      .from('customer_profiles')
      .select('id, organization_id, email, phone, handld_pro_customer_id')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
    }

    for (const profile of profiles || []) {
      // Skip if we already processed this (claimed it above)
      if (results.some(r => r.profileId === profile.id)) {
        continue;
      }

      // Skip if already linked
      if (profile.handld_pro_customer_id) {
        results.push({ profileId: profile.id, customerId: profile.handld_pro_customer_id, matched: true });
        continue;
      }

      // Try to find matching customer in customers table
      // Match by phone or email within the same organization
      const phoneToMatch = profile.phone?.replace(/\D/g, '') || userPhone;
      const emailToMatch = profile.email || userEmail;

      let customerId: string | null = null;

      // First try phone match (more reliable)
      if (phoneToMatch) {
        const { data: phoneMatch } = await supabase
          .from('customers')
          .select('id')
          .eq('org_id', profile.organization_id)
          .or(`phone.ilike.%${phoneToMatch}%`)
          .eq('status', 'active')
          .limit(1)
          .single();

        if (phoneMatch) {
          customerId = phoneMatch.id;
        }
      }

      // If no phone match, try email
      if (!customerId && emailToMatch) {
        const { data: emailMatch } = await supabase
          .from('customers')
          .select('id')
          .eq('org_id', profile.organization_id)
          .ilike('email', emailToMatch)
          .eq('status', 'active')
          .limit(1)
          .single();

        if (emailMatch) {
          customerId = emailMatch.id;
        }
      }

      // Update profile with customer link if found
      if (customerId) {
        const { error: updateError } = await supabase
          .from('customer_profiles')
          .update({ handld_pro_customer_id: customerId })
          .eq('id', profile.id);

        if (updateError) {
          console.error('Error linking customer:', updateError);
        }
      }

      results.push({ profileId: profile.id, customerId, matched: !!customerId });
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Error in link-customer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
