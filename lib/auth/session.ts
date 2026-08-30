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
