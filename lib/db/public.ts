import { prisma } from '@/lib/db/prisma';

export async function getPublicRooms() {
  const rooms = await prisma.room.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      slug: true,
      name: true,
      type: true,
      price: true,
      priceLabel: true,
      size: true,
      capacity: true,
      status: true,
      availableCount: true,
      totalCount: true,
      shortDescription: true,
      description: true,
      facilities: true,
      rules: true,
      paymentInfo: true,
      images: true,
    },
  });

  return rooms.map((r) => ({
    ...r,
    facilities: r.facilities as string[],
    rules: r.rules as string[],
    paymentInfo: r.paymentInfo as string[],
    images: r.images as string[],
    // Map DB status to frontend status
    status: mapRoomStatus(r.status, r.availableCount, r.totalCount),
  }));
}

export async function getPublicRoomBySlug(slug: string) {
  const room = await prisma.room.findUnique({
    where: { slug },
  });

  if (!room) return null;

  return {
    ...room,
    facilities: room.facilities as string[],
    rules: room.rules as string[],
    paymentInfo: room.paymentInfo as string[],
    images: room.images as string[],
    status: mapRoomStatus(room.status, room.availableCount, room.totalCount),
  };
}

function mapRoomStatus(
  dbStatus: string,
  availableCount: number,
  totalCount: number
): 'available' | 'limited' | 'full' {
  if (dbStatus === 'MAINTENANCE') return 'full';
  if (dbStatus === 'OCCUPIED') return 'full';
  if (availableCount <= 0) return 'full';
  if (availableCount <= 2) return 'limited';
  return 'available';
}

export async function getPublicFacilities() {
  const facilities = await prisma.facility.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  });

  return facilities.map((f) => ({
    id: f.id,
    name: f.name,
    description: f.description,
    icon: f.icon,
  }));
}

export async function getPublicGallery() {
  const images = await prisma.gallery.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  });

  return images.map((g) => ({
    id: parseInt(g.id.slice(-8), 16) || 0,
    src: g.imageUrl,
    alt: g.title,
    category: g.category,
    categoryLabel: getCategoryLabel(g.category),
  }));
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    exterior: 'Eksterior',
    room: 'Kamar',
    bathroom: 'Kamar Mandi',
    'common-area': 'Ruang Bersama',
    kitchen: 'Dapur',
    parking: 'Area Parkir',
  };
  return labels[category] ?? category;
}

export async function getPublicFaq() {
  const items = await prisma.faq.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  });

  return items.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }));
}

export async function getPublicRules() {
  const rules = await prisma.rule.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  });

  return rules.map((r) => ({
    id: parseInt(r.id.slice(-8), 16) || 0,
    title: r.title,
    icon: r.icon,
    items: r.items as string[],
  }));
}

export async function getPublicTestimonials() {
  const items = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
  });

  return items.map((t) => ({
    id: parseInt(t.id.slice(-8), 16) || 0,
    name: t.name,
    role: t.role,
    rating: t.rating,
    quote: t.content,
  }));
}

export async function getSiteSettings() {
  const settings = await prisma.siteSetting.findMany();
  return settings.reduce(
    (acc, s) => {
      acc[s.key] = s.value;
      return acc;
    },
    {} as Record<string, string>
  );
}
