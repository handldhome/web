import { createClient } from '@/lib/supabase/server';
import { getHandldDb } from '@/lib/supabase/handld';
import { NextResponse } from 'next/server';

function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

interface Props {
  params: Promise<{ 'org-slug': string }>;
}

export async function GET(request: Request, { params }: Props) {
  try {
    const { 'org-slug': orgSlug } = await params;
    const supabase = await createClient();

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get organization
    const { data: org } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', orgSlug)
      .eq('is_active', true)
      .single();

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Get customer profile with handld_pro_customer_id
    const { data: profile } = await supabase
      .from('customer_profiles')
      .select('id, handld_pro_customer_id')
      .eq('user_id', user.id)
      .eq('organization_id', org.id)
      .eq('is_active', true)
      .single();

    if (!profile?.handld_pro_customer_id) {
      return NextResponse.json({ error: 'No linked customer' }, { status: 404 });
    }

    const customerId = profile.handld_pro_customer_id;

    // Get or create referral code
    let { data: refCode } = await getHandldDb()
      .from('referral_codes')
      .select('id, code')
      .eq('customer_id', customerId)
      .single();

    if (!refCode) {
      const code = generateReferralCode();
      const { data: newCode, error: insertErr } = await getHandldDb()
        .from('referral_codes')
        .insert({ customer_id: customerId, code })
        .select('id, code')
        .single();

      if (insertErr) {
        return NextResponse.json({ error: 'Failed to generate referral code' }, { status: 500 });
      }
      refCode = newCode;
    }

    // Get referral history via the view
    const { data: referrals } = await getHandldDb()
      .from('vw_referrals')
      .select('*')
      .eq('referral_code', refCode.code)
      .order('created_at', { ascending: false });

    const totalCredits = (referrals || [])
      .filter((r: { status: string }) => r.status === 'credited')
      .reduce((sum: number, r: { credit_amount: number }) => sum + r.credit_amount, 0);

    return NextResponse.json({
      code: refCode.code,
      referralLink: `https://handldhome.com?ref=${refCode.code}`,
      referrals: referrals || [],
      totalCredits,
    });
  } catch (error) {
    console.error('Error fetching referral data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
