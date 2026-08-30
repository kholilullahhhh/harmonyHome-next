import { getAllFaq } from '@/lib/db/queries';
import { FaqListPage } from '@/components/admin/FaqListPage';

export const dynamic = 'force-dynamic';

export default async function AdminFaqPage() {
  const faq = await getAllFaq();

  return <FaqListPage faq={faq} />;
}
