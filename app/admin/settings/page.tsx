import { getAllSettings } from '@/lib/db/queries';
import { SettingsForm } from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getAllSettings();

  return <SettingsForm settings={settings} />;
}
