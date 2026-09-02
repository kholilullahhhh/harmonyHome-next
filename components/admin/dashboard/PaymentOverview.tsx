'use client';

import Link from 'next/link';
import { ArrowRight, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PaymentOverviewProps {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
}

function formatPrice(price: number): string {
  return 'Rp' + price.toLocaleString('id-ID');
}

export function PaymentOverview({ totalPaid, totalPending, totalOverdue }: PaymentOverviewProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold sm:text-base">Ringkasan Pembayaran</CardTitle>
        <Button asChild variant="ghost" size="sm" className="h-8">
          <Link href="/admin/bookings">
            Lihat Semua
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border/60 p-2.5 sm:p-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="rounded-lg bg-emerald-50 p-1.5 dark:bg-emerald-950/50 sm:p-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 sm:h-4 sm:w-4" />
              </div>
              <div>
                <p className="text-xs font-medium sm:text-sm">Sudah Dibayar</p>
                <p className="text-[10px] text-muted-foreground sm:text-xs">Total dari semua booking</p>
              </div>
            </div>
            <p className="font-serif text-sm font-bold text-emerald-600 dark:text-emerald-400 sm:text-lg">
              {formatPrice(totalPaid)}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border/60 p-2.5 sm:p-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="rounded-lg bg-amber-50 p-1.5 dark:bg-amber-950/50 sm:p-2">
                <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 sm:h-4 sm:w-4" />
              </div>
              <div>
                <p className="text-xs font-medium sm:text-sm">Belum Dibayar</p>
                <p className="text-[10px] text-muted-foreground sm:text-xs">Booking pending</p>
              </div>
            </div>
            <p className="font-serif text-sm font-bold text-amber-600 dark:text-amber-400 sm:text-lg">
              {formatPrice(totalPending)}
            </p>
          </div>

          {totalOverdue > 0 && (
            <div className="flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50/50 p-2.5 dark:border-rose-900 dark:bg-rose-950/20 sm:p-3">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="rounded-lg bg-rose-100 p-1.5 dark:bg-rose-950/50 sm:p-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 sm:h-4 sm:w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium sm:text-sm">Dibatalkan</p>
                  <p className="text-[10px] text-muted-foreground sm:text-xs">Total booking dibatalkan</p>
                </div>
              </div>
              <p className="font-serif text-sm font-bold text-rose-600 dark:text-rose-400 sm:text-lg">
                {formatPrice(totalOverdue)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
