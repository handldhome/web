import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  params: Promise<{ 'org-slug': string }>;
}

interface CustomerProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  formatted_address: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  square_footage: number | null;
  lot_size: number | null;
  stories: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  year_built: number | null;
  property_type: string | null;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  type: string;
  contact_email: string | null;
  contact_phone: string | null;
  settings: {
    branding?: {
      logo_url?: string;
      primary_color?: string;
    };
  } | null;
}

export default async function PortalPage({ params }: Props) {
  const { 'org-slug': orgSlug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/account/login');
  }

  // Fetch organization
  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, slug, type, contact_email, contact_phone, settings')
    .eq('slug', orgSlug)
    .eq('is_active', true)
    .single();

  if (!org) {
    notFound();
  }

  const organization = org as Organization;

  // Fetch customer profile for this user + org
  const { data: profile } = await supabase
    .from('customer_profiles')
    .select('*')
    .eq('user_id', user.id)
    .eq('organization_id', organization.id)
    .eq('is_active', true)
    .single();

  if (!profile) {
    // User doesn't have a profile with this org
    redirect('/account');
  }

  const customerProfile = profile as CustomerProfile;

  // Check if user has multiple profiles (for "Switch Account" link)
  const { count: profileCount } = await supabase
    .from('customer_profiles')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_active', true);

  const hasMultipleAccounts = (profileCount || 0) > 1;
  const brandColor = organization.settings?.branding?.primary_color || '#2A54A1';
  const customerName = [customerProfile.first_name, customerProfile.last_name].filter(Boolean).join(' ') || 'Customer';

  const handleSignOut = async () => {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/');
  };

  return (
    <div className="min-h-screen bg-[#FFFFF2]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap');
        .font-display { font-family: 'Libre Baskerville', serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        .shadow-retro { box-shadow: 8px 8px 0px rgba(42, 84, 161, 0.15); }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b-2 border-[#2A54A1]/10 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {organization.settings?.branding?.logo_url ? (
                <img
                  src={organization.settings.branding.logo_url}
                  alt={organization.name}
                  className="h-12 w-auto"
                />
              ) : (
                <div
                  className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-display font-bold text-xl"
                  style={{ backgroundColor: brandColor }}
                >
                  {organization.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="font-display font-bold text-[#2A54A1]">{organization.name}</h1>
                <p className="font-body text-xs text-[#2A54A1]/60">{customerName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {hasMultipleAccounts && (
                <Link
                  href="/account"
                  className="font-body text-sm text-[#2A54A1]/70 hover:text-[#2A54A1] transition"
                >
                  Switch Account
                </Link>
              )}
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="font-body text-sm text-[#2A54A1]/70 hover:text-[#2A54A1] transition"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Property Card */}
          <div className="bg-white rounded-2xl shadow-retro border-2 border-[#2A54A1]/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                <svg className="w-5 h-5" style={{ color: brandColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h2 className="font-display font-bold text-[#2A54A1]">Your Property</h2>
            </div>

            <div className="space-y-3 font-body text-sm">
              <div>
                <span className="text-[#2A54A1]/60">Address</span>
                <p className="text-[#2A54A1]">
                  {customerProfile.formatted_address ||
                    [customerProfile.address_line1, customerProfile.city, customerProfile.state, customerProfile.zip_code]
                      .filter(Boolean)
                      .join(', ') ||
                    'Not set'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {customerProfile.square_footage && (
                  <div>
                    <span className="text-[#2A54A1]/60">Square Footage</span>
                    <p className="text-[#2A54A1] font-medium">{customerProfile.square_footage.toLocaleString()} sq ft</p>
                  </div>
                )}
                {customerProfile.lot_size && (
                  <div>
                    <span className="text-[#2A54A1]/60">Lot Size</span>
                    <p className="text-[#2A54A1] font-medium">{customerProfile.lot_size.toLocaleString()} sq ft</p>
                  </div>
                )}
                {customerProfile.stories && (
                  <div>
                    <span className="text-[#2A54A1]/60">Stories</span>
                    <p className="text-[#2A54A1] font-medium">{customerProfile.stories}</p>
                  </div>
                )}
                {customerProfile.year_built && (
                  <div>
                    <span className="text-[#2A54A1]/60">Year Built</span>
                    <p className="text-[#2A54A1] font-medium">{customerProfile.year_built}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-white rounded-2xl shadow-retro border-2 border-[#2A54A1]/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                <svg className="w-5 h-5" style={{ color: brandColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-display font-bold text-[#2A54A1]">Contact</h2>
            </div>

            <div className="space-y-3 font-body text-sm">
              {organization.contact_email && (
                <div>
                  <span className="text-[#2A54A1]/60">Email</span>
                  <p>
                    <a href={`mailto:${organization.contact_email}`} className="text-[#2A54A1] hover:underline">
                      {organization.contact_email}
                    </a>
                  </p>
                </div>
              )}
              {organization.contact_phone && (
                <div>
                  <span className="text-[#2A54A1]/60">Phone</span>
                  <p>
                    <a href={`tel:${organization.contact_phone}`} className="text-[#2A54A1] hover:underline">
                      {organization.contact_phone}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quotes Card - Coming Soon */}
          <div className="bg-white rounded-2xl shadow-retro border-2 border-[#2A54A1]/10 p-6 opacity-60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#FBF9F0]">
                <svg className="w-5 h-5 text-[#2A54A1]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="font-display font-bold text-[#2A54A1]">Quotes</h2>
                <span className="font-body text-xs bg-[#FBF9F0] text-[#2A54A1]/60 px-2 py-0.5 rounded-full">Coming Soon</span>
              </div>
            </div>
            <p className="font-body text-sm text-[#2A54A1]/60">Your quotes will appear here.</p>
          </div>

          {/* Service History Card - Coming Soon */}
          <div className="bg-white rounded-2xl shadow-retro border-2 border-[#2A54A1]/10 p-6 opacity-60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#FBF9F0]">
                <svg className="w-5 h-5 text-[#2A54A1]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="font-display font-bold text-[#2A54A1]">Service History</h2>
                <span className="font-body text-xs bg-[#FBF9F0] text-[#2A54A1]/60 px-2 py-0.5 rounded-full">Coming Soon</span>
              </div>
            </div>
            <p className="font-body text-sm text-[#2A54A1]/60">Your service history will appear here.</p>
          </div>

          {/* Invoices Card - Coming Soon */}
          <div className="bg-white rounded-2xl shadow-retro border-2 border-[#2A54A1]/10 p-6 opacity-60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#FBF9F0]">
                <svg className="w-5 h-5 text-[#2A54A1]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="font-display font-bold text-[#2A54A1]">Invoices</h2>
                <span className="font-body text-xs bg-[#FBF9F0] text-[#2A54A1]/60 px-2 py-0.5 rounded-full">Coming Soon</span>
              </div>
            </div>
            <p className="font-body text-sm text-[#2A54A1]/60">Your invoices will appear here.</p>
          </div>

          {/* Book Service Card - Coming Soon */}
          <div className="bg-white rounded-2xl shadow-retro border-2 border-[#2A54A1]/10 p-6 opacity-60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#FBF9F0]">
                <svg className="w-5 h-5 text-[#2A54A1]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="font-display font-bold text-[#2A54A1]">Book a Service</h2>
                <span className="font-body text-xs bg-[#FBF9F0] text-[#2A54A1]/60 px-2 py-0.5 rounded-full">Coming Soon</span>
              </div>
            </div>
            <p className="font-body text-sm text-[#2A54A1]/60">Schedule new services directly from your portal.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-8 text-center">
        <Link href="/" className="font-body text-sm text-[#2A54A1]/60 hover:text-[#2A54A1] transition">
          &larr; Back to {organization.name}
        </Link>
      </footer>
    </div>
  );
}
