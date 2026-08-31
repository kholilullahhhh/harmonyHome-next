'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, DoorOpen } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Room {
  id: string;
  slug: string;
  name: string;
  type: string;
  price: number;
  status: string;
  availableCount: number;
  totalCount: number;
  createdAt: Date;
}

interface RoomsListPageProps {
  rooms: Room[];
}

const statusConfig: Record<string, { label: string; className: string }> = {
  AVAILABLE: {
    label: 'Tersedia',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
  },
  OCCUPIED: {
    label: 'Terisi',
    className: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400',
  },
  MAINTENANCE: {
    label: 'Maintenance',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
  },
};

function formatPrice(price: number): string {
  return 'Rp' + price.toLocaleString('id-ID');
}

export function RoomsListPage({ rooms }: RoomsListPageProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/rooms/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');
      toast.success('Kamar berhasil dihapus.');
      router.refresh();
    } catch {
      toast.error('Gagal menghapus kamar.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight">
            Kamar
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola kamar Harmony Home.
          </p>
        </div>
        <Button asChild className="whitespace-nowrap">
          <Link href="/admin/rooms/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Kamar
          </Link>
        </Button>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-0">
          {rooms.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <DoorOpen className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">
                Belum ada kamar.
              </p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/admin/rooms/new">Tambah Kamar</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Nama</th>
                    <th className="px-6 py-3 font-medium">Tipe</th>
                    <th className="px-6 py-3 font-medium">Harga</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Ketersediaan</th>
                    <th className="px-6 py-3 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rooms.map((room) => {
                    const st = statusConfig[room.status] ?? statusConfig.AVAILABLE;
                    return (
                      <tr key={room.id} className="hover:bg-secondary/50">
                        <td className="px-6 py-4 font-medium">{room.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {room.type}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {formatPrice(room.price)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary" className={`text-xs ${st.className}`}>
                            {st.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {room.availableCount} / {room.totalCount}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/admin/rooms/${room.id}`}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Hapus Kamar</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus &quot;{room.name}&quot;?
                                    Tindakan ini tidak dapat dibatalkan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(room.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
