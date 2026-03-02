'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Tab = 'home' | 'services' | 'plan' | 'account';

type BookingStep = 'select' | 'confirm' | 'success' | null;

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

interface CustomerProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  formatted_address: string | null;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  square_footage: number | null;
  lot_size: number | null;
  stories: number | null;
  year_built: number | null;
  handld_pro_customer_id: string | null;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  contact_email: string | null;
  contact_phone: string | null;
  settings: {
    branding?: {
      logo_url?: string;
      primary_color?: string;
    };
  } | null;
}

interface Job {
  id: string;
  scheduled_date: string;
  scheduled_time_start: string | null;
  scheduled_time_end: string | null;
  actual_start_time: string | null;
  actual_end_time: string | null;
  status: string;
  price: number | null;
  is_recurring: boolean;
  technician_notes: string | null;
  photos: string[];
  service: {
    id: string;
    name: string;
    category: string;
  } | null;
  assigned_technician: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

interface Invoice {
  id: string;
  billing_period_start: string | null;
  billing_period_end: string | null;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  invoice_type: string;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
}

interface CustomerData {
  customerId: string | null;
  upcomingJobs: Job[];
  recentJobs: Job[];
  allJobs: Job[];
  invoices: Invoice[];
  recurringServices: any[];
}

export default function PortalPage({ params }: { params: Promise<{ 'org-slug': string }> }) {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [hasMultipleAccounts, setHasMultipleAccounts] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [orgSlug, setOrgSlug] = useState<string>('');
  const router = useRouter();

  // Book a Service state
  const [bookingStep, setBookingStep] = useState<BookingStep>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const { 'org-slug': slug } = await params;
      setOrgSlug(slug);
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/account/login');
        return;
      }

      // Try to auto-link customer on first load
      try {
        await fetch('/api/account/link-customer', { method: 'POST' });
      } catch (e) {
        console.error('Failed to link customer:', e);
      }

      // Fetch organization
      const { data: org } = await supabase
        .from('organizations')
        .select('id, name, slug, contact_email, contact_phone, settings')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (!org) {
        router.push('/account');
        return;
      }

      setOrganization(org as Organization);

      // Fetch customer profile
      const { data: profileData } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .eq('organization_id', org.id)
        .eq('is_active', true)
        .single();

      if (!profileData) {
        router.push('/account');
        return;
      }

      setProfile(profileData as CustomerProfile);

      // Check for multiple accounts
      const { count } = await supabase
        .from('customer_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_active', true);

      setHasMultipleAccounts((count || 0) > 1);
      setLoading(false);

      // Fetch customer data (jobs, invoices)
      fetchCustomerData(slug);
    }

    loadData();
  }, [params, router]);

  const fetchCustomerData = async (slug: string) => {
    setDataLoading(true);
    try {
      const res = await fetch(`/api/account/${slug}/data`);
      if (res.ok) {
        const data = await res.json();
        setCustomerData(data);
      }
    } catch (e) {
      console.error('Failed to fetch customer data:', e);
    }
    setDataLoading(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'paid': return 'bg-green-100 text-green-700';
      case 'sent': return 'bg-blue-100 text-blue-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleBookService = () => {
    setBookingStep('select');
    setSelectedService(null);
    setBookingError(null);
  };

  const handleSelectService = (serviceName: string) => {
    setSelectedService(serviceName);
    setBookingStep('confirm');
  };

  const handleConfirmBooking = async () => {
    if (!selectedService || !profile) return;

    setIsSubmitting(true);
    setBookingError(null);

    try {
      const res = await fetch('/api/create-quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: selectedService,
          profileId: profile.id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit request');
      }

      setBookingStep('success');
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeBookingDialog = () => {
    setBookingStep(null);
    setSelectedService(null);
    setBookingError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#2A54A1] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!organization || !profile) return null;

  const customerName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Customer';
  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || 'U';
  const address = profile.formatted_address ||
    [profile.address_line1, profile.city, profile.state].filter(Boolean).join(', ') ||
    'Address not set';

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
        .font-display { font-family: 'Libre Baskerville', serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="bg-[#FAF8F5] px-5 pt-12 pb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-[#1a1a1a]">
          {activeTab === 'home' && 'Home'}
          {activeTab === 'services' && 'Services'}
          {activeTab === 'plan' && 'Plan'}
          {activeTab === 'account' && 'Account'}
        </h1>
        <button className="p-2">
          <svg className="w-6 h-6 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </header>

      {/* Content */}
      <main className="px-5">
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
              <button
                onClick={handleBookService}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-[#faf8f5] transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F0FE] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#4285F4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-body font-medium text-[#1a1a1a]">Book a service</span>
                </div>
                <svg className="w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a href={`mailto:${organization.contact_email || 'concierge@handldhome.com'}`} className="bg-white rounded-2xl border border-[#e5e5e5] p-4 flex flex-col items-start gap-2 hover:bg-[#faf8f5] transition">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3E8] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#F4A442]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-body font-medium text-[#1a1a1a] text-sm">Email us</span>
              </a>

              <a href={`tel:${organization.contact_phone || '6262987128'}`} className="bg-white rounded-2xl border border-[#e5e5e5] p-4 flex flex-col items-start gap-2 hover:bg-[#faf8f5] transition">
                <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="font-body font-medium text-[#1a1a1a] text-sm">Call us</span>
              </a>
            </div>

            {/* Upcoming */}
            <div>
              <h2 className="font-body font-semibold text-[#1a1a1a] mb-3">Upcoming</h2>
              <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
                {dataLoading ? (
                  <div className="p-4 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-[#2A54A1] border-t-transparent rounded-full" />
                  </div>
                ) : customerData?.upcomingJobs && customerData.upcomingJobs.length > 0 ? (
                  <div className="divide-y divide-[#e5e5e5]">
                    {customerData.upcomingJobs.slice(0, 3).map((job) => (
                      <div key={job.id} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="font-body font-medium text-[#1a1a1a]">{job.service?.name || 'Service'}</p>
                          <p className="font-body text-sm text-[#666]">
                            {formatDate(job.scheduled_date)}
                            {job.scheduled_time_start && ` at ${formatTime(job.scheduled_time_start)}`}
                          </p>
                        </div>
                        <span className={`font-body text-xs px-2 py-1 rounded-full ${getStatusColor(job.status)}`}>
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="font-body text-[#666] text-sm">No upcoming services scheduled.</p>
                    <button
                      onClick={handleBookService}
                      className="mt-3 font-body text-[#2A54A1] text-sm font-medium"
                    >
                      Book your first service →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="font-body font-semibold text-[#1a1a1a] mb-3">Recent activity</h2>
              <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
                {dataLoading ? (
                  <div className="p-4 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-[#2A54A1] border-t-transparent rounded-full" />
                  </div>
                ) : customerData?.recentJobs && customerData.recentJobs.length > 0 ? (
                  <div className="divide-y divide-[#e5e5e5]">
                    {customerData.recentJobs.slice(0, 3).map((job) => (
                      <div key={job.id} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="font-body font-medium text-[#1a1a1a]">{job.service?.name || 'Service'}</p>
                          <p className="font-body text-sm text-[#666]">{formatDate(job.scheduled_date)}</p>
                        </div>
                        <span className={`font-body text-xs px-2 py-1 rounded-full ${getStatusColor(job.status)}`}>
                          Completed
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="font-body text-[#666] text-sm">No recent activity.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            {/* Past Appointments */}
            <div>
              <h2 className="font-body font-semibold text-[#666] text-sm mb-3 uppercase tracking-wide">Past Appointments</h2>
              <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
                {dataLoading ? (
                  <div className="p-4 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-[#2A54A1] border-t-transparent rounded-full" />
                  </div>
                ) : customerData?.allJobs && customerData.allJobs.filter(j => j.status === 'completed').length > 0 ? (
                  <div className="divide-y divide-[#e5e5e5]">
                    {customerData.allJobs.filter(j => j.status === 'completed').slice(0, 10).map((job) => (
                      <div key={job.id} className="px-4 py-3 flex items-center justify-between hover:bg-[#faf8f5] transition">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-body font-medium text-[#1a1a1a]">{job.service?.name || 'Service'}</p>
                            <p className="font-body text-sm text-[#666]">{formatDate(job.scheduled_date)}</p>
                          </div>
                        </div>
                        {job.price && (
                          <span className="font-body text-sm text-[#666]">{formatCurrency(job.price)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="font-body text-[#666] text-sm">No past appointments.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Invoices */}
            <div>
              <h2 className="font-body font-semibold text-[#666] text-sm mb-3 uppercase tracking-wide">Invoices</h2>
              <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
                {dataLoading ? (
                  <div className="p-4 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-[#2A54A1] border-t-transparent rounded-full" />
                  </div>
                ) : customerData?.invoices && customerData.invoices.length > 0 ? (
                  <div className="divide-y divide-[#e5e5e5]">
                    {customerData.invoices.map((invoice) => (
                      <div key={invoice.id} className="px-4 py-3 flex items-center justify-between hover:bg-[#faf8f5] transition">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            invoice.status === 'paid' ? 'bg-[#E8F5E9]' :
                            invoice.status === 'overdue' ? 'bg-[#FEE8E8]' : 'bg-[#E8F0FE]'
                          }`}>
                            <svg className={`w-5 h-5 ${
                              invoice.status === 'paid' ? 'text-[#4CAF50]' :
                              invoice.status === 'overdue' ? 'text-[#E53935]' : 'text-[#4285F4]'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-body font-medium text-[#1a1a1a]">{formatCurrency(invoice.total)}</p>
                            <p className="font-body text-sm text-[#666]">
                              {invoice.billing_period_start && invoice.billing_period_end
                                ? `${formatDate(invoice.billing_period_start)} - ${formatDate(invoice.billing_period_end)}`
                                : formatDate(invoice.created_at)}
                            </p>
                          </div>
                        </div>
                        <span className={`font-body text-xs px-2 py-1 rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="font-body text-[#666] text-sm">No invoices.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plan' && (
          <div className="space-y-6">
            {/* Scheduled Services */}
            <div>
              <h2 className="font-body font-semibold text-[#666] text-sm mb-3 uppercase tracking-wide">Scheduled</h2>
              <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
                {dataLoading ? (
                  <div className="p-4 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-[#2A54A1] border-t-transparent rounded-full" />
                  </div>
                ) : customerData?.upcomingJobs && customerData.upcomingJobs.length > 0 ? (
                  <div className="divide-y divide-[#e5e5e5]">
                    {customerData.upcomingJobs.map((job) => (
                      <div key={job.id} className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#E8F0FE] flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#4285F4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-body font-medium text-[#1a1a1a]">{job.service?.name || 'Service'}</p>
                            <p className="font-body text-sm text-[#666]">
                              {formatDate(job.scheduled_date)}
                              {job.scheduled_time_start && ` at ${formatTime(job.scheduled_time_start)}`}
                            </p>
                          </div>
                        </div>
                        {job.is_recurring && (
                          <span className="font-body text-xs px-2 py-1 rounded-full bg-[#E8F0FE] text-[#4285F4]">
                            Recurring
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="font-body text-[#666] text-sm">No scheduled services.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recurring Services */}
            <div>
              <h2 className="font-body font-semibold text-[#666] text-sm mb-3 uppercase tracking-wide">Your Plan</h2>
              <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
                {customerData?.recurringServices && customerData.recurringServices.length > 0 ? (
                  <div className="divide-y divide-[#e5e5e5]">
                    {customerData.recurringServices.map((item: any, idx: number) => (
                      <div key={idx} className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#F3E8FE] flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#9C27B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-body font-medium text-[#1a1a1a]">{item.service?.name || 'Service'}</p>
                            <p className="font-body text-sm text-[#666]">
                              {item.recurrence_rule?.frequency || 'Recurring'}
                            </p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="font-body text-[#666] text-sm">No recurring services set up.</p>
                    <button className="mt-3 font-body text-[#2A54A1] text-sm font-medium">Set up a recurring plan →</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="space-y-6">
            {/* People Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-body font-semibold text-[#666] text-sm uppercase tracking-wide">People</h2>
              </div>
              <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden divide-y divide-[#e5e5e5]">
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#faf8f5] transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2A54A1] flex items-center justify-center text-white font-body font-medium text-sm">
                      {initials}
                    </div>
                    <span className="font-body font-medium text-[#1a1a1a]">{customerName}</span>
                  </div>
                  <svg className="w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Property Section */}
            <div>
              <h2 className="font-body font-semibold text-[#666] text-sm mb-3 uppercase tracking-wide">Property</h2>
              <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden divide-y divide-[#e5e5e5]">
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#faf8f5] transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F0FE] flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#4285F4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-body font-medium text-[#1a1a1a]">Property details</p>
                      <p className="font-body text-sm text-[#666]">{address}</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Support Section */}
            <div>
              <h2 className="font-body font-semibold text-[#666] text-sm mb-3 uppercase tracking-wide">Support</h2>
              <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden divide-y divide-[#e5e5e5]">
                <a href={`mailto:${organization.contact_email || 'concierge@handldhome.com'}`} className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#faf8f5] transition">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div className="text-left">
                      <p className="font-body font-medium text-[#1a1a1a]">Email us</p>
                      <p className="font-body text-sm text-[#666]">{organization.contact_email || 'concierge@handldhome.com'}</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                <a href={`tel:${organization.contact_phone || '6262987128'}`} className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#faf8f5] transition">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div className="text-left">
                      <p className="font-body font-medium text-[#1a1a1a]">Call us</p>
                      <p className="font-body text-sm text-[#666]">(626) 298-7128</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Settings Section */}
            <div>
              <h2 className="font-body font-semibold text-[#666] text-sm mb-3 uppercase tracking-wide">Settings</h2>
              <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden divide-y divide-[#e5e5e5]">
                {hasMultipleAccounts && (
                  <Link href="/account" className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#faf8f5] transition">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      <span className="font-body font-medium text-[#1a1a1a]">Switch account</span>
                    </div>
                    <svg className="w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
                <button onClick={handleSignOut} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#faf8f5] transition">
                  <svg className="w-5 h-5 text-[#E53935]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-body font-medium text-[#E53935]">Sign out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e5e5] px-6 py-2 flex items-center justify-around">
        <TabButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon="home" label="Home" />
        <TabButton active={activeTab === 'services'} onClick={() => setActiveTab('services')} icon="services" label="Services" />
        <TabButton active={activeTab === 'plan'} onClick={() => setActiveTab('plan')} icon="plan" label="Plan" />
        <TabButton active={activeTab === 'account'} onClick={() => setActiveTab('account')} icon="account" label="Account" />
      </nav>

      {/* Book a Service Dialog */}
      {bookingStep && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeBookingDialog} />
          <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] overflow-hidden">
            {/* Dialog Header */}
            <div className="sticky top-0 bg-white border-b border-[#e5e5e5] px-5 py-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#1a1a1a]">
                {bookingStep === 'select' && 'Book a Service'}
                {bookingStep === 'confirm' && 'Confirm Request'}
                {bookingStep === 'success' && 'Request Submitted'}
              </h2>
              <button onClick={closeBookingDialog} className="p-2 -mr-2 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Dialog Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-140px)] p-5">
              {bookingStep === 'select' && (
                <div className="grid grid-cols-2 gap-3">
                  {SERVICES_LIST.map((service) => (
                    <button
                      key={service.name}
                      onClick={() => handleSelectService(service.name)}
                      className="bg-white border border-[#e5e5e5] rounded-xl p-4 text-left hover:border-[#2A54A1] hover:shadow-md transition group"
                    >
                      <div className="text-2xl mb-2">{service.icon}</div>
                      <p className="font-body font-medium text-[#1a1a1a] text-sm group-hover:text-[#2A54A1]">
                        {service.name}
                      </p>
                      <p className="font-body text-xs text-[#666] mt-1">{service.description}</p>
                    </button>
                  ))}
                </div>
              )}

              {bookingStep === 'confirm' && selectedService && (
                <div className="space-y-6">
                  <div className="bg-[#F8F9FA] rounded-xl p-4">
                    <p className="font-body font-semibold text-[#1a1a1a] mb-3">
                      {SERVICES_LIST.find(s => s.name === selectedService)?.icon} {selectedService}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-[#666]">📍</span>
                        <span className="font-body text-[#1a1a1a]">{address}</span>
                      </div>
                      {profile.square_footage && (
                        <div className="flex items-center gap-2">
                          <span className="text-[#666]">📐</span>
                          <span className="font-body text-[#1a1a1a]">
                            {profile.square_footage.toLocaleString()} sq ft
                            {profile.stories && ` · ${profile.stories} ${profile.stories === 1 ? 'story' : 'stories'}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="font-body text-[#666] text-sm">
                    We'll prepare a quote based on your home details and text it to you within a few minutes.
                  </p>

                  {bookingError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="font-body text-red-700 text-sm">{bookingError}</p>
                    </div>
                  )}
                </div>
              )}

              {bookingStep === 'success' && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#1a1a1a] mb-2">Quote Requested!</h3>
                  <p className="font-body text-[#666] mb-4">
                    Your <strong>{selectedService}</strong> quote is being prepared.
                  </p>
                  {profile?.phone && (
                    <p className="font-body text-sm text-[#666]">
                      You'll receive a text at <strong>{profile.phone}</strong> within a few minutes with a link to view your quote.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[#e5e5e5] px-5 py-4">
              {bookingStep === 'select' && (
                <button
                  onClick={closeBookingDialog}
                  className="w-full py-3 font-body font-medium text-[#666] hover:text-[#1a1a1a]"
                >
                  Cancel
                </button>
              )}

              {bookingStep === 'confirm' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setBookingStep('select')}
                    className="flex-1 py-3 font-body font-medium text-[#666] border border-[#e5e5e5] rounded-xl hover:bg-[#faf8f5]"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    disabled={isSubmitting}
                    className="flex-1 py-3 font-body font-medium text-white bg-[#2A54A1] rounded-xl hover:bg-[#1e3d7a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Submitting...
                      </>
                    ) : (
                      'Get My Quote'
                    )}
                  </button>
                </div>
              )}

              {bookingStep === 'success' && (
                <button
                  onClick={closeBookingDialog}
                  className="w-full py-3 font-body font-medium text-white bg-[#2A54A1] rounded-xl hover:bg-[#1e3d7a]"
                >
                  Back to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  const color = active ? '#2A54A1' : '#999';

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 py-1 px-3">
      {icon === 'home' && (
        <svg className="w-6 h-6" fill={active ? color : 'none'} stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )}
      {icon === 'services' && (
        <svg className="w-6 h-6" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )}
      {icon === 'plan' && (
        <svg className="w-6 h-6" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )}
      {icon === 'account' && (
        <svg className="w-6 h-6" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )}
      <span className={`font-body text-xs ${active ? 'text-[#2A54A1] font-medium' : 'text-[#999]'}`}>{label}</span>
    </button>
  );
}
