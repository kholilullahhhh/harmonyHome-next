'use client';

import Link from 'next/link';
import { Bed, Wrench, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Room {
  id: string;
  name: string;
  type: string;
  status: string;
  price: number;
  tenantName: string | null;
  endDate: string | null;
}

interface RoomStatusGridProps {
  rooms: Room[];
}

const statusConfig: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  AVAILABLE: {
    label: 'Tersedia',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
    icon: CheckCircle2,
  },
  OCCUPIED: {
    label: 'Terisi',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
    icon: Bed,
  },
  MAINTENANCE: {
    label: 'Maintenance',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
    icon: Wrench,
  },
};

const typeColors: Record<string, string> = {
  Standard: 'border-l-blue-500',
  Premium: 'border-l-violet-500',
  Executive: 'border-l-amber-500',
};

export function RoomStatusGrid({ rooms }: RoomStatusGridProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold sm:text-base">Status Kamar</CardTitle>
        <Link
          href="/admin/rooms"
          className="text-[11px] font-medium text-primary hover:underline sm:text-xs"
        >
          Lihat Semua
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => {
            const st = statusConfig[room.status] ?? statusConfig.AVAILABLE;
            const StatusIcon = st.icon;
            return (
              <Link
                key={room.id}
                href={`/admin/rooms/${room.id}`}
                className={cn(
                  'group flex items-center gap-2.5 rounded-lg border border-border/60 border-l-4 p-2.5 transition-colors hover:bg-secondary/50 sm:gap-3 sm:p-3',
                  typeColors[room.type] ?? 'border-l-muted-foreground/30'
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-xs font-semibold sm:text-sm">{room.name}</span>
                    <span className="text-[9px] text-muted-foreground sm:text-[10px]">{room.type}</span>
                  </div>
                  {room.tenantName && (
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground sm:text-xs">
                      {room.tenantName}
                    </p>
                  )}
                </div>
                <Badge variant="secondary" className={cn('shrink-0 text-[9px] sm:text-[10px]', st.className)}>
                  <StatusIcon className="mr-0.5 h-2 w-2 sm:mr-1 sm:h-2.5 sm:w-2.5" />
                  {st.label}
                </Badge>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
