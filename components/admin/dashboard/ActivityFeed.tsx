'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  bookingCode: string;
  action: string;
  status: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
  CONFIRMED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
  CANCELLED: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
  COMPLETED: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400',
};

function formatTimestamp(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} mnt lalu`;
  if (diffHr < 24) return `${diffHr} jam lalu`;
  if (diffDay < 7) return `${diffDay} hr lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold sm:text-base">Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Belum ada aktivitas.
          </p>
        ) : (
          <div className="space-y-0">
            {activities.slice(0, 8).map((activity, index) => (
              <div key={activity.id} className="relative flex gap-2.5 pb-3 sm:gap-3 sm:pb-4">
                {index < activities.length - 1 && (
                  <div className="absolute left-[5px] top-3 h-full w-px bg-border sm:left-[7px]" />
                )}
                <div className="relative mt-1 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-border bg-background sm:h-[15px] sm:w-[15px]">
                  <div
                    className={cn(
                      'absolute inset-0.5 rounded-full',
                      activity.status === 'CONFIRMED' && 'bg-emerald-500',
                      activity.status === 'PENDING' && 'bg-amber-500',
                      activity.status === 'CANCELLED' && 'bg-rose-500',
                      activity.status === 'COMPLETED' && 'bg-sky-500'
                    )}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm">{activity.action}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] text-muted-foreground sm:text-xs">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn('text-[9px] sm:text-[10px]', statusColors[activity.status])}
                    >
                      {activity.bookingCode}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
