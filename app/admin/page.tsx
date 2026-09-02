import { getDashboardData } from '@/lib/db/dashboard';
import { DashboardPage } from '@/components/admin/DashboardPage';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return <DashboardPage data={data} />;
}
