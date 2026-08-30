import { getRoomById } from '@/lib/db/queries';
import { notFound } from 'next/navigation';
import { RoomForm } from '@/components/admin/RoomForm';

export const dynamic = 'force-dynamic';

export default async function EditRoomPage({
  params,
}: {
  params: { id: string };
}) {
  const room = await getRoomById(params.id);
  if (!room) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">
          Edit Kamar
        </h1>
        <p className="text-sm text-muted-foreground">
          Perbarui data kamar &quot;{room.name}&quot;.
        </p>
      </div>
      <RoomForm room={room} />
    </div>
  );
}
