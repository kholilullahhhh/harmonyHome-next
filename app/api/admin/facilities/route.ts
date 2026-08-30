import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const facilitySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  category: z.string().optional(),
  sortOrder: z.number().min(0).optional(),
  isPublished: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = facilitySchema.parse(body);

    const facility = await prisma.facility.create({
      data: {
        name: validated.name,
        description: validated.description ?? '',
        icon: validated.icon ?? 'Star',
        image: validated.image ?? '',
        category: validated.category ?? 'umum',
        sortOrder: validated.sortOrder ?? 0,
        isPublished: validated.isPublished ?? true,
      },
    });

    return NextResponse.json({ data: facility }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Create facility error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat fasilitas.' },
      { status: 500 }
    );
  }
}
