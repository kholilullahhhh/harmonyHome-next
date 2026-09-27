'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  Wallet,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface MonthlyPaymentSummaryData {
  activeTenants: number;
  paid: number;
  unpaid: number;
  dueToday: number;
  overdue: number;
  receivedThisMonth: number;
  unpaidAmount: number;
  periodLabel: string;
}

function formatPrice(price: number): string {
  return 'Rp' + price.toLocaleString('id-ID');
}

const tiles = [
  {
    key: 'paid' as const,
    title: 'Sudah Bayar',
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
  },
  {
    key: 'unpaid' as const,
    title: 'Belum Bayar',
    icon: Clock,
    color: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-50 dark:bg-sky-950/50',
  },
  {
    key: 'dueToday' as const,
    title: 'Jatuh Tempo Hari Ini',
    icon: CalendarClock,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/50',
  },
  {
    key: 'overdue' as const,
    title: 'Terlambat',
    icon: AlertTriangle,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/50',
  },
];

export function MonthlyPaymentSummary({ data }: { data: MonthlyPaymentSummaryData }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base sm:text-lg">Pembayaran Bulanan</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Periode {data.periodLabel} · {data.activeTenants} penyewa aktif
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="h-8 w-fit">
          <Link href="/admin/penyewa">
            Kelola Penyewa
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            const value = data[tile.key];
            const isWarning = tile.key === 'overdue' && value > 0;
            return (
              <div
                key={tile.key}
                className={cn(
                  'rounded-xl border border-border/60 p-3 transition-colors sm:p-4',
                  isWarning && 'border-rose-200 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/20'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
                      {tile.title}
                    </p>
                    <p className="mt-1 font-serif text-2xl font-bold tracking-tight sm:text-3xl">
                      {value}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
                      {value > 0 ? 'penyewa' : 'tidak ada'}
                    </p>
                  </div>
                  <div className={cn('shrink-0 rounded-lg p-1.5 sm:p-2', tile.bgColor)}>
                    <Icon className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', tile.color)} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
          <div className="flex items-center justify-between rounded-lg border border-border/60 p-2.5 sm:p-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="rounded-lg bg-emerald-50 p-1.5 dark:bg-emerald-950/50 sm:p-2">
                <Wallet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 sm:h-4 sm:w-4" />
              </div>
              <div>
                <p className="text-xs font-medium sm:text-sm">Diterima Bulan Ini</p>
                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  Total pembayaran masuk
                </p>
              </div>
            </div>
            <p className="font-serif text-sm font-bold text-emerald-600 dark:text-emerald-400 sm:text-lg">
              {formatPrice(data.receivedThisMonth)}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border/60 p-2.5 sm:p-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="rounded-lg bg-amber-50 p-1.5 dark:bg-amber-950/50 sm:p-2">
                <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 sm:h-4 sm:w-4" />
              </div>
              <div>
                <p className="text-xs font-medium sm:text-sm">Belum Dibayar</p>
                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  Tagihan periode berjalan
                </p>
              </div>
            </div>
            <p className="font-serif text-sm font-bold text-amber-600 dark:text-amber-400 sm:text-lg">
              {formatPrice(data.unpaidAmount)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
