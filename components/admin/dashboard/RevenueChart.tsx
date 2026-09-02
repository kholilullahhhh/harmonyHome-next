'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RevenueChartProps {
  data: { month: string; label: string; revenue: number }[];
}

const chartConfig = {
  revenue: {
    label: 'Pendapatan',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

function formatPrice(price: number): string {
  if (price >= 1_000_000) {
    return `Rp${(price / 1_000_000).toFixed(0)}jt`;
  }
  return 'Rp' + price.toLocaleString('id-ID');
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold sm:text-base">Pendapatan</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <ChartContainer config={chartConfig} className="h-[180px] w-full sm:h-[240px]">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              fontSize={10}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatPrice(Number(value))}
                  labelFormatter={(label) => `${label}`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              fill="url(#fillRevenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
