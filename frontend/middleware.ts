import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for admin-login page
  if (pathname === '/admin-login') {
    return NextResponse.next();
  }
  
  // Check for auth token in cookies
  const authToken = request.cookies.get('auth_token')?.value;
  
  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    // All admin routes require authentication
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
    '/admin/((?!-login).*)', // Match /admin/* but exclude /admin-login
    '/account/:path*',
  ],
};
