import { getAllMessages } from '@/lib/db/queries';
import { MessagesListPage } from '@/components/admin/MessagesListPage';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const result = await getAllMessages({ limit: 50 });

  return (
    <MessagesListPage
      messages={result.messages}
      total={result.total}
      page={result.page}
      totalPages={result.totalPages}
    />
  );
}
