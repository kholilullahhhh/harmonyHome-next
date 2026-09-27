'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarClock,
  Eye,
  History,
  KeyRound,
  UserRound,
  Wallet,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  addMonthsToDateOnly,
  businessDateString,
  daysBetween,
  formatPeriodLabel,
  formatTanggal,
  toDateString,
} from '@/lib/payment-dates';
import {
  PaymentStatusBadge,
  paymentMethodLabel,
  paymentStatusMessages,
} from '@/components/payment-status';
import type { PenyewaPaymentRow } from '@/components/admin/PenyewaListPage';
import { RecordPaymentDialog, type RecordPaymentTarget } from '@/components/admin/RecordPaymentDialog';
import { DueDayDialog, type DueDayTarget } from '@/components/admin/DueDayDialog';
import {
  TenantAccountDialog,
  type TenantAccountTarget,
} from '@/components/admin/TenantAccountDialog';

interface PenyewaDetailData {
  booking: {
    id: string;
    bookingCode: string;
    name: string;
    email: string;
    phone: string;
    identityNumber: string | null;
    address: string | null;
    startDate: string;
    duration: number;
    durationUnit: string;
    totalPrice: number;
    status: string;
    notes: string | null;
    paymentDueDay: number | null;
    userId: string | null;
    room: { id: string; name: string; price: number; slug: string };
    user: { id: string; email: string } | null;
  };
  dueDay: number;
  monthlyAmount: number;
  isActive: boolean;
  current: PenyewaPaymentRow | null;
  history: PenyewaPaymentRow[];
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

function formatPrice(price: number): string {
  return 'Rp' + price.toLocaleString('id-ID');
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="break-all text-right font-medium">{value}</span>
    </div>
  );
}

function statusNote(payment: PenyewaPaymentRow): { message: string; hint?: string } {
  const today = businessDateString();
  switch (payment.displayStatus) {
    case 'PAID':
      return {
        message: paymentStatusMessages.PAID,
        hint: payment.paidAt ? `Dibayar pada ${formatTanggal(payment.paidAt)}` : undefined,
      };
    case 'DUE_TODAY':
      return { message: paymentStatusMessages.DUE_TODAY };
    case 'OVERDUE':
      return {
        message: paymentStatusMessages.OVERDUE,
        hint: `Terlambat ${Math.max(0, daysBetween(payment.dueDate, today))} hari`,
      };
    default:
      return {
        message: paymentStatusMessages.UPCOMING,
        hint: `Jatuh tempo dalam ${Math.max(0, daysBetween(today, payment.dueDate))} hari`,
      };
  }
}

export function PenyewaDetailPage({ data }: { data: PenyewaDetailData }) {
  const { booking, dueDay, monthlyAmount, isActive, current, history } = data;

  const [payTarget, setPayTarget] = React.useState<RecordPaymentTarget | null>(null);
  const [dueTarget, setDueTarget] = React.useState<DueDayTarget | null>(null);
  const [accountTarget, setAccountTarget] = React.useState<TenantAccountTarget | null>(null);

  const startDate = toDateString(new Date(booking.startDate));
  const endDate = addMonthsToDateOnly(startDate, booking.duration);
  const bookingStatus = bookingStatusConfig[booking.status] ?? bookingStatusConfig.PENDING;
  const today = businessDateString();

  const buildTarget = (payment: PenyewaPaymentRow): RecordPaymentTarget => ({
    paymentId: payment.id,
    bookingId: booking.id,
    bookingCode: booking.bookingCode,
    tenantName: booking.name,
    roomName: booking.room.name,
    periodLabel: payment.periodLabel,
    periodYear: payment.periodYear,
    periodMonth: payment.periodMonth,
    dueDate: payment.dueDate,
    amount: payment.amount,
    paymentMethod: payment.paymentMethod,
    notes: payment.notes,
  });

  const note = current ? statusNote(current) : null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <Button asChild variant="ghost" size="sm" className="h-8 px-2 sm:h-9">
          <Link href="/admin/penyewa">
            <ArrowLeft className="mr-0.5 h-3.5 w-3.5 sm:mr-1 sm:h-4 sm:w-4" />
            Kembali
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="truncate font-serif text-xl font-semibold tracking-tight sm:text-2xl">
            {booking.name}
          </h1>
          <p className="font-mono text-xs text-primary sm:text-sm">{booking.bookingCode}</p>
        </div>
        <Badge variant="secondary" className={cn('ml-auto shrink-0 text-xs', bookingStatus.className)}>
          {bookingStatus.label}
        </Badge>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="space-y-4 sm:space-y-6 lg:col-span-2">
          {/* Tenant info */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Informasi Penyewa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow label="Nama" value={booking.name} />
              <InfoRow label="Email" value={booking.email} />
              <InfoRow label="No. HP" value={booking.phone} />
              {booking.identityNumber && (
                <InfoRow label="No. Identitas" value={booking.identityNumber} />
              )}
              <Separator />
              <InfoRow label="Kamar" value={booking.room.name} />
              <InfoRow label="Tanggal Mulai Sewa" value={formatTanggal(startDate)} />
              <InfoRow label="Durasi Sewa" value={`${booking.duration} bulan`} />
              <InfoRow label="Berakhir" value={formatTanggal(endDate)} />
              <InfoRow label="Nominal Sewa / Bulan" value={formatPrice(monthlyAmount)} />
              <InfoRow label="Tanggal Jatuh Tempo" value={`Tanggal ${dueDay} setiap bulan`} />
              <Separator />
              <InfoRow
                label="Akun Penyewa"
                value={booking.user ? booking.user.email : 'Belum ada akun'}
              />
            </CardContent>
          </Card>

          {/* Current bill */}
          <Card
            className={cn(
              'border-border/60',
              current?.displayStatus === 'OVERDUE' &&
                'border-rose-200 bg-rose-50/30 dark:border-rose-900 dark:bg-rose-950/10',
              current?.displayStatus === 'DUE_TODAY' &&
                'border-amber-200 bg-amber-50/30 dark:border-amber-900 dark:bg-amber-950/10',
              current?.displayStatus === 'PAID' &&
                'border-emerald-200 bg-emerald-50/30 dark:border-emerald-900 dark:bg-emerald-950/10'
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">Tagihan Bulan Berjalan</CardTitle>
              {current && <PaymentStatusBadge status={current.displayStatus} />}
            </CardHeader>
            <CardContent>
              {current ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Periode</p>
                      <p className="font-serif text-lg font-semibold sm:text-xl">
                        {current.periodLabel}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Nominal</p>
                      <p className="font-serif text-xl font-bold text-primary sm:text-2xl">
                        {formatPrice(current.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-border/60 p-2.5 sm:p-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Jatuh Tempo
                      </p>
                      <p className="mt-0.5 text-sm font-medium">
                        {formatTanggal(current.dueDate)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/60 p-2.5 sm:p-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Dibayar
                      </p>
                      <p className="mt-0.5 text-sm font-medium">
                        {current.paidAt ? formatTanggal(current.paidAt) : '—'}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/60 p-2.5 sm:p-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Metode
                      </p>
                      <p className="mt-0.5 text-sm font-medium">
                        {paymentMethodLabel(current.paymentMethod)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                    <p className="text-sm font-medium">{note?.message}</p>
                    {note?.hint && (
                      <p className="mt-1 text-xs text-muted-foreground">{note.hint}</p>
                    )}
                    {current.reminder && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Pengingat: {current.reminder}
                        {current.reminder === 'Hari H' ? '' : ' menuju jatuh tempo'}
                      </p>
                    )}
                    {current.notes && (
                      <p className="mt-2 break-words text-xs text-muted-foreground">
                        Catatan: {current.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    {current.displayStatus !== 'PAID' ? (
                      <Button className="sm:w-auto" onClick={() => setPayTarget(buildTarget(current))}>
                        <Wallet className="mr-2 h-4 w-4" />
                        Catat Pembayaran
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="sm:w-auto"
                        onClick={() => setPayTarget(buildTarget(current))}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ubah Detail Pembayaran
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-2 py-4">
                  <p className="text-sm font-medium">
                    {isActive
                      ? 'Belum ada tagihan untuk periode berjalan.'
                      : 'Booking ini tidak aktif sehingga tidak ada tagihan bulanan baru.'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isActive
                      ? 'Tagihan akan dibuat otomatis mengikuti tanggal jatuh tempo penyewa.'
                      : 'Riwayat pembayaran yang sudah ada tetap tersimpan di bawah.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* History */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="h-4 w-4 text-muted-foreground" />
                Riwayat Pembayaran ({history.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="flex flex-col items-center py-10">
                  <History className="h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Belum ada tagihan untuk penyewa ini.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop */}
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                          <th className="pb-3 pr-4 font-medium">Periode</th>
                          <th className="pb-3 pr-4 text-right font-medium">Nominal</th>
                          <th className="pb-3 pr-4 font-medium">Jatuh Tempo</th>
                          <th className="pb-3 pr-4 font-medium">Dibayar</th>
                          <th className="pb-3 pr-4 font-medium">Status</th>
                          <th className="pb-3 font-medium">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {history.map((payment) => (
                          <tr key={payment.id} className="hover:bg-secondary/50">
                            <td className="py-3 pr-4 font-medium">
                              {formatPeriodLabel(payment.periodYear, payment.periodMonth)}
                            </td>
                            <td className="py-3 pr-4 text-right font-medium">
                              {formatPrice(payment.amount)}
                            </td>
                            <td className="py-3 pr-4 text-muted-foreground">
                              {formatTanggal(payment.dueDate, 'short')}
                            </td>
                            <td className="py-3 pr-4 text-muted-foreground">
                              {payment.paidAt ? (
                                <>
                                  {formatTanggal(payment.paidAt, 'short')}
                                  <span className="block text-[11px]">
                                    {paymentMethodLabel(payment.paymentMethod)}
                                  </span>
                                </>
                              ) : (
                                '—'
                              )}
                            </td>
                            <td className="py-3 pr-4">
                              <PaymentStatusBadge status={payment.displayStatus} />
                            </td>
                            <td className="py-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setPayTarget(buildTarget(payment))}
                              >
                                {payment.displayStatus === 'PAID' ? 'Ubah' : 'Catat'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile */}
                  <div className="space-y-3 md:hidden">
                    {history.map((payment) => (
                      <div key={payment.id} className="rounded-xl border border-border/60 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">
                              {formatPeriodLabel(payment.periodYear, payment.periodMonth)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Jatuh tempo {formatTanggal(payment.dueDate, 'short')}
                            </p>
                          </div>
                          <PaymentStatusBadge status={payment.displayStatus} />
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div>
                            <p className="font-serif text-base font-bold text-primary">
                              {formatPrice(payment.amount)}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {payment.paidAt
                                ? `Dibayar ${formatTanggal(payment.paidAt, 'short')} · ${paymentMethodLabel(payment.paymentMethod)}`
                                : 'Belum dibayar'}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => setPayTarget(buildTarget(payment))}
                          >
                            {payment.displayStatus === 'PAID' ? 'Ubah' : 'Catat'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side panel */}
        <div className="space-y-4 sm:space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Aksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={() =>
                  setDueTarget({
                    bookingId: booking.id,
                    bookingCode: booking.bookingCode,
                    tenantName: booking.name,
                    dueDay,
                  })
                }
                disabled={!isActive}
              >
                <CalendarClock className="mr-2 h-4 w-4" />
                Ubah Tanggal Jatuh Tempo
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() =>
                  setAccountTarget({
                    bookingId: booking.id,
                    bookingCode: booking.bookingCode,
                    tenantName: booking.name,
                    email: booking.user?.email ?? booking.email,
                    hasAccount: Boolean(booking.user),
                  })
                }
              >
                <KeyRound className="mr-2 h-4 w-4" />
                {booking.user ? 'Atur Ulang Kata Sandi' : 'Buat Akun Penyewa'}
              </Button>
              {!isActive && (
                <p className="pt-1 text-[11px] text-muted-foreground">
                  Booking tidak aktif — tagihan baru tidak akan dibuat.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Ringkasan Sewa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow label="Kamar" value={booking.room.name} />
              <InfoRow label="Harga Kamar" value={formatPrice(booking.room.price)} />
              <InfoRow label="Total Kontrak" value={formatPrice(booking.totalPrice)} />
              <InfoRow label="Jatuh Tempo" value={`Tanggal ${dueDay}`} />
              <InfoRow
                label="Sisa Masa Sewa"
                value={
                  daysBetween(today, endDate) > 0
                    ? `${daysBetween(today, endDate)} hari`
                    : 'Berakhir'
                }
              />
              {booking.notes && (
                <>
                  <Separator />
                  <div>
                    <span className="text-muted-foreground">Catatan Booking</span>
                    <p className="mt-1 whitespace-pre-wrap">{booking.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="flex items-start gap-3 p-4">
              <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="text-xs text-muted-foreground">
                {booking.user ? (
                  <>
                    Akun penyewa aktif. Penyewa masuk di halaman{' '}
                    <span className="font-medium text-foreground">/pembayaran</span> menggunakan
                    email <span className="font-medium text-foreground">{booking.user.email}</span>.
                  </>
                ) : (
                  <>
                    Belum ada akun untuk penyewa ini. Buat akun agar penyewa dapat melihat tagihan
                    di halaman <span className="font-medium text-foreground">/pembayaran</span>.
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <RecordPaymentDialog target={payTarget} onOpenChange={(open) => !open && setPayTarget(null)} />
      <DueDayDialog target={dueTarget} onOpenChange={(open) => !open && setDueTarget(null)} />
      <TenantAccountDialog
        target={accountTarget}
        onOpenChange={(open) => !open && setAccountTarget(null)}
      />
    </div>
  );
}
