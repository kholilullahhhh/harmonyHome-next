'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Pencil,
  Trash2,
  DoorOpen,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Bed,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { cn } from '@/lib/utils';

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

const statusConfig: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  AVAILABLE: {
    label: 'Tersedia',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
    icon: CheckCircle2,
  },
  OCCUPIED: {
    label: 'Terisi',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
    icon: Bed,
  },
  MAINTENANCE: {
    label: 'Maintenance',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
    icon: Wrench,
  },
};

const ITEMS_PER_PAGE = 10;

function formatPrice(price: number): string {
  return 'Rp' + price.toLocaleString('id-ID');
}

export function RoomsListPage({ rooms }: RoomsListPageProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [typeFilter, setTypeFilter] = React.useState('ALL');
  const [sortField, setSortField] = React.useState<'name' | 'price' | 'status'>('name');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    let result = rooms.filter((room) => {
      const matchSearch =
        room.name.toLowerCase().includes(search.toLowerCase()) ||
        room.type.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || room.status === statusFilter;
      const matchType = typeFilter === 'ALL' || room.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'price') cmp = a.price - b.price;
      else if (sortField === 'status') cmp = a.status.localeCompare(b.status);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [rooms, search, statusFilter, typeFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleSort = (field: 'name' | 'price' | 'status') => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

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

  const uniqueTypes = Array.from(new Set(rooms.map((r) => r.type)));

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
            Kamar
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Kelola kamar Harmony Home. Total {rooms.length} kamar.
          </p>
        </div>
        <Button asChild className="h-9 whitespace-nowrap text-xs sm:h-10 sm:text-sm">
          <Link href="/admin/rooms/new">
            <Plus className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
            Tambah Kamar
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground sm:h-4 sm:w-4" />
          <Input
            placeholder="Cari nama atau tipe..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-8 pl-8 text-xs sm:h-9 sm:pl-9 sm:text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="h-8 w-[120px] text-xs sm:h-9 sm:w-[140px] sm:text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Status</SelectItem>
            <SelectItem value="AVAILABLE">Tersedia</SelectItem>
            <SelectItem value="OCCUPIED">Terisi</SelectItem>
            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
          <SelectTrigger className="h-8 w-[120px] text-xs sm:h-9 sm:w-[140px] sm:text-sm">
            <SelectValue placeholder="Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Tipe</SelectItem>
            {uniqueTypes.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-border/60">
        <CardContent className="p-0">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <DoorOpen className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">
                {rooms.length === 0 ? 'Belum ada kamar.' : 'Tidak ada kamar yang cocok.'}
              </p>
              {rooms.length === 0 && (
                <Button asChild className="mt-4" size="sm">
                  <Link href="/admin/rooms/new">Tambah Kamar</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-3 py-2.5 font-medium sm:px-6 sm:py-3">
                      <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-foreground">
                        Nama <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="hidden px-3 py-2.5 font-medium sm:table-cell sm:px-6 sm:py-3">Tipe</th>
                    <th className="px-3 py-2.5 font-medium sm:px-6 sm:py-3">
                      <button onClick={() => toggleSort('price')} className="flex items-center gap-1 hover:text-foreground">
                        Harga <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="px-3 py-2.5 font-medium sm:px-6 sm:py-3">
                      <button onClick={() => toggleSort('status')} className="flex items-center gap-1 hover:text-foreground">
                        Status <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="hidden px-3 py-2.5 font-medium sm:table-cell sm:px-6 sm:py-3">Ketersediaan</th>
                    <th className="px-3 py-2.5 font-medium sm:px-6 sm:py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginated.map((room) => {
                    const st = statusConfig[room.status] ?? statusConfig.AVAILABLE;
                    const StatusIcon = st.icon;
                    return (
                      <tr key={room.id} className="hover:bg-secondary/50">
                        <td className="px-3 py-2.5 sm:px-6 sm:py-3">
                          <p className="font-medium">{room.name}</p>
                          <p className="text-[11px] text-muted-foreground sm:hidden">{room.type}</p>
                        </td>
                        <td className="hidden px-3 py-2.5 text-muted-foreground sm:table-cell sm:px-6 sm:py-3">
                          {room.type}
                        </td>
                        <td className="px-3 py-2.5 text-xs font-medium sm:px-6 sm:py-3 sm:text-sm">{formatPrice(room.price)}</td>
                        <td className="px-3 py-2.5 sm:px-6 sm:py-3">
                          <Badge variant="secondary" className={cn('text-[9px] sm:text-xs', st.className)}>
                            <StatusIcon className="mr-0.5 h-2 w-2 sm:mr-1 sm:h-3 sm:w-3" />
                            {st.label}
                          </Badge>
                        </td>
                        <td className="hidden px-3 py-2.5 text-muted-foreground sm:table-cell sm:px-6 sm:py-3">
                          {room.availableCount} / {room.totalCount}
                        </td>
                        <td className="px-3 py-2.5 sm:px-6 sm:py-3">
                          <div className="flex gap-0.5 sm:gap-1">
                            <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Link href={`/admin/rooms/${room.id}`}>
                                <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground sm:text-xs">
            {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} dari {filtered.length}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
