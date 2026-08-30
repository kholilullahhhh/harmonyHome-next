import { getAllRules } from '@/lib/db/queries';
import { RulesListPage } from '@/components/admin/RulesListPage';

export const dynamic = 'force-dynamic';

export default async function AdminRulesPage() {
  const rules = await getAllRules();

  const serialized = rules.map((r) => ({
    ...r,
    items: Array.isArray(r.items) ? (r.items as string[]) : [],
  }));

  return <RulesListPage rules={serialized} />;
}
