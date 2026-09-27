'use client';

import * as React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  CalendarClock,
  Clock3,
  DoorOpen,
  History,
  LogOut,
  ReceiptText,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  addMonthsToDateOnly,
  businessDateString,
  daysBetween,
  formatTanggal,
  toDateString,
} from '@/lib/payment-dates';
import {
  PaymentStatusBadge,
  paymentMethodLabel,
  paymentStatusMessages,
} from '@/components/payment-status';

interface TenantPayment {
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
}

interface TenantView {
  booking: {
    id: string;
    bookingCode: string;
    roomName: string;
    startDate: string;
    duration: number;
    status: string;
    dueDay: number;
    monthlyAmount: number;
    isActive: boolean;
  };
  current: TenantPayment | null;
  history: TenantPayment[];
}

interface TenantPaymentDashboardProps {
  name: string;
  email: string;
  views: TenantView[];
}

function formatPrice(price: number): string {
  return 'Rp' + price.toLocaleString('id-ID');
}

function statusNote(payment: TenantPayment): { message: string; hint?: string } {
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

function bookingStatusText(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'Booking Anda masih menunggu konfirmasi dari pengelola.';
    case 'CANCELLED':
      return 'Booking Anda telah dibatalkan.';
    case 'COMPLETED':
      return 'Masa sewa Anda sudah berakhir. Terima kasih sudah tinggal di Harmony Home.';
    default:
      return 'Belum ada tagihan untuk periode berjalan.';
  }
}

export function TenantPaymentDashboard({ name, email, views }: TenantPaymentDashboardProps) {
  const activeView = views.find((view) => view.booking.isActive) ?? views[0];
  const [selectedId, setSelectedId] = React.useState<string | null>(activeView?.booking.id ?? null);

  const selected =
    views.find((view) => view.booking.id === selectedId) ?? activeView ?? views[0];

  if (!selected) {
    return (
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl container-px">
          <Card className="border-border/60">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <ReceiptText className="h-10 w-10 text-muted-foreground/50" />
              <h1 className="font-serif text-xl font-semibold">Belum ada data penyewa</h1>
              <p className="max-w-md text-sm text-muted-foreground">
                Akun Anda belum terhubung dengan booking kamar mana pun. Silakan hubungi pengelola
                Harmony Home untuk mengaktifkan akses pembayaran Anda.
              </p>
              <Button asChild variant="outline" className="mt-2">
                <Link href="/kontak">Hubungi Pengelola</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const { booking, current, history } = selected;
  const today = businessDateString();
  const startDate = toDateString(new Date(booking.startDate));
  const endDate = addMonthsToDateOnly(startDate, booking.duration);
  const note = current ? statusNote(current) : null;

  const tiles = [
    {
      key: 'bill',
      label: 'Pembayaran Bulanan',
      icon: ReceiptText,
      iconClassName: 'text-primary',
      iconBgClassName: 'bg-primary/10',
      content: (
        <>
          <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
            {current ? current.periodLabel : booking.roomName}
          </p>
          <p className="font-serif text-2xl font-bold tracking-tight">
            {current ? formatPrice(current.amount) : formatPrice(booking.monthlyAmount)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Jatuh tempo:{' '}
            {current ? formatTanggal(current.dueDate, 'short') : `Tanggal ${booking.dueDay}`}
          </p>
        </>
      ),
      footer: current ? <PaymentStatusBadge status={current.displayStatus} /> : null,
      action: (
        <Link href="#tagihan" className="text-xs font-medium text-primary hover:underline">
          Lihat Detail
        </Link>
      ),
    },
    {
      key: 'due',
      label: 'Tenggat',
      icon: CalendarClock,
      iconClassName: 'text-amber-600 dark:text-amber-400',
      iconBgClassName: 'bg-amber-50 dark:bg-amber-950/50',
      content: (
        <>
          <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
            Tanggal jatuh tempo
          </p>
          <p className="font-serif text-2xl font-bold tracking-tight">
            {current ? formatTanggal(current.dueDate, 'short') : `Tgl ${booking.dueDay}`}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {current
              ? current.displayStatus === 'PAID'
                ? 'Sudah dibayar'
                : current.reminder === 'Hari H'
                  ? 'Jatuh tempo hari ini'
                  : current.reminder
                    ? `${current.reminder} menuju jatuh tempo`
                    : 'Pengingat aktif H-7, H-3, H-1'
              : 'Setiap tanggal ' + booking.dueDay}
          </p>
        </>
      ),
      footer: null,
      action: null,
    },
    {
      key: 'tenure',
      label: 'Masa Sewa',
      icon: DoorOpen,
      iconClassName: 'text-emerald-600 dark:text-emerald-400',
      iconBgClassName: 'bg-emerald-50 dark:bg-emerald-950/50',
      content: (
        <>
          <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
            {booking.roomName}
          </p>
          <p className="font-serif text-2xl font-bold tracking-tight">{booking.duration} bln</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatTanggal(startDate, 'short')} – {formatTanggal(endDate, 'short')}
          </p>
        </>
      ),
      footer: null,
      action: null,
    },
  ];

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-5xl container-px space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Portal Penyewa
            </p>
            <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              Halo, {name}
            </h1>
            <p className="mt-0.5 break-all text-sm text-muted-foreground">{email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/pembayaran/login' })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </Button>
        </div>

        {views.length > 1 && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <span className="text-sm text-muted-foreground">Pilih booking:</span>
            <Select value={selected.booking.id} onValueChange={setSelectedId}>
              <SelectTrigger className="w-full sm:w-72">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {views.map((view) => (
                  <SelectItem key={view.booking.id} value={view.booking.id}>
                    {view.booking.roomName} · {view.booking.bookingCode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Summary tiles */}
        <div className="grid gap-3 sm:grid-cols-3">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <Card key={tile.key} className="border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {tile.label}
                    </p>
                    <span className={cn('rounded-lg p-1.5', tile.iconBgClassName)}>
                      <Icon className={cn('h-3.5 w-3.5', tile.iconClassName)} />
                    </span>
                  </div>
                  {tile.content}
                  {(tile.footer || tile.action) && (
                    <div className="mt-3 flex items-center justify-between gap-2">
                      {tile.footer}
                      {tile.action}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Current bill */}
        <Card
          id="tagihan"
          className={cn(
            'scroll-mt-24 border-border/60',
            current?.displayStatus === 'OVERDUE' &&
              'border-rose-200 bg-rose-50/30 dark:border-rose-900 dark:bg-rose-950/10',
            current?.displayStatus === 'DUE_TODAY' &&
              'border-amber-200 bg-amber-50/30 dark:border-amber-900 dark:bg-amber-950/10',
            current?.displayStatus === 'PAID' &&
              'border-emerald-200 bg-emerald-50/30 dark:border-emerald-900 dark:bg-emerald-950/10'
          )}
        >
          <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-serif text-lg sm:text-xl">Tagihan Bulan Ini</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {booking.roomName} · {booking.bookingCode}
              </p>
            </div>
            {current && <PaymentStatusBadge status={current.displayStatus} />}
          </CardHeader>
          <CardContent className="space-y-4">
            {current ? (
              <>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Periode</p>
                    <p className="font-serif text-lg font-semibold sm:text-xl">
                      {current.periodLabel}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Nominal</p>
                    <p className="font-serif text-3xl font-bold text-primary">
                      {formatPrice(current.amount)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Jatuh Tempo
                    </p>
                    <p className="mt-0.5 text-sm font-medium">{formatTanggal(current.dueDate)}</p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Tanggal Pembayaran
                    </p>
                    <p className="mt-0.5 text-sm font-medium">
                      {current.paidAt ? formatTanggal(current.paidAt) : '—'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Metode
                    </p>
                    <p className="mt-0.5 text-sm font-medium">
                      {paymentMethodLabel(current.paymentMethod)}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border/60 bg-background/60 p-3 sm:p-4">
                  <div className="flex items-start gap-2.5">
                    <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{note?.message}</p>
                      {note?.hint && (
                        <p className="mt-1 text-xs text-muted-foreground">{note.hint}</p>
                      )}
                      {current.reminder && current.displayStatus !== 'PAID' && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Pengingat: {current.reminder}
                        </p>
                      )}
                    </div>
                  </div>
                  {current.notes && (
                    <>
                      <Separator className="my-3" />
                      <p className="text-xs text-muted-foreground">Catatan: {current.notes}</p>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="py-4">
                <p className="text-sm font-medium">{bookingStatusText(booking.status)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {booking.isActive
                    ? 'Tagihan akan dibuat otomatis mengikuti tanggal jatuh tempo Anda (tanggal ' +
                      booking.dueDay +
                      ').'
                    : 'Riwayat pembayaran Anda tetap tersimpan di bawah.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* History */}
        <Card id="riwayat" className="scroll-mt-24 border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-lg">
              <History className="h-4 w-4 text-muted-foreground" />
              Riwayat Pembayaran ({history.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <History className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Belum ada riwayat pembayaran untuk Anda.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto sm:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">Periode</th>
                        <th className="pb-3 pr-4 text-right font-medium">Nominal</th>
                        <th className="pb-3 pr-4 font-medium">Jatuh Tempo</th>
                        <th className="pb-3 pr-4 font-medium">Dibayar</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {history.map((payment) => (
                        <tr key={payment.id} className="hover:bg-secondary/50">
                          <td className="py-3 pr-4 font-medium">{payment.periodLabel}</td>
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
                          <td className="py-3">
                            <PaymentStatusBadge status={payment.displayStatus} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3 sm:hidden">
                  {history.map((payment) => (
                    <div key={payment.id} className="rounded-xl border border-border/60 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{payment.periodLabel}</p>
                          <p className="text-xs text-muted-foreground">
                            Jatuh tempo {formatTanggal(payment.dueDate, 'short')}
                          </p>
                        </div>
                        <PaymentStatusBadge status={payment.displayStatus} />
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="font-serif text-base font-bold text-primary">
                          {formatPrice(payment.amount)}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {payment.paidAt
                            ? `Dibayar ${formatTanggal(payment.paidAt, 'short')} · ${paymentMethodLabel(payment.paymentMethod)}`
                            : 'Belum dibayar'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-card p-4">
          <div className="flex items-start gap-2.5">
            <ReceiptText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">Ada pertanyaan seputar pembayaran?</p>
              <p className="text-xs text-muted-foreground">
                Hubungi pengelola Harmony Home untuk konfirmasi transfer atau koreksi data.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/kontak">Hubungi Pengelola</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Beranda</Link>
            </Button>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Halaman ini hanya menampilkan data pembayaran milik Anda sendiri.
        </p>
      </div>
    </section>
  );
}
