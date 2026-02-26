import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface Props {
  params: Promise<{ 'org-slug': string }>;
}

/**
 * GET /api/account/[org-slug]/data
 *
 * Fetches jobs, invoices, and services for the logged-in customer
 */
export async function GET(request: Request, { params }: Props) {
  try {
    const { 'org-slug': orgSlug } = await params;
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', orgSlug)
      .eq('is_active', true)
      .single();

    if (orgError || !org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Get customer profile with handld_pro_customer_id
    const { data: profile, error: profileError } = await supabase
      .from('customer_profiles')
      .select('id, handld_pro_customer_id')
      .eq('user_id', user.id)
      .eq('organization_id', org.id)
      .eq('is_active', true)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // If no linked customer, return empty data
    if (!profile.handld_pro_customer_id) {
      return NextResponse.json({
        customerId: null,
        jobs: [],
        invoices: [],
        upcomingJobs: [],
        recentJobs: [],
      });
    }

    const customerId = profile.handld_pro_customer_id;
    const today = new Date().toISOString().split('T')[0];

    // Fetch upcoming jobs (scheduled for today or future)
    const { data: upcomingJobs } = await supabase
      .from('jobs')
      .select(`
        id,
        scheduled_date,
        scheduled_time_start,
        scheduled_time_end,
        status,
        is_recurring,
        price,
        service:services (
          id,
          name,
          category
        ),
        assigned_technician:users!jobs_assigned_technician_id_fkey (
          id,
          first_name,
          last_name
        )
      `)
      .eq('customer_id', customerId)
      .gte('scheduled_date', today)
      .in('status', ['scheduled', 'in_progress'])
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time_start', { ascending: true })
      .limit(10);

    // Fetch recent completed jobs (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentJobs } = await supabase
      .from('jobs')
      .select(`
        id,
        scheduled_date,
        actual_start_time,
        actual_end_time,
        status,
        price,
        technician_notes,
        photos,
        service:services (
          id,
          name,
          category
        ),
        assigned_technician:users!jobs_assigned_technician_id_fkey (
          id,
          first_name,
          last_name
        )
      `)
      .eq('customer_id', customerId)
      .eq('status', 'completed')
      .gte('scheduled_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('scheduled_date', { ascending: false })
      .limit(20);

    // Fetch all jobs for history
    const { data: allJobs } = await supabase
      .from('jobs')
      .select(`
        id,
        scheduled_date,
        status,
        price,
        is_recurring,
        service:services (
          id,
          name,
          category
        )
      `)
      .eq('customer_id', customerId)
      .order('scheduled_date', { ascending: false })
      .limit(50);

    // Fetch invoices
    const { data: invoices } = await supabase
      .from('invoices')
      .select(`
        id,
        billing_period_start,
        billing_period_end,
        subtotal,
        tax,
        total,
        status,
        invoice_type,
        due_date,
        paid_at,
        line_items,
        created_at
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .limit(20);

    // Fetch recurring services (services the customer has scheduled)
    const { data: recurringServices } = await supabase
      .from('jobs')
      .select(`
        service:services (
          id,
          name,
          category,
          default_duration_minutes
        ),
        recurrence_rule
      `)
      .eq('customer_id', customerId)
      .eq('is_recurring', true)
      .not('recurrence_rule', 'is', null)
      .limit(10);

    // Dedupe recurring services
    const uniqueRecurring = recurringServices?.reduce((acc: any[], job: any) => {
      if (job.service && !acc.find(s => s.service?.id === job.service.id)) {
        acc.push(job);
      }
      return acc;
    }, []) || [];

    return NextResponse.json({
      customerId,
      upcomingJobs: upcomingJobs || [],
      recentJobs: recentJobs || [],
      allJobs: allJobs || [],
      invoices: invoices || [],
      recurringServices: uniqueRecurring,
    });
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
