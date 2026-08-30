import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const testimonialUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().optional(),
  content: z.string().min(1).optional(),
  rating: z.number().min(1).max(5).optional(),
  avatar: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = testimonialUpdateSchema.parse(body);

    const testimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json({ data: testimonial });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Data tidak ditemukan.' },
        { status: 404 }
      );
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Update testimonial error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui testimoni.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.testimonial.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Data tidak ditemukan.' },
        { status: 404 }
      );
    }
    console.error('Delete testimonial error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus testimoni.' },
      { status: 500 }
    );
  }
}
