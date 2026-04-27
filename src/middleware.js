import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  
  if (url.pathname.startsWith('/vault-ops')) {
    const hasAccessCookie = request.cookies.has('syndicate-access');
    const accessQuery = url.searchParams.get('access');

    // If they have the correct query param, let them through and set a cookie
    const vaultKey = process.env.VAULT_ACCESS_KEY || 'syndicate';
    if (accessQuery === vaultKey) {
      const response = NextResponse.next();
      response.cookies.set('syndicate-access', 'true', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      return response;
    }

    // If no cookie and no query param, act like the page doesn't exist
    if (!hasAccessCookie) {
      url.pathname = '/404';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/vault-ops/:path*'],
};
