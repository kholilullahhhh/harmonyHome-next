'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  DoorOpen,
  CalendarCheck,
  MessageCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Users,
  ArrowRight,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalMessages: number;
  unreadMessages: number;
}

interface RecentBooking {
  id: string;
  bookingCode: string;
  name: string;
  roomName: string;
  startDate: string;
  duration: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface DashboardPageProps {
  stats: DashboardStats;
  recentBookings: RecentBooking[];
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: 'Menunggu',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
  },
  CONFIRMED: {
    label: 'Dikonfirmasi',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
  },
  CANCELLED: {
    label: 'Dibatalkan',
    className: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
  },
  COMPLETED: {
    label: 'Selesai',
    className: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400',
  },
};

function formatPrice(price: number): string {
  return 'Rp' + price.toLocaleString('id-ID');
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function DashboardPage({ stats, recentBookings }: DashboardPageProps) {
  const statCards = [
    {
      title: 'Total Kamar',
      value: stats.totalRooms,
      icon: DoorOpen,
      description: `${stats.availableRooms} tersedia, ${stats.occupiedRooms} terisi`,
      color: 'text-primary',
    },
    {
      title: 'Booking Pending',
      value: stats.pendingBookings,
      icon: Clock,
      description: `${stats.confirmedBookings} dikonfirmasi`,
      color: 'text-amber-600',
    },
    {
      title: 'Pesan Masuk',
      value: stats.totalMessages,
      icon: MessageCircle,
      description: `${stats.unreadMessages} belum dibaca`,
      color: 'text-sky-600',
    },
    {
      title: 'Kamar Tersedia',
      value: stats.availableRooms,
      icon: CheckCircle2,
      description: `dari ${stats.totalRooms} total`,
      color: 'text-emerald-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Selamat datang di admin panel Harmony Home.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="border-border/60">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs uppercase tracking-wider text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">
                      {card.value}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                  <div className={`shrink-0 rounded-lg bg-secondary p-2 sm:p-2.5 ${card.color}`}>
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Room Occupancy */}
        <Card className="border-border/60 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Occupancy Kamar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Tersedia', count: stats.availableRooms, color: 'bg-emerald-500' },
              { label: 'Terisi', count: stats.occupiedRooms, color: 'bg-sky-500' },
              { label: 'Maintenance', count: stats.maintenanceRooms, color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${item.color}`} />
                    {item.label}
                  </div>
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{
                      width: stats.totalRooms
                        ? `${(item.count / stats.totalRooms) * 100}%`
                        : '0%',
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="border-border/60 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Booking Terbaru</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/bookings">
                Lihat Semua
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Belum ada booking.
              </p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => {
                  const st = statusConfig[booking.status] ?? statusConfig.PENDING;
                  return (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between gap-4 rounded-lg border border-border/60 p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-primary">
                            {booking.bookingCode}
                          </span>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${st.className}`}
                          >
                            {st.label}
                          </Badge>
                        </div>
                        <p className="mt-0.5 truncate text-sm font-medium">
                          {booking.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {booking.roomName} · {booking.duration} bln ·{' '}
                          {formatDate(booking.startDate)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold whitespace-nowrap">
                          {formatPrice(booking.totalPrice)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
