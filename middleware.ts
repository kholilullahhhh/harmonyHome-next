import { getToken } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_ROLES = new Set(['ADMIN', 'STAFF']);

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const role = typeof token?.role === 'string' ? token.role : '';
  const { pathname } = req.nextUrl;

  // Tenant portal: guests go to the tenant login, admins go back to /admin.
  if (pathname === '/pembayaran/login') {
    if (token && role === 'PENYEWA') {
      const url = req.nextUrl.clone();
      url.pathname = '/pembayaran';
      url.search = '';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === '/pembayaran') {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/pembayaran/login';
      url.search = '';
      url.searchParams.set('callbackUrl', '/pembayaran');
      return NextResponse.redirect(url);
    }
    if (role !== 'PENYEWA') {
      const url = req.nextUrl.clone();
      url.pathname = ADMIN_ROLES.has(role) ? '/admin' : '/pembayaran/login';
      url.search = '';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // API admin: return 401/403 JSON so client fetch() calls fail cleanly
  // instead of receiving an HTML login page.
  if (pathname.startsWith('/api/admin')) {
    if (!token) {
      return NextResponse.json(
        { error: 'Tidak terautentikasi.' },
        { status: 401 }
      );
    }
    if (!ADMIN_ROLES.has(role)) {
      return NextResponse.json(
        { error: 'Anda tidak memiliki akses ke resource ini.' },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  // Public admin route (login page) stays accessible.
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Admin pages: guests go to login, tenants go to their own page.
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set(
      'callbackUrl',
      pathname + req.nextUrl.search
    );
    return NextResponse.redirect(url);
  }

  if (!ADMIN_ROLES.has(role)) {
    const url = req.nextUrl.clone();
    url.pathname = '/pembayaran';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/pembayaran',
    '/pembayaran/login',
  ],
};
