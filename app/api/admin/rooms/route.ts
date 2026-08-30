import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const roomSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  type: z.string().optional(),
  description: z.string().min(1),
  shortDescription: z.string().min(1),
  price: z.number().positive(),
  priceLabel: z.string().optional(),
  capacity: z.number().positive().optional(),
  size: z.string().optional(),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']).optional(),
  availableCount: z.number().min(0).optional(),
  totalCount: z.number().min(0).optional(),
  facilities: z.array(z.string()).optional(),
  rules: z.array(z.string()).optional(),
  paymentInfo: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = roomSchema.parse(body);

    const existing = await prisma.room.findUnique({
      where: { slug: validated.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Slug sudah digunakan.' },
        { status: 400 }
      );
    }

    const room = await prisma.room.create({
      data: {
        ...validated,
        facilities: validated.facilities ?? [],
        rules: validated.rules ?? [],
        paymentInfo: validated.paymentInfo ?? [],
        images: validated.images ?? [],
      },
    });

    return NextResponse.json({ data: room }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Create room error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat kamar.' },
      { status: 500 }
    );
  }
}
