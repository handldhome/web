import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

interface CustomerProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  formatted_address: string | null;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  organization: {
    id: string;
    name: string;
    slug: string;
    type: string;
    settings: {
      branding?: {
        logo_url?: string;
        primary_color?: string;
      };
    } | null;
  };
}

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/account/login');
  }

  // Fetch customer profiles for this user
  const { data: profiles, error } = await supabase
    .from('customer_profiles')
    .select(`
      id,
      first_name,
      last_name,
      email,
      formatted_address,
      address_line1,
      city,
      state,
      organization:organizations (
        id,
        name,
        slug,
        type,
        settings
      )
    `)
    .eq('user_id', user.id)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching profiles:', error);
  }

  const customerProfiles = (profiles || []) as unknown as CustomerProfile[];

  // If user has exactly one profile, redirect directly to that portal
  if (customerProfiles.length === 1) {
    redirect(`/account/${customerProfiles[0].organization.slug}`);
  }

  const firstName = customerProfiles[0]?.first_name || user.email?.split('@')[0] || 'there';

  const handleSignOut = async () => {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/');
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Handld Home Services"
              width={120}
              height={40}
              className="h-auto"
            />
          </Link>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="text-sm text-gray-600 hover:text-navy transition"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif text-navy mb-2">
            Welcome back, {firstName}!
          </h1>
          <p className="text-gray-600">
            Select an account to view your services
          </p>
        </div>

        {customerProfiles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-soft p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-serif text-navy mb-3">No accounts found</h2>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find any service accounts linked to your email.
            </p>
            <p className="text-sm text-gray-500">
              If you believe this is an error, please contact us at{' '}
              <a href="mailto:support@handldhome.com" className="text-brandBlue hover:underline">
                support@handldhome.com
              </a>
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {customerProfiles.map((profile) => {
              const org = profile.organization;
              const brandColor = org.settings?.branding?.primary_color || '#2A54A1';
              const address = profile.formatted_address ||
                [profile.address_line1, profile.city, profile.state].filter(Boolean).join(', ') ||
                'Address not set';

              return (
                <Link
                  key={profile.id}
                  href={`/account/${org.slug}`}
                  className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-md transition group"
                >
                  <div className="flex items-start gap-4">
                    {org.settings?.branding?.logo_url ? (
                      <img
                        src={org.settings.branding.logo_url}
                        alt={org.name}
                        className="w-12 h-12 object-contain rounded-lg"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: brandColor }}
                      >
                        {org.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-navy group-hover:text-brandBlue transition">
                        {org.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {address}
                      </p>
                      {org.type === 'handld_home' && (
                        <span className="inline-block mt-2 text-xs bg-lightblue text-brandBlue px-2 py-0.5 rounded-full">
                          Handld Home
                        </span>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-brandBlue transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
