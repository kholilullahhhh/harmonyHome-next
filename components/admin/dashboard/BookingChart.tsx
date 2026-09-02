'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BookingChartProps {
  data: {
    month: string;
    label: string;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  }[];
}

const chartConfig = {
  pending: {
    label: 'Menunggu',
    color: 'hsl(38, 92%, 50%)',
  },
  confirmed: {
    label: 'Dikonfirmasi',
    color: 'hsl(var(--chart-1))',
  },
  completed: {
    label: 'Selesai',
    color: 'hsl(var(--chart-2))',
  },
  cancelled: {
    label: 'Dibatalkan',
    color: 'hsl(0, 72%, 50%)',
  },
} satisfies ChartConfig;

export function BookingChart({ data }: BookingChartProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold sm:text-base">Booking Overview</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <ChartContainer config={chartConfig} className="h-[180px] w-full sm:h-[240px]">
          <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              fontSize={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              fontSize={10}
              allowDecimals={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="pending" fill="var(--color-pending)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="confirmed" fill="var(--color-confirmed)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="completed" fill="var(--color-completed)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="cancelled" fill="var(--color-cancelled)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
