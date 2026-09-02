'use client';

import { AlertTriangle, Info, XCircle, CheckCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: string;
  title: string;
  description: string;
  count: number;
  severity: 'info' | 'warning' | 'error';
}

interface NotificationsProps {
  notifications: Notification[];
}

const severityConfig = {
  info: {
    icon: Info,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/50',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/50',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
  },
  error: {
    icon: XCircle,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/50',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
  },
};

export function Notifications({ notifications }: NotificationsProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-semibold sm:text-base">Notifikasi</CardTitle>
          {notifications.length > 0 && (
            <Badge variant="secondary" className="h-4 px-1.5 text-[9px] sm:h-5 sm:text-[10px]">
              {notifications.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCheck className="h-7 w-7 text-emerald-500/50 sm:h-8 sm:w-8" />
            <p className="mt-2 text-xs text-muted-foreground sm:text-sm">Semua sudah ditangani</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const config = severityConfig[notification.severity];
              const Icon = config.icon;
              return (
                <div
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-2.5 rounded-lg border border-border/60 p-2.5 sm:gap-3 sm:p-3',
                    config.bgColor
                  )}
                >
                  <Icon className={cn('mt-0.5 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4', config.color)} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium sm:text-sm">{notification.title}</p>
                    <p className="text-[11px] text-muted-foreground sm:text-xs">{notification.description}</p>
                  </div>
                  <Badge variant="secondary" className={cn('shrink-0 text-[9px] sm:text-[10px]', config.badge)}>
                    {notification.count}
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
