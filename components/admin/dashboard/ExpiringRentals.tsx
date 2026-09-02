'use client';

import { Clock, Phone, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExpiringRental {
  id: string;
  bookingCode: string;
  name: string;
  roomName: string;
  roomType: string;
  endDate: string;
  daysRemaining: number;
}

interface ExpiringRentalsProps {
  rentals: ExpiringRental[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getUrgencyBadge(daysRemaining: number) {
  if (daysRemaining <= 3) {
    return { label: `${daysRemaining} hari`, className: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' };
  }
  if (daysRemaining <= 7) {
    return { label: `${daysRemaining} hari`, className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' };
  }
  return { label: `${daysRemaining} hari`, className: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400' };
}

export function ExpiringRentals({ rentals }: ExpiringRentalsProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold sm:text-base">Masa Sewa Akan Berakhir</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {rentals.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground sm:text-sm">
            Tidak ada masa sewa yang berakhir dalam 30 hari.
          </p>
        ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {rentals.map((rental) => {
              const urgency = getUrgencyBadge(rental.daysRemaining);
              return (
                <div
                  key={rental.id}
                  className="rounded-lg border border-border/60 p-2.5 sm:p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium sm:text-sm">{rental.name}</p>
                      <p className="text-[11px] text-muted-foreground sm:text-xs">
                        {rental.roomName} · {rental.roomType}
                      </p>
                      <p className="text-[11px] text-muted-foreground sm:text-xs">
                        Berakhir: {formatDate(rental.endDate)}
                      </p>
                    </div>
                    <Badge variant="secondary" className={cn('shrink-0 text-[9px] sm:text-[10px]', urgency.className)}>
                      {urgency.label}
                    </Badge>
                  </div>
                  <div className="mt-2 flex gap-1.5 sm:gap-2">
                    <Button variant="outline" size="sm" className="h-7 gap-1 text-[11px] sm:text-xs">
                      <Phone className="h-3 w-3" />
                      Hubungi
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 gap-1 text-[11px] sm:text-xs">
                      <RefreshCw className="h-3 w-3" />
                      Perpanjang
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
