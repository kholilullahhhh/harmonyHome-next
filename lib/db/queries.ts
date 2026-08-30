import { prisma } from '@/lib/db/prisma';
import type { Prisma } from '@prisma/client';

// ── Rooms ────────────────────────────────────────────

export async function getAllRooms() {
  return prisma.room.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getRoomById(id: string) {
  return prisma.room.findUnique({ where: { id } });
}

export async function getRoomBySlug(slug: string) {
  return prisma.room.findUnique({ where: { slug } });
}

export async function createRoom(data: Prisma.RoomCreateInput) {
  return prisma.room.create({ data });
}

export async function updateRoom(id: string, data: Prisma.RoomUpdateInput) {
  return prisma.room.update({ where: { id }, data });
}

export async function deleteRoom(id: string) {
  return prisma.room.delete({ where: { id } });
}

// ── Bookings ─────────────────────────────────────────

export async function getAllBookings(params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: Prisma.BookingWhereInput = {};

  if (params?.status && params.status !== 'all') {
    where.status = params.status as 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  }

  if (params?.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { bookingCode: { contains: params.search, mode: 'insensitive' } },
      { email: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { room: { select: { name: true, price: true, slug: true } } },
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    bookings,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: { room: true },
  });
}

export async function updateBookingStatus(
  id: string,
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
) {
  return prisma.booking.update({
    where: { id },
    data: { status },
  });
}

// ── Facilities ───────────────────────────────────────

export async function getAllFacilities() {
  return prisma.facility.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function createFacility(data: Prisma.FacilityCreateInput) {
  return prisma.facility.create({ data });
}

export async function updateFacility(id: string, data: Prisma.FacilityUpdateInput) {
  return prisma.facility.update({ where: { id }, data });
}

export async function deleteFacility(id: string) {
  return prisma.facility.delete({ where: { id } });
}

// ── Gallery ──────────────────────────────────────────

export async function getAllGallery() {
  return prisma.gallery.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function createGallery(data: Prisma.GalleryCreateInput) {
  return prisma.gallery.create({ data });
}

export async function updateGallery(id: string, data: Prisma.GalleryUpdateInput) {
  return prisma.gallery.update({ where: { id }, data });
}

export async function deleteGallery(id: string) {
  return prisma.gallery.delete({ where: { id } });
}

// ── FAQ ──────────────────────────────────────────────

export async function getAllFaq() {
  return prisma.faq.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function createFaq(data: Prisma.FaqCreateInput) {
  return prisma.faq.create({ data });
}

export async function updateFaq(id: string, data: Prisma.FaqUpdateInput) {
  return prisma.faq.update({ where: { id }, data });
}

export async function deleteFaq(id: string) {
  return prisma.faq.delete({ where: { id } });
}

// ── Rules ────────────────────────────────────────────

export async function getAllRules() {
  return prisma.rule.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function createRule(data: Prisma.RuleCreateInput) {
  return prisma.rule.create({ data });
}

export async function updateRule(id: string, data: Prisma.RuleUpdateInput) {
  return prisma.rule.update({ where: { id }, data });
}

export async function deleteRule(id: string) {
  return prisma.rule.delete({ where: { id } });
}

// ── Testimonials ─────────────────────────────────────

export async function getAllTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createTestimonial(data: Prisma.TestimonialCreateInput) {
  return prisma.testimonial.create({ data });
}

export async function updateTestimonial(id: string, data: Prisma.TestimonialUpdateInput) {
  return prisma.testimonial.update({ where: { id }, data });
}

export async function deleteTestimonial(id: string) {
  return prisma.testimonial.delete({ where: { id } });
}

// ── Contact Messages ─────────────────────────────────

export async function getAllMessages(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: Prisma.ContactMessageWhereInput = {};
  if (params?.status && params.status !== 'all') {
    where.status = params.status as 'UNREAD' | 'READ' | 'REPLIED';
  }

  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.contactMessage.count({ where }),
  ]);

  return { messages, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getMessageById(id: string) {
  return prisma.contactMessage.findUnique({ where: { id } });
}

export async function updateMessageStatus(
  id: string,
  status: 'UNREAD' | 'READ' | 'REPLIED'
) {
  return prisma.contactMessage.update({ where: { id }, data: { status } });
}

export async function deleteMessage(id: string) {
  return prisma.contactMessage.delete({ where: { id } });
}

// ── Site Settings ────────────────────────────────────

export async function getAllSettings() {
  return prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });
}

export async function getSettingsByGroup(group: string) {
  return prisma.siteSetting.findMany({
    where: { group },
    orderBy: { key: 'asc' },
  });
}

export async function getSetting(key: string) {
  const setting = await prisma.siteSetting.findUnique({ where: { key } });
  return setting?.value ?? null;
}

export async function getSettingsMap() {
  const settings = await prisma.siteSetting.findMany();
  return settings.reduce(
    (acc, s) => {
      acc[s.key] = s.value;
      return acc;
    },
    {} as Record<string, string>
  );
}

export async function upsertSetting(key: string, value: string, group = 'general') {
  return prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value, group },
  });
}
