import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard'];

// Routes only accessible when NOT logged in
const AUTH_ROUTES = ['/login', '/signup'];

// Role-based route map
const ROLE_ROUTES: Record<string, string> = {
  client: '/dashboard/client',
  coach: '/dashboard/coach',
  admin: '/dashboard/admin',
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = req.nextUrl;

  // If visiting a protected route without a session → redirect to login
  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r));
  if (isProtected && !session) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // If visiting auth pages while logged in → redirect to correct dashboard
  const isAuthRoute = AUTH_ROUTES.some(r => pathname.startsWith(r));
  if (isAuthRoute && session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const role = profile?.role ?? 'client';
    const url = req.nextUrl.clone();
    url.pathname = ROLE_ROUTES[role] ?? '/dashboard/client';
    return NextResponse.redirect(url);
  }

  // Role guard: prevent a client accessing /dashboard/coach or /dashboard/admin
  if (session && pathname.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const role = profile?.role ?? 'client';
    const allowedBase = ROLE_ROUTES[role];

    // Allow admin to access everything
    if (role === 'admin') return res;

    // Redirect if accessing wrong dashboard
    if (!pathname.startsWith(allowedBase)) {
      const url = req.nextUrl.clone();
      url.pathname = allowedBase;
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
  ],
};
