import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const gallerySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().min(1),
  category: z.string().optional(),
  sortOrder: z.number().min(0).optional(),
  isPublished: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = gallerySchema.parse(body);

    const gallery = await prisma.gallery.create({
      data: {
        title: validated.title,
        description: validated.description ?? '',
        imageUrl: validated.imageUrl,
        category: validated.category ?? '',
        sortOrder: validated.sortOrder ?? 0,
        isPublished: validated.isPublished ?? true,
      },
    });

    return NextResponse.json({ data: gallery }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Create gallery error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat galeri.' },
      { status: 500 }
    );
  }
}
