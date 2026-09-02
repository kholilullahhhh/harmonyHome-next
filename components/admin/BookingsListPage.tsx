'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

interface Booking {
  id: string;
  bookingCode: string;
  name: string;
  email: string;
  phone: string;
  roomName: string;
  startDate: string;
  duration: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface BookingsListPageProps {
  bookings: Booking[];
  total: number;
  page: number;
  totalPages: number;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: 'Menunggu',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
  },
  CONFIRMED: {
    label: 'Dikonfirmasi',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
  },
  CANCELLED: {
    label: 'Dibatalkan',
    className: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
  },
  COMPLETED: {
    label: 'Selesai',
    className: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400',
  },
};

function formatPrice(price: number): string {
  return 'Rp' + price.toLocaleString('id-ID');
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function BookingsListPage({
  bookings,
  total,
  page,
  totalPages,
}: BookingsListPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get('search') ?? '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (searchParams.get('status')) params.set('status', searchParams.get('status')!);
    router.push(`/admin/bookings?${params.toString()}`);
  };

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams();
    if (status !== 'all') params.set('status', status);
    if (searchParams.get('search')) params.set('search', searchParams.get('search')!);
    router.push(`/admin/bookings?${params.toString()}`);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Gagal memperbarui status');
      const statusLabel = statusConfig[newStatus]?.label ?? newStatus;
      toast.success(`Booking berhasil diubah ke "${statusLabel}".`);
      router.refresh();
    } catch {
      toast.error('Gagal memperbarui status booking.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
          Booking
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Kelola seluruh booking Harmony Home.
        </p>
      </div>

      <Card className="border-border/60">
        <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">
            Daftar Booking ({total})
          </CardTitle>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <form onSubmit={handleSearch} className="flex w-full items-center gap-2 sm:w-auto">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama / kode..."
                className="h-9 flex-1 sm:w-48"
              />
              <Button type="submit" size="sm" variant="secondary" aria-label="Cari">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <Select
              value={searchParams.get('status') ?? 'all'}
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="h-9 w-full sm:w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="PENDING">Menunggu</SelectItem>
                <SelectItem value="CONFIRMED">Dikonfirmasi</SelectItem>
                <SelectItem value="COMPLETED">Selesai</SelectItem>
                <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <CalendarCheck className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">
                {total === 0 ? 'Belum ada booking.' : 'Tidak ada booking yang cocok.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Kode</th>
                      <th className="pb-3 pr-4 font-medium">Nama</th>
                      <th className="hidden pb-3 pr-4 font-medium md:table-cell">Kamar</th>
                      <th className="hidden pb-3 pr-4 font-medium sm:table-cell">Mulai</th>
                      <th className="hidden pb-3 pr-4 font-medium sm:table-cell">Durasi</th>
                      <th className="pb-3 pr-4 font-medium">Total</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {bookings.map((booking) => {
                      const st = statusConfig[booking.status] ?? statusConfig.PENDING;
                      return (
                        <tr key={booking.id} className="hover:bg-secondary/50">
                          <td className="py-3 pr-4 font-mono text-xs font-semibold text-primary">
                            {booking.bookingCode}
                          </td>
                          <td className="py-3 pr-4">
                            <p className="font-medium">{booking.name}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{booking.roomName}</p>
                          </td>
                          <td className="hidden py-3 pr-4 text-muted-foreground md:table-cell">
                            {booking.roomName}
                          </td>
                          <td className="hidden py-3 pr-4 text-muted-foreground sm:table-cell">
                            {formatDate(booking.startDate)}
                          </td>
                          <td className="hidden py-3 pr-4 text-muted-foreground sm:table-cell">
                            {booking.duration} bln
                          </td>
                          <td className="py-3 pr-4 font-medium">
                            {formatPrice(booking.totalPrice)}
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant="secondary" className={cn('text-xs', st.className)}>
                              {st.label}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/bookings/${booking.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Lihat Detail
                                  </Link>
                                </DropdownMenuItem>
                                {booking.status === 'PENDING' && (
                                  <DropdownMenuItem
                                    onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                                    className="text-emerald-600"
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Konfirmasi
                                  </DropdownMenuItem>
                                )}
                                {booking.status === 'PENDING' && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                        className="text-rose-600"
                                      >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Tolak
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Tolak Booking</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Apakah Anda yakin ingin menolak booking {booking.bookingCode}?
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Tolak
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                                {booking.status === 'CONFIRMED' && (
                                  <DropdownMenuItem
                                    onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                                    className="text-sky-600"
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Selesai
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[11px] text-muted-foreground sm:text-xs">
                    Halaman {page} dari {totalPages}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      disabled={page <= 1}
                    >
                      <Link
                        href={`/admin/bookings?page=${page - 1}${
                          searchParams.get('status') ? `&status=${searchParams.get('status')}` : ''
                        }${searchParams.get('search') ? `&search=${searchParams.get('search')}` : ''}`}
                      >
                        <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      disabled={page >= totalPages}
                    >
                      <Link
                        href={`/admin/bookings?page=${page + 1}${
                          searchParams.get('status') ? `&status=${searchParams.get('status')}` : ''
                        }${searchParams.get('search') ? `&search=${searchParams.get('search')}` : ''}`}
                      >
                        <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
