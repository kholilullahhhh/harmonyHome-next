import { getTenantList } from '@/lib/db/monthly-payments';
import { getAllRooms } from '@/lib/db/queries';
import { PenyewaListPage } from '@/components/admin/PenyewaListPage';

export const dynamic = 'force-dynamic';

interface PenyewaPageProps {
  searchParams: {
    status?: string;
    search?: string;
    roomId?: string;
    page?: string;
  };
}

export default async function PenyewaPage({ searchParams }: PenyewaPageProps) {
  const [result, rooms] = await Promise.all([
    getTenantList({
      status: searchParams.status ?? 'aktif',
      search: searchParams.search,
      roomId: searchParams.roomId,
      page: searchParams.page ? parseInt(searchParams.page, 10) : 1,
    }),
    getAllRooms(),
  ]);

  return (
    <PenyewaListPage
      tenants={result.tenants}
      total={result.total}
      page={result.page}
      totalPages={result.totalPages}
      rooms={rooms.map((room) => ({ id: room.id, name: room.name }))}
      filters={{
        status: searchParams.status ?? 'aktif',
        search: searchParams.search ?? '',
        roomId: searchParams.roomId ?? '',
      }}
    />
  );
}
