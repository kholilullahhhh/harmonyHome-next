'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Eye,
  KeyRound,
  MoreHorizontal,
  Search,
  UserRound,
  Wallet,
} from 'lucide-react';

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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatTanggal } from '@/lib/payment-dates';
import { PaymentStatusBadge } from '@/components/payment-status';
import { RecordPaymentDialog, type RecordPaymentTarget } from '@/components/admin/RecordPaymentDialog';
import { DueDayDialog, type DueDayTarget } from '@/components/admin/DueDayDialog';
import {
  TenantAccountDialog,
  type TenantAccountTarget,
} from '@/components/admin/TenantAccountDialog';

export interface PenyewaPaymentRow {
  id: string;
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
}

export interface PenyewaRow {
  id: string;
  bookingCode: string;
  name: string;
  email: string;
  phone: string;
  roomName: string;
  startDate: string;
  bookingStatus: string;
  dueDay: number;
  monthlyAmount: number;
  isActive: boolean;
  tenantUserId: string | null;
  current: PenyewaPaymentRow | null;
}

interface PenyewaListPageProps {
  tenants: PenyewaRow[];
  total: number;
  page: number;
  totalPages: number;
  rooms: { id: string; name: string }[];
  filters: {
    status: string;
    search: string;
    roomId: string;
  };
}

function formatPrice(price: number): string {
  return 'Rp' + price.toLocaleString('id-ID');
}

const bookingStatusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: 'Menunggu',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
  },
  CONFIRMED: {
    label: 'Aktif',
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

function buildPaymentTarget(row: PenyewaRow): RecordPaymentTarget | null {
  if (!row.current) return null;
  return {
    paymentId: row.current.id,
    bookingId: row.id,
    bookingCode: row.bookingCode,
    tenantName: row.name,
    roomName: row.roomName,
    periodLabel: row.current.periodLabel,
    periodYear: row.current.periodYear,
    periodMonth: row.current.periodMonth,
    dueDate: row.current.dueDate,
    amount: row.current.amount,
    paymentMethod: row.current.paymentMethod,
    notes: row.current.notes,
  };
}

export function PenyewaListPage({
  tenants,
  total,
  page,
  totalPages,
  rooms,
  filters,
}: PenyewaListPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(filters.search);

  const [payTarget, setPayTarget] = React.useState<RecordPaymentTarget | null>(null);
  const [dueTarget, setDueTarget] = React.useState<DueDayTarget | null>(null);
  const [accountTarget, setAccountTarget] = React.useState<TenantAccountTarget | null>(null);

  const pushParams = (next: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/admin/penyewa?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    pushParams({
      search,
      status: filters.status !== 'aktif' ? filters.status : '',
      roomId: filters.roomId,
    });
  };

  const paginationQuery = (targetPage: number) => {
    const params = new URLSearchParams();
    params.set('page', String(targetPage));
    if (filters.search) params.set('search', filters.search);
    if (filters.status !== 'aktif') params.set('status', filters.status);
    if (filters.roomId) params.set('roomId', filters.roomId);
    return `/admin/penyewa?${params.toString()}`;
  };

  const openDueDay = (row: PenyewaRow) =>
    setDueTarget({
      bookingId: row.id,
      bookingCode: row.bookingCode,
      tenantName: row.name,
      dueDay: row.dueDay,
    });

  const openAccount = (row: PenyewaRow) =>
    setAccountTarget({
      bookingId: row.id,
      bookingCode: row.bookingCode,
      tenantName: row.name,
      email: row.email,
      hasAccount: Boolean(row.tenantUserId),
    });

  const canRecordPayment = (row: PenyewaRow): boolean =>
    Boolean(row.isActive && row.current && row.current.displayStatus !== 'PAID');

  const statusBadge = (row: PenyewaRow) => {
    if (row.current) return <PaymentStatusBadge status={row.current.displayStatus} />;
    const bookingStatus = bookingStatusConfig[row.bookingStatus];
    if (!bookingStatus) return <span className="text-xs text-muted-foreground">—</span>;
    return (
      <Badge variant="secondary" className={cn('text-xs', bookingStatus.className)}>
        {bookingStatus.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">Penyewa</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Kelola jatuh tempo dan pembayaran bulanan seluruh penyewa Harmony Home.
        </p>
      </div>

      <Card className="border-border/60">
        <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Daftar Penyewa ({total})</CardTitle>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <form onSubmit={handleSearch} className="flex w-full items-center gap-2 sm:w-auto">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama / kode / HP..."
                className="h-9 flex-1 sm:w-52"
              />
              <Button type="submit" size="sm" variant="secondary" aria-label="Cari">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <Select
              value={filters.roomId || 'all-rooms'}
              onValueChange={(value) =>
                pushParams({
                  search: filters.search,
                  status: filters.status !== 'aktif' ? filters.status : '',
                  roomId: value === 'all-rooms' ? '' : value,
                })
              }
            >
              <SelectTrigger className="h-9 w-full sm:w-40">
                <SelectValue />
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

            <Select
              value={filters.status}
              onValueChange={(value) =>
                pushParams({
                  search: filters.search,
                  status: value,
                  roomId: filters.roomId,
                })
              }
            >
              <SelectTrigger className="h-9 w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aktif">Penyewa Aktif</SelectItem>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="CONFIRMED">Dikonfirmasi</SelectItem>
                <SelectItem value="COMPLETED">Selesai</SelectItem>
                <SelectItem value="PENDING">Menunggu</SelectItem>
                <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {tenants.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <UserRound className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">
                {total === 0 ? 'Belum ada penyewa.' : 'Tidak ada penyewa yang cocok.'}
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
                      <th className="pb-3 pr-4 font-medium">Kamar</th>
                      <th className="hidden pb-3 pr-4 font-medium lg:table-cell">No. HP</th>
                      <th className="hidden pb-3 pr-4 font-medium lg:table-cell">Mulai</th>
                      <th className="pb-3 pr-4 font-medium">Jatuh Tempo</th>
                      <th className="pb-3 pr-4 font-medium">Nominal</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {tenants.map((row) => (
                      <tr key={row.id} className="hover:bg-secondary/50">
                        <td className="py-3 pr-4">
                          <p className="font-medium">{row.name}</p>
                          <p className="font-mono text-[11px] text-primary">{row.bookingCode}</p>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">{row.roomName}</td>
                        <td className="hidden py-3 pr-4 text-muted-foreground lg:table-cell">
                          {row.phone}
                        </td>
                        <td className="hidden py-3 pr-4 text-muted-foreground lg:table-cell">
                          {formatTanggal(row.startDate, 'short')}
                        </td>
                        <td className="py-3 pr-4">
                          <p className="font-medium">Tanggal {row.dueDay}</p>
                          {row.current?.reminder && (
                            <p className="text-[11px] text-muted-foreground">
                              {row.current.reminder === 'Hari H'
                                ? 'Jatuh tempo hari ini'
                                : `${row.current.reminder} · ${formatTanggal(row.current.dueDate, 'short')}`}
                            </p>
                          )}
                        </td>
                        <td className="py-3 pr-4 font-medium">{formatPrice(row.monthlyAmount)}</td>
                        <td className="py-3 pr-4">{statusBadge(row)}</td>
                        <td className="py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Aksi {row.name}</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/penyewa/${row.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Detail &amp; Riwayat
                                </Link>
                              </DropdownMenuItem>
                              {canRecordPayment(row) && (
                                <DropdownMenuItem
                                  onClick={() => setPayTarget(buildPaymentTarget(row))}
                                >
                                  <Wallet className="mr-2 h-4 w-4" />
                                  Catat Pembayaran
                                </DropdownMenuItem>
                              )}
                              {row.isActive && (
                                <DropdownMenuItem onClick={() => openDueDay(row)}>
                                  <CalendarClock className="mr-2 h-4 w-4" />
                                  Ubah Tanggal Jatuh Tempo
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openAccount(row)}>
                                <KeyRound className="mr-2 h-4 w-4" />
                                {row.tenantUserId ? 'Atur Ulang Kata Sandi' : 'Buat Akun Penyewa'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 md:hidden">
                {tenants.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-xl border border-border/60 p-3 sm:p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium">{row.name}</p>
                        <p className="font-mono text-[11px] text-primary">{row.bookingCode}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{row.roomName}</p>
                      </div>
                      {statusBadge(row)}
                    </div>

                    <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                      <div>
                        <dt className="text-muted-foreground">Jatuh Tempo</dt>
                        <dd className="font-medium">Tanggal {row.dueDay}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Nominal / bulan</dt>
                        <dd className="font-medium">{formatPrice(row.monthlyAmount)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Mulai Sewa</dt>
                        <dd className="font-medium">{formatTanggal(row.startDate, 'short')}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">No. HP</dt>
                        <dd className="font-medium">{row.phone}</dd>
                      </div>
                    </dl>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href={`/admin/penyewa/${row.id}`}>
                          <Eye className="mr-1.5 h-3.5 w-3.5" />
                          Detail
                        </Link>
                      </Button>
                      {canRecordPayment(row) ? (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => setPayTarget(buildPaymentTarget(row))}
                        >
                          <Wallet className="mr-1.5 h-3.5 w-3.5" />
                          Catat Bayar
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                          onClick={() => openDueDay(row)}
                          disabled={!row.isActive}
                        >
                          <CalendarClock className="mr-1.5 h-3.5 w-3.5" />
                          Ubah Tempo
                        </Button>
                      )}
                    </div>
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
      <DueDayDialog target={dueTarget} onOpenChange={(open) => !open && setDueTarget(null)} />
      <TenantAccountDialog
        target={accountTarget}
        onOpenChange={(open) => !open && setAccountTarget(null)}
      />
    </div>
  );
}
