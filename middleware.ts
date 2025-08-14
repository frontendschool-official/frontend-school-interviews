import { NextRequest, NextResponse } from 'next/server';

// Routes that don't require authentication
const publicRoutes = [
  '/api/auth/session',
  '/api/swagger',
  '/api/test-auth',
  '/api/test-order',
  '/api/test-payment',
  '/api/test-session-cookie',
  '/api/verify-payment',
  '/api/save-payment',
  '/api/create-order',
];

// Routes that should skip authentication entirely
const skipAuthRoutes = [
  '/api/swagger',
  '/api/test-auth',
  '/api/test-order',
  '/api/test-payment',
  '/api/test-session-cookie',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for non-API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip authentication for specific routes
  if (skipAuthRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // For public routes, allow access but don't add user ID
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // For protected routes, check for session cookie
  // The actual verification will be done in the API routes using withRequiredAuth
  const sessionCookie = request.cookies.get('session')?.value;

  if (!sessionCookie) {
    // Fast path: short-circuit unauthorized API calls without body parsing
    return new NextResponse(
      JSON.stringify({ error: 'Authentication required' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  }

  // Pass through to API routes - they will handle the actual verification
  const response = NextResponse.next();
  // Ensure API responses are not cached at the edge by default
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/api/:path*',
  ],
};
