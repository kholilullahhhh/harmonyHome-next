'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">
          Booking
        </h1>
        <p className="text-sm text-muted-foreground">
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
            <p className="py-8 text-center text-sm text-muted-foreground">
              Tidak ada booking ditemukan.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Kode</th>
                      <th className="pb-3 pr-4 font-medium">Nama</th>
                      <th className="pb-3 pr-4 font-medium">Kamar</th>
                      <th className="pb-3 pr-4 font-medium">Mulai</th>
                      <th className="pb-3 pr-4 font-medium">Durasi</th>
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
                          <td className="py-3 pr-4 font-medium">{booking.name}</td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {booking.roomName}
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {formatDate(booking.startDate)}
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {booking.duration} bln
                          </td>
                          <td className="py-3 pr-4 font-medium">
                            {formatPrice(booking.totalPrice)}
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant="secondary" className={`text-xs ${st.className}`}>
                              {st.label}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/admin/bookings/${booking.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    Halaman {page} dari {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                    >
                      <Link
                        href={`/admin/bookings?page=${page - 1}${
                          searchParams.get('status')
                            ? `&status=${searchParams.get('status')}`
                            : ''
                        }${
                          searchParams.get('search')
                            ? `&search=${searchParams.get('search')}`
                            : ''
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                    >
                      <Link
                        href={`/admin/bookings?page=${page + 1}${
                          searchParams.get('status')
                            ? `&status=${searchParams.get('status')}`
                            : ''
                        }${
                          searchParams.get('search')
                            ? `&search=${searchParams.get('search')}`
                            : ''
                        }`}
                      >
                        <ChevronRight className="h-4 w-4" />
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
