import { getDashboardData } from '@/lib/db/dashboard';
import { maybeRunPaymentReminders } from '@/lib/db/reminders';
import { DashboardPage } from '@/components/admin/DashboardPage';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Lazy reminder run: keeps emails flowing even when no cron is configured.
  const [data] = await Promise.all([
    getDashboardData(),
    maybeRunPaymentReminders(),
  ]);

  return <DashboardPage data={data} />;
}
