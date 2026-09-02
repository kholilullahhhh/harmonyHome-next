'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

import { StatCards } from '@/components/admin/dashboard/StatCards';
import { RevenueChart } from '@/components/admin/dashboard/RevenueChart';
import { BookingChart } from '@/components/admin/dashboard/BookingChart';
import { OccupancyWidget } from '@/components/admin/dashboard/OccupancyWidget';
import { RoomStatusGrid } from '@/components/admin/dashboard/RoomStatusGrid';
import { RecentBookings } from '@/components/admin/dashboard/RecentBookings';
import { ActivityFeed } from '@/components/admin/dashboard/ActivityFeed';
import { QuickActions } from '@/components/admin/dashboard/QuickActions';
import { Notifications } from '@/components/admin/dashboard/Notifications';
import { UpcomingCheckins } from '@/components/admin/dashboard/UpcomingCheckins';
import { UpcomingCheckouts } from '@/components/admin/dashboard/UpcomingCheckouts';
import { PaymentOverview } from '@/components/admin/dashboard/PaymentOverview';
import { ExpiringRentals } from '@/components/admin/dashboard/ExpiringRentals';
import { RoomUtilization } from '@/components/admin/dashboard/RoomUtilization';

interface DashboardData {
  stats: {
    totalRooms: number;
    availableRooms: number;
    occupiedRooms: number;
    maintenanceRooms: number;
    pendingBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalMessages: number;
    unreadMessages: number;
    activeTenants: number;
    currentMonthRevenue: number;
    lastMonthRevenue: number;
    revenueChange: number;
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
    occupancyRate: number;
  };
  revenueData: { month: string; label: string; revenue: number }[];
  bookingData: {
    month: string;
    label: string;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  }[];
  roomStatusGrid: {
    id: string;
    name: string;
    type: string;
    status: string;
    price: number;
    tenantName: string | null;
    endDate: string | null;
  }[];
  recentBookings: {
    id: string;
    bookingCode: string;
    name: string;
    roomName: string;
    startDate: string;
    duration: number;
    totalPrice: number;
    status: string;
    createdAt: string;
  }[];
  upcomingCheckins: {
    id: string;
    bookingCode: string;
    name: string;
    roomName: string;
    roomType: string;
    startDate: string;
    daysUntil: number;
  }[];
  upcomingCheckouts: {
    id: string;
    bookingCode: string;
    name: string;
    roomName: string;
    roomType: string;
    endDate: string;
    daysUntil: number;
  }[];
  expiringRentals: {
    id: string;
    bookingCode: string;
    name: string;
    roomName: string;
    roomType: string;
    endDate: string;
    daysRemaining: number;
  }[];
  roomUtilization: {
    type: string;
    total: number;
    occupied: number;
    available: number;
    maintenance: number;
    occupancyRate: number;
  }[];
  recentActivity: {
    id: string;
    bookingCode: string;
    action: string;
    status: string;
    timestamp: string;
  }[];
  notifications: {
    id: string;
    type: string;
    title: string;
    description: string;
    count: number;
    severity: 'info' | 'warning' | 'error';
  }[];
}

interface DashboardPageProps {
  data: DashboardData;
}

export function DashboardPage({ data }: DashboardPageProps) {
  const today = new Date();
  const greeting = format(today, "EEEE, d MMMM yyyy", { locale: idLocale });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
          Selamat datang kembali, Admin
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Berikut ringkasan kondisi Harmony Home hari ini.
        </p>
        <p className="mt-0.5 text-[11px] font-medium text-muted-foreground sm:text-xs">{greeting}</p>
      </div>

      {/* Stat Cards */}
      <StatCards stats={data.stats} />

      {/* Revenue Chart + Occupancy */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={data.revenueData} />
        </div>
        <OccupancyWidget
          totalRooms={data.stats.totalRooms}
          occupiedRooms={data.stats.occupiedRooms}
          availableRooms={data.stats.availableRooms}
          maintenanceRooms={data.stats.maintenanceRooms}
          occupancyRate={data.stats.occupancyRate}
        />
      </div>

      {/* Booking Chart + Room Utilization */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BookingChart data={data.bookingData} />
        </div>
        <RoomUtilization data={data.roomUtilization} />
      </div>

      {/* Room Status Grid */}
      <RoomStatusGrid rooms={data.roomStatusGrid} />

      {/* Recent Bookings */}
      <RecentBookings bookings={data.recentBookings} />

      {/* Upcoming Check-in + Check-out */}
      <div className="grid gap-4 md:grid-cols-2">
        <UpcomingCheckins checkins={data.upcomingCheckins} />
        <UpcomingCheckouts checkouts={data.upcomingCheckouts} />
      </div>

      {/* Payment Overview + Expiring Rentals */}
      <div className="grid gap-4 md:grid-cols-2">
        <PaymentOverview
          totalPaid={data.stats.totalPaid}
          totalPending={data.stats.totalPending}
          totalOverdue={data.stats.totalOverdue}
        />
        <ExpiringRentals rentals={data.expiringRentals} />
      </div>

      {/* Notifications + Activity Feed */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Notifications notifications={data.notifications} />
        <ActivityFeed activities={data.recentActivity} />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}
