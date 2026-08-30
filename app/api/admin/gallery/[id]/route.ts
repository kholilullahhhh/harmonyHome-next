import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const galleryUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  imageUrl: z.string().min(1).optional(),
  category: z.string().optional(),
  sortOrder: z.number().min(0).optional(),
  isPublished: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = galleryUpdateSchema.parse(body);

    const gallery = await prisma.gallery.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json({ data: gallery });
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
    console.error('Update gallery error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui galeri.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.gallery.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Data tidak ditemukan.' },
        { status: 404 }
      );
    }
    console.error('Delete gallery error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus galeri.' },
      { status: 500 }
    );
  }
}
