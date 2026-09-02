'use client';

import {
  DoorOpen,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Banknote,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardsProps {
  stats: {
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    maintenanceRooms: number;
    pendingBookings: number;
    confirmedBookings: number;
    activeTenants: number;
    currentMonthRevenue: number;
    revenueChange: number;
  };
}

function formatPrice(price: number): string {
  if (price >= 1_000_000_000) {
    return `Rp${(price / 1_000_000_000).toFixed(1)}jt`;
  }
  if (price >= 1_000_000) {
    return `Rp${(price / 1_000_000).toFixed(0)}.jt`;
  }
  return 'Rp' + price.toLocaleString('id-ID');
}

function TrendIndicator({ value }: { value: number }) {
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground sm:text-xs">
        <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        0%
      </span>
    );
  }
  const isPositive = value > 0;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-[10px] font-medium sm:text-xs',
        isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
      )}
    >
      {isPositive ? <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
      {isPositive ? '+' : ''}
      {value}%
    </span>
  );
}

export function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      title: 'Total Kamar',
      value: stats.totalRooms,
      icon: DoorOpen,
      description: `${stats.availableRooms} tersedia · ${stats.occupiedRooms} terisi`,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/50',
    },
    {
      title: 'Kamar Terisi',
      value: stats.occupiedRooms,
      icon: CheckCircle2,
      description: `${stats.totalRooms > 0 ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0}% dari total`,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      title: 'Kamar Tersedia',
      value: stats.availableRooms,
      icon: DoorOpen,
      description: `${stats.maintenanceRooms} maintenance`,
      color: 'text-primary',
      bgColor: 'bg-primary/5 dark:bg-primary/10',
    },
    {
      title: 'Booking Baru',
      value: stats.pendingBookings,
      icon: Clock,
      description: `${stats.confirmedBookings} dikonfirmasi`,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/50',
    },
    {
      title: 'Penghuni Aktif',
      value: stats.activeTenants,
      icon: Users,
      description: `dari ${stats.totalRooms} kamar`,
      color: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-950/50',
    },
    {
      title: 'Pendapatan',
      value: formatPrice(stats.currentMonthRevenue),
      icon: Banknote,
      description: 'bulan ini',
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/50',
      extra: <TrendIndicator value={stats.revenueChange} />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="border-border/60">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
                    {card.title}
                  </p>
                  <p className="mt-1 font-serif text-xl font-bold tracking-tight sm:mt-1.5 sm:text-2xl">
                    {card.value}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-0.5">
                    {card.extra ?? null}
                    <p className="truncate text-[10px] text-muted-foreground sm:text-xs">
                      {card.description}
                    </p>
                  </div>
                </div>
                <div className={cn('shrink-0 rounded-lg p-1.5 sm:p-2', card.bgColor)}>
                  <Icon className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', card.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
