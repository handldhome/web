import { createServiceClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /account/login/[token]
 *
 * Magic link login - validates token and creates a session for the customer.
 * Provides instant access without requiring email/phone verification.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const baseUrl = new URL(request.url).origin;

  if (!token || token.length < 16) {
    return NextResponse.redirect(new URL('/account/login?error=invalid_token', baseUrl));
  }

  // Use service client for admin operations
  const supabaseAdmin = await createServiceClient();
  const supabase = await createClient();

  // Find the customer profile with this magic link token
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('customer_profiles')
    .select(`
      id,
      user_id,
      email,
      phone,
      first_name,
      last_name,
      organization_id,
      organization:organizations (
        id,
        slug
      )
    `)
    .eq('magic_link_token', token)
    .eq('is_active', true)
    .single();

  if (profileError || !profile) {
    console.error('Magic link token not found:', profileError);
    return NextResponse.redirect(new URL('/account/login?error=invalid_token', baseUrl));
  }

  const orgSlug = (profile.organization as any)?.slug;
  const redirectUrl = `/account/${orgSlug}`;

  // If profile already has a linked user, sign them in
  if (profile.user_id) {
    // Get the user's email to generate a magic link
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(profile.user_id);

    if (authUser?.user) {
      // Generate a one-time magic link for this user
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: authUser.user.email!,
        options: {
          redirectTo: `${baseUrl}${redirectUrl}`,
        },
      });

      if (!linkError && linkData?.properties?.hashed_token) {
        // Verify the token to create a session
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: linkData.properties.hashed_token,
          type: 'magiclink',
        });

        if (!verifyError) {
          return NextResponse.redirect(new URL(redirectUrl, baseUrl));
        }
      }
    }
  }

  // No user exists yet - create one
  const email = profile.email || `${token}@portal.handldhome.com`;
  const phone = profile.phone?.replace(/\D/g, '');

  // Create a new user with a random password (they'll use magic links to log in)
  const tempPassword = crypto.randomUUID();

  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    phone: phone ? (phone.startsWith('1') ? `+${phone}` : `+1${phone}`) : undefined,
    password: tempPassword,
    email_confirm: true,
    phone_confirm: true,
    user_metadata: {
      first_name: profile.first_name,
      last_name: profile.last_name,
    },
  });

  if (createError) {
    // User might already exist with this email/phone - try to find them
    if (createError.message.includes('already exists')) {
      // Look up existing user by email
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const users = existingUsers?.users as Array<{ id: string; email?: string; phone?: string }> | undefined;
      const existingUser = users?.find(
        u => u.email === email || (phone && u.phone === `+1${phone}`)
      );

      if (existingUser) {
        // Link the profile to this user
        await supabaseAdmin
          .from('customer_profiles')
          .update({ user_id: existingUser.id })
          .eq('id', profile.id);

        // Generate magic link for existing user
        const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
          type: 'magiclink',
          email: existingUser.email!,
          options: {
            redirectTo: `${baseUrl}${redirectUrl}`,
          },
        });

        if (linkData?.properties?.hashed_token) {
          await supabase.auth.verifyOtp({
            token_hash: linkData.properties.hashed_token,
            type: 'magiclink',
          });
          return NextResponse.redirect(new URL(redirectUrl, baseUrl));
        }
      }
    }

    console.error('Failed to create user:', createError);
    return NextResponse.redirect(new URL('/account/login?error=auth_failed', baseUrl));
  }

  // Link the new user to the profile
  if (newUser?.user) {
    await supabaseAdmin
      .from('customer_profiles')
      .update({ user_id: newUser.user.id })
      .eq('id', profile.id);

    // Sign in the new user
    const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: newUser.user.email!,
      options: {
        redirectTo: `${baseUrl}${redirectUrl}`,
      },
    });

    if (linkData?.properties?.hashed_token) {
      await supabase.auth.verifyOtp({
        token_hash: linkData.properties.hashed_token,
        type: 'magiclink',
      });
      return NextResponse.redirect(new URL(redirectUrl, baseUrl));
    }
  }

  return NextResponse.redirect(new URL('/account/login', baseUrl));
}
