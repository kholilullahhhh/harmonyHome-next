import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  content: z.string().min(1),
  rating: z.number().int().min(1).max(5).optional(),
  avatar: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = testimonialSchema.parse(body);

    const testimonial = await prisma.testimonial.create({
      data: {
        name: validated.name,
        role: validated.role ?? '',
        content: validated.content,
        rating: validated.rating ?? 5,
        avatar: validated.avatar ?? '',
        isPublished: validated.isPublished ?? true,
      },
    });

    return NextResponse.json({ data: testimonial }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Create testimonial error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat testimoni.' },
      { status: 500 }
    );
  }
}
