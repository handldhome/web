'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Tab = 'home' | 'services' | 'plan' | 'account';

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

export default function PortalPage({ params }: { params: Promise<{ 'org-slug': string }> }) {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [hasMultipleAccounts, setHasMultipleAccounts] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const { 'org-slug': orgSlug } = await params;
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/account/login');
        return;
      }

      // Fetch organization
      const { data: org } = await supabase
        .from('organizations')
        .select('id, name, slug, contact_email, contact_phone, settings')
        .eq('slug', orgSlug)
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
    }

    loadData();
  }, [params, router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
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
              <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-[#faf8f5] transition">
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
              <button className="bg-white rounded-2xl border border-[#e5e5e5] p-4 flex flex-col items-start gap-2 hover:bg-[#faf8f5] transition">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3E8] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#F4A442]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="font-body font-medium text-[#1a1a1a] text-sm">Message us</span>
              </button>

              <button className="bg-white rounded-2xl border border-[#e5e5e5] p-4 flex flex-col items-start gap-2 hover:bg-[#faf8f5] transition">
                <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="font-body font-medium text-[#1a1a1a] text-sm">Call us</span>
              </button>
            </div>

            {/* Upcoming */}
            <div>
              <h2 className="font-body font-semibold text-[#1a1a1a] mb-3">Upcoming</h2>
              <div className="bg-white rounded-2xl border border-[#e5e5e5] p-4">
                <p className="font-body text-[#666] text-sm">No upcoming services scheduled.</p>
                <button className="mt-3 font-body text-[#2A54A1] text-sm font-medium">Book your first service →</button>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="font-body font-semibold text-[#1a1a1a] mb-3">Recent activity</h2>
              <div className="bg-white rounded-2xl border border-[#e5e5e5] p-4">
                <p className="font-body text-[#666] text-sm">No recent activity.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            {/* Service History Section */}
            <div>
              <h2 className="font-body font-semibold text-[#666] text-sm mb-3 uppercase tracking-wide">History</h2>
              <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden divide-y divide-[#e5e5e5]">
                <ListItem icon="calendar" iconBg="#E8F0FE" iconColor="#4285F4" title="Appointments" />
                <ListItem icon="document" iconBg="#E8F5E9" iconColor="#4CAF50" title="Service reports" />
              </div>
            </div>

            {/* Billing Section */}
            <div>
              <h2 className="font-body font-semibold text-[#666] text-sm mb-3 uppercase tracking-wide">Billing</h2>
              <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden divide-y divide-[#e5e5e5]">
                <ListItem icon="estimate" iconBg="#FEF3E8" iconColor="#F4A442" title="Estimates" />
                <ListItem icon="invoice" iconBg="#E8F5E9" iconColor="#4CAF50" title="Invoices" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plan' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-body font-semibold text-[#666] text-sm mb-3 uppercase tracking-wide">Scheduled</h2>
              <div className="bg-white rounded-2xl border border-[#e5e5e5] p-4">
                <p className="font-body text-[#666] text-sm">No scheduled services.</p>
              </div>
            </div>

            <div>
              <h2 className="font-body font-semibold text-[#666] text-sm mb-3 uppercase tracking-wide">Recommended</h2>
              <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden divide-y divide-[#e5e5e5]">
                <ListItem
                  icon="gutter"
                  iconBg="#FEE8E8"
                  iconColor="#E53935"
                  title="Gutter Cleaning"
                  subtitle="Recommended every 6 months"
                />
                <ListItem
                  icon="window"
                  iconBg="#E8F0FE"
                  iconColor="#4285F4"
                  title="Window Washing"
                  subtitle="Recommended every 3 months"
                />
                <ListItem
                  icon="pressure"
                  iconBg="#F3E8FE"
                  iconColor="#9C27B0"
                  title="Pressure Washing"
                  subtitle="Recommended annually"
                />
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
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#faf8f5] transition">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <div className="text-left">
                      <p className="font-body font-medium text-[#1a1a1a]">Chat with us</p>
                      <p className="font-body text-sm text-[#666]">Available 8am to 6pm PST</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <a href={`tel:${organization.contact_phone || '6262987128'}`} className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#faf8f5] transition">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div className="text-left">
                      <p className="font-body font-medium text-[#1a1a1a]">Phone call</p>
                      <p className="font-body text-sm text-[#666]">Available 8am to 6pm PST</p>
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
        <TabButton
          active={activeTab === 'home'}
          onClick={() => setActiveTab('home')}
          icon="home"
          label="Home"
        />
        <TabButton
          active={activeTab === 'services'}
          onClick={() => setActiveTab('services')}
          icon="services"
          label="Services"
        />
        <TabButton
          active={activeTab === 'plan'}
          onClick={() => setActiveTab('plan')}
          icon="plan"
          label="Plan"
        />
        <TabButton
          active={activeTab === 'account'}
          onClick={() => setActiveTab('account')}
          icon="account"
          label="Account"
        />
      </nav>
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

function ListItem({ icon, iconBg, iconColor, title, subtitle }: { icon: string; iconBg: string; iconColor: string; title: string; subtitle?: string }) {
  const getIcon = () => {
    switch (icon) {
      case 'calendar':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
      case 'document':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />;
      case 'estimate':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />;
      case 'invoice':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />;
      case 'gutter':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />;
      case 'window':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 12h16M12 4v16" />;
      case 'pressure':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />;
      default:
        return null;
    }
  };

  return (
    <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#faf8f5] transition">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: iconBg }}>
          <svg className="w-5 h-5" style={{ color: iconColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {getIcon()}
          </svg>
        </div>
        <div className="text-left">
          <p className="font-body font-medium text-[#1a1a1a]">{title}</p>
          {subtitle && <p className="font-body text-sm text-[#666]">{subtitle}</p>}
        </div>
      </div>
      <svg className="w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
