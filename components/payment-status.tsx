'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PaymentDisplayStatus } from '@/lib/payment-dates';

export const paymentStatusConfig: Record<
  PaymentDisplayStatus,
  { label: string; className: string; dotClassName: string }
> = {
  PAID: {
    label: 'Sudah Dibayar',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
    dotClassName: 'bg-emerald-500',
  },
  DUE_TODAY: {
    label: 'Jatuh Tempo Hari Ini',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
    dotClassName: 'bg-amber-500',
  },
  OVERDUE: {
    label: 'Terlambat',
    className: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
    dotClassName: 'bg-rose-500',
  },
  UPCOMING: {
    label: 'Belum Dibayar',
    className: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400',
    dotClassName: 'bg-sky-500',
  },
};

export const paymentStatusMessages: Record<PaymentDisplayStatus, string> = {
  UPCOMING: 'Pembayaran bulan ini belum dilakukan.',
  DUE_TODAY: 'Pembayaran jatuh tempo hari ini.',
  OVERDUE: 'Pembayaran bulan ini telah melewati tanggal jatuh tempo.',
  PAID: 'Pembayaran bulan ini sudah diterima.',
};

export const paymentMethodLabels: Record<string, string> = {
  CASH: 'Tunai',
  TRANSFER: 'Transfer',
  QRIS: 'QRIS',
  OTHER: 'Lainnya',
};

export function PaymentStatusBadge({
  status,
  className,
}: {
  status: PaymentDisplayStatus;
  className?: string;
}) {
  const config = paymentStatusConfig[status] ?? paymentStatusConfig.UPCOMING;
  return (
    <Badge variant="secondary" className={cn('whitespace-nowrap text-xs', config.className, className)}>
      {config.label}
    </Badge>
  );
}

export function paymentMethodLabel(method: string | null | undefined): string {
  if (!method) return '—';
  return paymentMethodLabels[method] ?? method;
}
