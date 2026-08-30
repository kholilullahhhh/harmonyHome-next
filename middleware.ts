import { getToken } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // API admin: return 401 JSON so client fetch() calls fail cleanly
  // instead of receiving an HTML login page.
  if (pathname.startsWith('/api/admin')) {
    if (!token) {
      return NextResponse.json(
        { error: 'Tidak terautentikasi.' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Public admin route (login page) stays accessible.
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Admin pages: redirect to login with callbackUrl.
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set(
      'callbackUrl',
      pathname + req.nextUrl.search
    );
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};