import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  if (pathname.startsWith('/vault-ops')) {
    const hasAccessCookie = request.cookies.has('syndicate-access');
    const accessQuery = url.searchParams.get('access');

    const vaultKey = process.env.ADMIN_SECRET;
    if (!vaultKey) {
      url.pathname = '/404';
      return NextResponse.rewrite(url);
    }
    if (accessQuery === vaultKey) {
      const response = NextResponse.next();
      response.cookies.set('syndicate-access', 'true', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    if (!hasAccessCookie) {
      url.pathname = '/404';
      return NextResponse.rewrite(url);
    }
  }

  // Protect /member/* — startsWith handles both /member/login and /member/login/
  if (pathname.startsWith('/member') && !pathname.startsWith('/member/login')) {
    const hasMemberSession = request.cookies.has('member_session');
    if (!hasMemberSession) {
      const loginUrl = request.nextUrl.clone();
      // Use trailing slash — trailingSlash:true in next.config.mjs requires it
      // to avoid a 308 redirect loop before middleware runs again
      loginUrl.pathname = '/member/login/';
      loginUrl.search = '';
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Cover both bare paths and trailing-slash variants produced by trailingSlash:true
  matcher: ['/vault-ops', '/vault-ops/(.*)', '/member', '/member/(.*)'],
};
