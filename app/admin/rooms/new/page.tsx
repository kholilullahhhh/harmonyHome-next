import { RoomForm } from '@/components/admin/RoomForm';

export default function NewRoomPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">
          Tambah Kamar Baru
        </h1>
        <p className="text-sm text-muted-foreground">
          Isi data kamar baru untuk Harmony Home.
        </p>
      </div>
      <RoomForm />
    </div>
  );
}
