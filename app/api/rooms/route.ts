import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
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
        thumbnail: true,
      },
    });

    return NextResponse.json({ data: rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kamar.' },
      { status: 500 }
    );
  }
}
