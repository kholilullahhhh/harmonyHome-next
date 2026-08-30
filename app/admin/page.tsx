import { getDashboardStats, getRecentBookings } from '@/lib/db/dashboard';
import { DashboardPage } from '@/components/admin/DashboardPage';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [stats, recentBookings] = await Promise.all([
    getDashboardStats(),
    getRecentBookings(5),
  ]);

  return <DashboardPage stats={stats} recentBookings={recentBookings} />;
}
