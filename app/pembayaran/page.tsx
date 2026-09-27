import { redirect } from 'next/navigation';
import { getTenantSession } from '@/lib/auth/session';
import { getTenantPayments } from '@/lib/db/monthly-payments';
import { TenantPaymentDashboard } from '@/components/tenant/TenantPaymentDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Pembayaran Penyewa',
  description: 'Cek tagihan dan tenggat pembayaran sewa bulanan Anda di Harmony Home.',
};

export default async function PembayaranPage() {
  const session = await getTenantSession();

  if (!session?.user) {
    redirect('/pembayaran/login?callbackUrl=/pembayaran');
  }

  const user = session.user as unknown as { id: string; name?: string | null; email?: string | null };
  const views = await getTenantPayments(user.id);

  return (
    <TenantPaymentDashboard
      name={user.name ?? 'Penyewa'}
      email={user.email ?? ''}
      views={views}
    />
  );
}
