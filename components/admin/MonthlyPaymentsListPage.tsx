'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  ReceiptText,
  Search,
  Wallet,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MONTH_NAMES_ID, formatTanggal } from '@/lib/payment-dates';
import { PaymentStatusBadge, paymentMethodLabel } from '@/components/payment-status';
import { RecordPaymentDialog, type RecordPaymentTarget } from '@/components/admin/RecordPaymentDialog';

export interface PaymentListRow {
  id: string;
  bookingId: string;
  periodYear: number;
  periodMonth: number;
  periodLabel: string;
  amount: number;
  dueDate: string;
  paidAt: string | null;
  status: string;
  displayStatus: 'PAID' | 'DUE_TODAY' | 'OVERDUE' | 'UPCOMING';
  paymentMethod: string | null;
  notes: string | null;
  reminder: string | null;
  booking: {
    id: string;
    bookingCode: string;
    name: string;
    phone: string;
    roomName: string;
  };
}

interface MonthlyPaymentsListPageProps {
  rows: PaymentListRow[];
  total: number;
  page: number;
  totalPages: number;
  rooms: { id: string; name: string }[];
  years: number[];
  filters: {
    year: string;
    month: string;
    status: string;
    roomId: string;
    search: string;
  };
}

function formatPrice(price: number): string {
  return 'Rp' + price.toLocaleString('id-ID');
}

export function MonthlyPaymentsListPage({
  rows,
  total,
  page,
  totalPages,
  rooms,
  years,
  filters,
}: MonthlyPaymentsListPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(filters.search);
  const [payTarget, setPayTarget] = React.useState<RecordPaymentTarget | null>(null);

  const pushFilters = (next: Partial<Record<string, string>>) => {
    const merged = { ...filters, ...next };
    const params = new URLSearchParams();
    Object.entries(merged).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/admin/pembayaran?${params.toString()}`);
  };

  const buildTarget = (row: PaymentListRow): RecordPaymentTarget => ({
    paymentId: row.id,
    bookingId: row.bookingId,
    bookingCode: row.booking.bookingCode,
    tenantName: row.booking.name,
    roomName: row.booking.roomName,
    periodLabel: row.periodLabel,
    periodYear: row.periodYear,
    periodMonth: row.periodMonth,
    dueDate: row.dueDate,
    amount: row.amount,
    paymentMethod: row.paymentMethod,
    notes: row.notes,
  });

  const paginationQuery = (targetPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(targetPage));
    return `/admin/pembayaran?${params.toString()}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
          Pembayaran Bulanan
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Riwayat tagihan dan pembayaran seluruh penyewa.
        </p>
      </div>

      <Card className="border-border/60">
        <CardHeader className="space-y-4">
          <CardTitle className="text-base">Daftar Tagihan ({total})</CardTitle>

          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                pushFilters({ search, page: '' });
              }}
              className="flex w-full items-center gap-2 lg:w-64"
            >
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama / kode..."
                className="h-9 flex-1"
              />
              <Button type="submit" size="sm" variant="secondary" aria-label="Cari">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:flex-1">
              <Select
                value={filters.year || 'all-years'}
                onValueChange={(value) =>
                  pushFilters({ year: value === 'all-years' ? '' : value, page: '' })
                }
              >
                <SelectTrigger className="h-9 w-full lg:w-32">
                  <SelectValue placeholder="Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-years">Semua Tahun</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.month || 'all-months'}
                onValueChange={(value) =>
                  pushFilters({ month: value === 'all-months' ? '' : value, page: '' })
                }
              >
                <SelectTrigger className="h-9 w-full lg:w-36">
                  <SelectValue placeholder="Bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-months">Semua Bulan</SelectItem>
                  {MONTH_NAMES_ID.map((name, index) => (
                    <SelectItem key={name} value={String(index + 1)}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.status || 'all-status'}
                onValueChange={(value) =>
                  pushFilters({ status: value === 'all-status' ? '' : value, page: '' })
                }
              >
                <SelectTrigger className="h-9 w-full lg:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">Semua Status</SelectItem>
                  <SelectItem value="UPCOMING">Belum Dibayar</SelectItem>
                  <SelectItem value="DUE_TODAY">Jatuh Tempo Hari Ini</SelectItem>
                  <SelectItem value="OVERDUE">Terlambat</SelectItem>
                  <SelectItem value="PAID">Sudah Dibayar</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.roomId || 'all-rooms'}
                onValueChange={(value) =>
                  pushFilters({ roomId: value === 'all-rooms' ? '' : value, page: '' })
                }
              >
                <SelectTrigger className="h-9 w-full lg:w-44">
                  <SelectValue placeholder="Kamar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-rooms">Semua Kamar</SelectItem>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {rows.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <ReceiptText className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">
                {total === 0 ? 'Belum ada tagihan pembayaran.' : 'Tidak ada data yang cocok.'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Penyewa</th>
                      <th className="pb-3 pr-4 font-medium">Periode</th>
                      <th className="hidden pb-3 pr-4 font-medium lg:table-cell">Kamar</th>
                      <th className="pb-3 pr-4 text-right font-medium">Nominal</th>
                      <th className="pb-3 pr-4 font-medium">Jatuh Tempo</th>
                      <th className="pb-3 pr-4 font-medium">Dibayar</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {rows.map((row) => (
                      <tr key={row.id} className="hover:bg-secondary/50">
                        <td className="py-3 pr-4">
                          <p className="font-medium">{row.booking.name}</p>
                          <p className="font-mono text-[11px] text-primary">
                            {row.booking.bookingCode}
                          </p>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">{row.periodLabel}</td>
                        <td className="hidden py-3 pr-4 text-muted-foreground lg:table-cell">
                          {row.booking.roomName}
                        </td>
                        <td className="py-3 pr-4 text-right font-medium">
                          {formatPrice(row.amount)}
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {formatTanggal(row.dueDate, 'short')}
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {row.paidAt ? (
                            <>
                              {formatTanggal(row.paidAt, 'short')}
                              <span className="block text-[11px]">
                                {paymentMethodLabel(row.paymentMethod)}
                              </span>
                            </>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          <PaymentStatusBadge status={row.displayStatus} />
                        </td>
                        <td className="py-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => setPayTarget(buildTarget(row))}
                          >
                            <Wallet className="mr-1 h-3 w-3" />
                            {row.displayStatus === 'PAID' ? 'Ubah' : 'Catat'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 md:hidden">
                {rows.map((row) => (
                  <div key={row.id} className="rounded-xl border border-border/60 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium">{row.booking.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {row.periodLabel} · {row.booking.roomName}
                        </p>
                      </div>
                      <PaymentStatusBadge status={row.displayStatus} />
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                      <div>
                        <dt className="text-muted-foreground">Nominal</dt>
                        <dd className="font-medium">{formatPrice(row.amount)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Jatuh Tempo</dt>
                        <dd className="font-medium">
                          {formatTanggal(row.dueDate, 'short')}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Dibayar</dt>
                        <dd className="font-medium">
                          {row.paidAt
                            ? `${formatTanggal(row.paidAt, 'short')} · ${paymentMethodLabel(row.paymentMethod)}`
                            : '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">No. HP</dt>
                        <dd className="font-medium">{row.booking.phone}</dd>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => setPayTarget(buildTarget(row))}
                    >
                      <Wallet className="mr-1.5 h-3.5 w-3.5" />
                      {row.displayStatus === 'PAID' ? 'Ubah Pembayaran' : 'Catat Pembayaran'}
                    </Button>
                  </div>
                ))}
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
                      <Link href={paginationQuery(page - 1)} aria-label="Halaman sebelumnya">
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
                      <Link href={paginationQuery(page + 1)} aria-label="Halaman berikutnya">
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

      <RecordPaymentDialog target={payTarget} onOpenChange={(open) => !open && setPayTarget(null)} />
    </div>
  );
}
