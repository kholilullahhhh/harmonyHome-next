'use client';

import { CalendarArrowUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Checkout {
  id: string;
  bookingCode: string;
  name: string;
  roomName: string;
  roomType: string;
  endDate: string;
  daysUntil: number;
}

interface UpcomingCheckoutsProps {
  checkouts: Checkout[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getUrgencyBadge(daysUntil: number) {
  if (daysUntil <= 1) {
    return { label: daysUntil === 0 ? 'Besok' : 'Hari ini', className: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' };
  }
  if (daysUntil <= 3) {
    return { label: `${daysUntil} hari lagi`, className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' };
  }
  return { label: `${daysUntil} hari lagi`, className: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400' };
}

export function UpcomingCheckouts({ checkouts }: UpcomingCheckoutsProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold sm:text-base">Check-out Mendatang</CardTitle>
        <CalendarArrowUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {checkouts.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground sm:text-sm">
            Tidak ada check-out mendatang.
          </p>
        ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {checkouts.map((checkout) => {
              const urgency = getUrgencyBadge(checkout.daysUntil);
              return (
                <div
                  key={checkout.id}
                  className="flex items-center gap-2.5 rounded-lg border border-border/60 p-2.5 sm:gap-3 sm:p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium sm:text-sm">{checkout.name}</p>
                    <p className="text-[11px] text-muted-foreground sm:text-xs">
                      {checkout.roomName} · {checkout.roomType}
                    </p>
                    <p className="text-[11px] text-muted-foreground sm:text-xs">
                      Berakhir: {formatDate(checkout.endDate)}
                    </p>
                  </div>
                  <Badge variant="secondary" className={cn('shrink-0 text-[9px] sm:text-[10px]', urgency.className)}>
                    {urgency.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
