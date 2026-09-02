'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RoomUtilizationData {
  type: string;
  total: number;
  occupied: number;
  available: number;
  maintenance: number;
  occupancyRate: number;
}

interface RoomUtilizationProps {
  data: RoomUtilizationData[];
}

const typeColors: Record<string, string> = {
  Standard: 'bg-blue-500',
  Premium: 'bg-violet-500',
  Executive: 'bg-amber-500',
};

export function RoomUtilization({ data }: RoomUtilizationProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold sm:text-base">Penggunaan Kamar</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground sm:text-sm">
            Belum ada data kamar.
          </p>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {data.map((item) => (
              <div key={item.type} className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className={`h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5 ${typeColors[item.type] ?? 'bg-muted-foreground'}`} />
                    <span className="text-xs font-medium sm:text-sm">{item.type}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground sm:text-xs">
                    {item.occupied}/{item.total} kamar
                  </span>
                </div>
                <div className="relative h-1.5 rounded-full bg-secondary sm:h-2">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full ${typeColors[item.type] ?? 'bg-muted-foreground'} transition-all duration-500`}
                    style={{ width: `${item.occupancyRate}%` }}
                  />
                </div>
                <div className="flex justify-end">
                  <span className="text-[10px] font-medium text-muted-foreground sm:text-xs">
                    {item.occupancyRate}% terisi
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
