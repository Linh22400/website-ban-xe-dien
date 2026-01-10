import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for auth token in cookies or localStorage (via header)
  const authToken = request.cookies.get('auth_token')?.value;
  
  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    // Admin login page is public
    if (pathname === '/admin-login') {
      // If already authenticated, redirect to admin dashboard
      if (authToken) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }
    
    // All other admin routes require authentication
    if (!authToken) {
      const loginUrl = new URL('/admin-login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Account routes protection (softer check - handled by client-side)
  // We don't force redirect here to allow better UX
  if (pathname.startsWith('/account')) {
    if (!authToken) {
      // Set a header to inform client about auth status
      const response = NextResponse.next();
      response.headers.set('x-auth-required', 'true');
      return response;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
  ],
};
