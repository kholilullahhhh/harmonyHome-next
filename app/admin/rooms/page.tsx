import { getAllRooms } from '@/lib/db/queries';
import { RoomsListPage } from '@/components/admin/RoomsListPage';

export const dynamic = 'force-dynamic';

export default async function AdminRoomsPage() {
  const rooms = await getAllRooms();

  return <RoomsListPage rooms={rooms} />;
}
