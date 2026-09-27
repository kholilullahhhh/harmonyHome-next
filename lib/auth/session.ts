import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/config';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) {
    redirect('/admin/login');
  }
  return session;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }
  return session;
}

function sessionRole(session: Awaited<ReturnType<typeof getSession>>): string | null {
  const role = session?.user
    ? ((session.user as unknown as { role?: string }).role ?? null)
    : null;
  return role;
}

/** Admin/staff session for API routes (middleware already blocks guests). */
export async function requireAdminSession() {
  const session = await getSession();
  const role = sessionRole(session);
  if (!session?.user || role === 'PENYEWA' || role === null) {
    return null;
  }
  return session;
}

/** Tenant (penyewa) session — used by /pembayaran. */
export async function getTenantSession() {
  const session = await getSession();
  const role = sessionRole(session);
  if (!session?.user || role !== 'PENYEWA') {
    return null;
  }
  return session;
}

export async function requireTenant() {
  const session = await getTenantSession();
  if (!session?.user) {
    redirect('/pembayaran/login');
  }
  return session;
}
