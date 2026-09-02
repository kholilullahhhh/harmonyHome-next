'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OccupancyWidgetProps {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  occupancyRate: number;
}

export function OccupancyWidget({
  totalRooms,
  occupiedRooms,
  availableRooms,
  maintenanceRooms,
  occupancyRate,
}: OccupancyWidgetProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (occupancyRate / 100) * circumference;

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold sm:text-base">Tingkat Hunian</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <div className="relative flex-shrink-0">
          <svg
            className="h-[100px] w-[100px] sm:h-[130px] sm:w-[130px]"
            viewBox="0 0 130 130"
          >
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="10"
            />
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="none"
              stroke="hsl(var(--chart-1))"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 65 65)"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-lg font-bold sm:text-2xl">{occupancyRate}%</span>
            <span className="text-[9px] text-muted-foreground sm:text-[10px]">terisi</span>
          </div>
        </div>

        <div className="w-full flex-1 space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 sm:h-2.5 sm:w-2.5" />
              <span className="text-xs sm:text-sm">Tersedia</span>
            </div>
            <span className="font-mono text-xs font-semibold sm:text-sm">{availableRooms}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500 sm:h-2.5 sm:w-2.5" />
              <span className="text-xs sm:text-sm">Terisi</span>
            </div>
            <span className="font-mono text-xs font-semibold sm:text-sm">{occupiedRooms}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 sm:h-2.5 sm:w-2.5" />
              <span className="text-xs sm:text-sm">Maintenance</span>
            </div>
            <span className="font-mono text-xs font-semibold sm:text-sm">{maintenanceRooms}</span>
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/30 sm:h-2.5 sm:w-2.5" />
              <span className="text-xs text-muted-foreground sm:text-sm">Total</span>
            </div>
            <span className="font-mono text-xs font-semibold sm:text-sm">{totalRooms}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
