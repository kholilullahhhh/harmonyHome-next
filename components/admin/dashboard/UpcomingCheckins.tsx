'use client';

import { CalendarArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Checkin {
  id: string;
  bookingCode: string;
  name: string;
  roomName: string;
  roomType: string;
  startDate: string;
  daysUntil: number;
}

interface UpcomingCheckinsProps {
  checkins: Checkin[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function UpcomingCheckins({ checkins }: UpcomingCheckinsProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold sm:text-base">Check-in Mendatang</CardTitle>
        <CalendarArrowDown className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {checkins.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground sm:text-sm">
            Tidak ada check-in mendatang.
          </p>
        ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {checkins.map((checkin) => (
              <div
                key={checkin.id}
                className="flex items-center gap-2.5 rounded-lg border border-border/60 p-2.5 sm:gap-3 sm:p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium sm:text-sm">{checkin.name}</p>
                  <p className="text-[11px] text-muted-foreground sm:text-xs">
                    {checkin.roomName} · {checkin.roomType}
                  </p>
                  <p className="text-[11px] text-muted-foreground sm:text-xs">
                    {formatDate(checkin.startDate)}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0 text-[9px] sm:text-[10px]">
                  {checkin.daysUntil} hari lagi
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
