import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Routes that require authentication
const protectedRoutes = ['/account'];
const publicAccountRoutes = ['/account/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicAccountRoute = publicAccountRoutes.some(route => pathname.startsWith(route));

  // Only run auth check for protected routes
  if (isProtectedRoute && !isPublicAccountRoute) {
    const { supabaseResponse, user } = await updateSession(request);

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/account/login';
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  // For auth callback, update session
  if (pathname.startsWith('/auth/callback')) {
    const { supabaseResponse } = await updateSession(request);
    return supabaseResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
