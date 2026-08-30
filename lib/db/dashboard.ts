import { prisma } from '@/lib/db/prisma';
import type { Prisma } from '@prisma/client';

export async function getDashboardStats() {
  const [
    totalRooms,
    availableRooms,
    occupiedRooms,
    maintenanceRooms,
    pendingBookings,
    confirmedBookings,
    totalMessages,
    unreadMessages,
  ] = await Promise.all([
    prisma.room.count(),
    prisma.room.count({ where: { status: 'AVAILABLE' } }),
    prisma.room.count({ where: { status: 'OCCUPIED' } }),
    prisma.room.count({ where: { status: 'MAINTENANCE' } }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({ where: { status: 'CONFIRMED' } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
  ]);

  return {
    totalRooms,
    availableRooms,
    occupiedRooms,
    maintenanceRooms,
    pendingBookings,
    confirmedBookings,
    totalMessages,
    unreadMessages,
  };
}

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
    roomName: b.room.name,
    startDate: b.startDate.toISOString(),
    duration: b.duration,
    totalPrice: b.totalPrice,
    status: b.status,
    createdAt: b.createdAt.toISOString(),
  }));
}
