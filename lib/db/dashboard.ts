import { prisma } from '@/lib/db/prisma';
import { addMonths, differenceInDays, format, startOfMonth, subMonths } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

// ─── Core Stats ───────────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));

  const [
    totalRooms,
    availableRooms,
    occupiedRooms,
    maintenanceRooms,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    totalMessages,
    unreadMessages,
    activeTenants,
    currentMonthRevenue,
    lastMonthRevenue,
    totalPaid,
    totalPending,
    totalOverdue,
  ] = await Promise.all([
    prisma.room.count(),
    prisma.room.count({ where: { status: 'AVAILABLE' } }),
    prisma.room.count({ where: { status: 'OCCUPIED' } }),
    prisma.room.count({ where: { status: 'MAINTENANCE' } }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({ where: { status: 'CONFIRMED' } }),
    prisma.booking.count({ where: { status: 'COMPLETED' } }),
    prisma.booking.count({ where: { status: 'CANCELLED' } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    prisma.booking.count({
      where: { status: 'CONFIRMED', startDate: { lte: now } },
    }),
    prisma.booking.aggregate({
      where: {
        status: { in: ['CONFIRMED', 'COMPLETED'] },
        createdAt: { gte: currentMonthStart },
      },
      _sum: { totalPrice: true },
    }),
    prisma.booking.aggregate({
      where: {
        status: { in: ['CONFIRMED', 'COMPLETED'] },
        createdAt: { gte: lastMonthStart, lt: currentMonthStart },
      },
      _sum: { totalPrice: true },
    }),
    prisma.booking.aggregate({
      where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
      _sum: { totalPrice: true },
    }),
    prisma.booking.aggregate({
      where: { status: 'PENDING' },
      _sum: { totalPrice: true },
    }),
    prisma.booking.aggregate({
      where: { status: 'CANCELLED' },
      _sum: { totalPrice: true },
    }),
  ]);

  const currentRevenue = currentMonthRevenue._sum.totalPrice ?? 0;
  const lastRevenue = lastMonthRevenue._sum.totalPrice ?? 0;
  const revenueChange =
    lastRevenue > 0
      ? Math.round(((currentRevenue - lastRevenue) / lastRevenue) * 100)
      : currentRevenue > 0
        ? 100
        : 0;

  return {
    totalRooms,
    availableRooms,
    occupiedRooms,
    maintenanceRooms,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    totalMessages,
    unreadMessages,
    activeTenants,
    currentMonthRevenue: currentRevenue,
    lastMonthRevenue: lastRevenue,
    revenueChange,
    totalPaid: totalPaid._sum.totalPrice ?? 0,
    totalPending: totalPending._sum.totalPrice ?? 0,
    totalOverdue: totalOverdue._sum.totalPrice ?? 0,
    occupancyRate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 1000) / 10 : 0,
  };
}

// ─── Revenue Chart Data ───────────────────────────────────────────────────────

export async function getRevenueChartData(months = 6) {
  const now = new Date();
  const data: { month: string; label: string; revenue: number }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = addMonths(monthDate, 1);

    const result = await prisma.booking.aggregate({
      where: {
        status: { in: ['CONFIRMED', 'COMPLETED'] },
        createdAt: { gte: monthStart, lt: monthEnd },
      },
      _sum: { totalPrice: true },
    });

    data.push({
      month: format(monthDate, 'yyyy-MM'),
      label: format(monthDate, 'MMM', { locale: idLocale }),
      revenue: result._sum.totalPrice ?? 0,
    });
  }

  return data;
}

// ─── Booking Chart Data ───────────────────────────────────────────────────────

export async function getBookingChartData(months = 6) {
  const now = new Date();
  const data: {
    month: string;
    label: string;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = addMonths(monthDate, 1);

    const [pending, confirmed, completed, cancelled] = await Promise.all([
      prisma.booking.count({
        where: {
          status: 'PENDING',
          createdAt: { gte: monthStart, lt: monthEnd },
        },
      }),
      prisma.booking.count({
        where: {
          status: 'CONFIRMED',
          createdAt: { gte: monthStart, lt: monthEnd },
        },
      }),
      prisma.booking.count({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: monthStart, lt: monthEnd },
        },
      }),
      prisma.booking.count({
        where: {
          status: 'CANCELLED',
          createdAt: { gte: monthStart, lt: monthEnd },
        },
      }),
    ]);

    data.push({
      month: format(monthDate, 'yyyy-MM'),
      label: format(monthDate, 'MMM', { locale: idLocale }),
      pending,
      confirmed,
      completed,
      cancelled,
    });
  }

  return data;
}

// ─── Room Status Grid ─────────────────────────────────────────────────────────

export async function getRoomStatusGrid() {
  const rooms = await prisma.room.findMany({
    orderBy: { name: 'asc' },
    include: {
      bookings: {
        where: { status: 'CONFIRMED' },
        select: {
          name: true,
          startDate: true,
          duration: true,
          durationUnit: true,
        },
        take: 1,
      },
    },
  });

  const now = new Date();

  return rooms.map((room) => {
    const activeBooking = room.bookings[0];
    let tenantName: string | null = null;
    let endDate: Date | null = null;

    if (activeBooking) {
      tenantName = activeBooking.name;
      endDate = addMonths(
        activeBooking.startDate,
        activeBooking.durationUnit === 'MONTH'
          ? activeBooking.duration
          : Math.ceil(activeBooking.duration / 30)
      );
    }

    return {
      id: room.id,
      name: room.name,
      type: room.type,
      status: room.status,
      price: room.price,
      tenantName,
      endDate: endDate?.toISOString() ?? null,
    };
  });
}

// ─── Recent Bookings ──────────────────────────────────────────────────────────

export async function getRecentBookings(limit = 5) {
  const bookings = await prisma.booking.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { room: { select: { name: true, price: true } } },
  });

  return bookings.map((b) => ({
    id: b.id,
    bookingCode: b.bookingCode,
    name: b.name,
    email: b.email,
    phone: b.phone,
    roomName: b.room.name,
    startDate: b.startDate.toISOString(),
    duration: b.duration,
    totalPrice: b.totalPrice,
    status: b.status,
    createdAt: b.createdAt.toISOString(),
  }));
}

// ─── Upcoming Check-ins ───────────────────────────────────────────────────────

export async function getUpcomingCheckins(limit = 5) {
  const now = new Date();

  const bookings = await prisma.booking.findMany({
    where: {
      status: 'CONFIRMED',
      startDate: { gt: now },
    },
    orderBy: { startDate: 'asc' },
    take: limit,
    include: { room: { select: { name: true, type: true } } },
  });

  return bookings.map((b) => ({
    id: b.id,
    bookingCode: b.bookingCode,
    name: b.name,
    roomName: b.room.name,
    roomType: b.room.type,
    startDate: b.startDate.toISOString(),
    daysUntil: differenceInDays(b.startDate, now),
  }));
}

// ─── Upcoming Check-outs ──────────────────────────────────────────────────────

export async function getUpcomingCheckouts(limit = 5) {
  const now = new Date();

  const confirmedBookings = await prisma.booking.findMany({
    where: { status: 'CONFIRMED' },
    include: { room: { select: { name: true, type: true } } },
  });

  const checkoutData = confirmedBookings
    .map((b) => {
      const durationMonths =
        b.durationUnit === 'MONTH'
          ? b.duration
          : Math.ceil(b.duration / 30);
      const endDate = addMonths(b.startDate, durationMonths);
      const daysUntil = differenceInDays(endDate, now);

      return {
        id: b.id,
        bookingCode: b.bookingCode,
        name: b.name,
        roomName: b.room.name,
        roomType: b.room.type,
        endDate: endDate.toISOString(),
        daysUntil,
      };
    })
    .filter((item) => item.daysUntil > 0 && item.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, limit);

  return checkoutData;
}

// ─── Expiring Rentals ─────────────────────────────────────────────────────────

export async function getExpiringRentals(limit = 5) {
  const now = new Date();

  const confirmedBookings = await prisma.booking.findMany({
    where: { status: 'CONFIRMED' },
    include: { room: { select: { name: true, type: true } } },
  });

  const expiring = confirmedBookings
    .map((b) => {
      const durationMonths =
        b.durationUnit === 'MONTH'
          ? b.duration
          : Math.ceil(b.duration / 30);
      const endDate = addMonths(b.startDate, durationMonths);
      const daysRemaining = differenceInDays(endDate, now);

      return {
        id: b.id,
        bookingCode: b.bookingCode,
        name: b.name,
        roomName: b.room.name,
        roomType: b.room.type,
        endDate: endDate.toISOString(),
        daysRemaining,
      };
    })
    .filter((item) => item.daysRemaining > 0 && item.daysRemaining <= 30)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, limit);

  return expiring;
}

// ─── Room Utilization by Type ─────────────────────────────────────────────────

export async function getRoomUtilization() {
  const rooms = await prisma.room.groupBy({
    by: ['type'],
    _count: { id: true },
  });

  const utilization = await Promise.all(
    rooms.map(async (group) => {
      const occupied = await prisma.room.count({
        where: { type: group.type, status: 'OCCUPIED' },
      });

      return {
        type: group.type,
        total: group._count.id,
        occupied,
        available: await prisma.room.count({
          where: { type: group.type, status: 'AVAILABLE' },
        }),
        maintenance: await prisma.room.count({
          where: { type: group.type, status: 'MAINTENANCE' },
        }),
        occupancyRate:
          group._count.id > 0
            ? Math.round((occupied / group._count.id) * 1000) / 10
            : 0,
      };
    })
  );

  return utilization;
}

// ─── Recent Activity ──────────────────────────────────────────────────────────

export async function getRecentActivity(limit = 10) {
  const recentBookings = await prisma.booking.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { room: { select: { name: true } } },
  });

  const activities = recentBookings.map((b) => {
    let action: string;
    switch (b.status) {
      case 'PENDING':
        action = `${b.name} melakukan booking ${b.room.name}`;
        break;
      case 'CONFIRMED':
        action = `Booking ${b.bookingCode} dikonfirmasi`;
        break;
      case 'COMPLETED':
        action = `Booking ${b.bookingCode} selesai`;
        break;
      case 'CANCELLED':
        action = `Booking ${b.bookingCode} dibatalkan`;
        break;
      default:
        action = `Aktivitas pada ${b.bookingCode}`;
    }

    return {
      id: b.id,
      bookingCode: b.bookingCode,
      action,
      status: b.status,
      timestamp: b.createdAt.toISOString(),
    };
  });

  return activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// ─── Notifications / Alerts ───────────────────────────────────────────────────

export async function getNotifications() {
  const now = new Date();
  const notifications: {
    id: string;
    type: string;
    title: string;
    description: string;
    count: number;
    severity: 'info' | 'warning' | 'error';
  }[] = [];

  const pendingBookings = await prisma.booking.count({
    where: { status: 'PENDING' },
  });
  if (pendingBookings > 0) {
    notifications.push({
      id: 'pending-bookings',
      type: 'booking',
      title: 'Booking menunggu konfirmasi',
      description: `${pendingBookings} booking baru perlu dikonfirmasi`,
      count: pendingBookings,
      severity: 'warning',
    });
  }

  const maintenanceRooms = await prisma.room.count({
    where: { status: 'MAINTENANCE' },
  });
  if (maintenanceRooms > 0) {
    notifications.push({
      id: 'maintenance-rooms',
      type: 'room',
      title: 'Kamar dalam maintenance',
      description: `${maintenanceRooms} kamar sedang dalam perbaikan`,
      count: maintenanceRooms,
      severity: 'info',
    });
  }

  const unreadMessages = await prisma.contactMessage.count({
    where: { status: 'UNREAD' },
  });
  if (unreadMessages > 0) {
    notifications.push({
      id: 'unread-messages',
      type: 'message',
      title: 'Pesan belum dibaca',
      description: `${unreadMessages} pesan baru belum dibaca`,
      count: unreadMessages,
      severity: 'info',
    });
  }

  const confirmedBookings = await prisma.booking.findMany({
    where: { status: 'CONFIRMED' },
  });

  const expiringCount = confirmedBookings.filter((b) => {
    const durationMonths =
      b.durationUnit === 'MONTH'
        ? b.duration
        : Math.ceil(b.duration / 30);
    const endDate = addMonths(b.startDate, durationMonths);
    const daysUntil = differenceInDays(endDate, now);
    return daysUntil > 0 && daysUntil <= 7;
  }).length;

  if (expiringCount > 0) {
    notifications.push({
      id: 'expiring-rentals',
      type: 'expiry',
      title: 'Masa sewa hampir berakhir',
      description: `${expiringCount} penyewa akan berakhir dalam 7 hari`,
      count: expiringCount,
      severity: 'error',
    });
  }

  return notifications;
}

// ─── All-in-one dashboard data ────────────────────────────────────────────────

export async function getDashboardData() {
  const [
    stats,
    revenueData,
    bookingData,
    roomStatusGrid,
    recentBookings,
    upcomingCheckins,
    upcomingCheckouts,
    expiringRentals,
    roomUtilization,
    recentActivity,
    notifications,
  ] = await Promise.all([
    getDashboardStats(),
    getRevenueChartData(6),
    getBookingChartData(6),
    getRoomStatusGrid(),
    getRecentBookings(5),
    getUpcomingCheckins(5),
    getUpcomingCheckouts(5),
    getExpiringRentals(5),
    getRoomUtilization(),
    getRecentActivity(10),
    getNotifications(),
  ]);

  return {
    stats,
    revenueData,
    bookingData,
    roomStatusGrid,
    recentBookings,
    upcomingCheckins,
    upcomingCheckouts,
    expiringRentals,
    roomUtilization,
    recentActivity,
    notifications,
  };
}
