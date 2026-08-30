import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const roomUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  type: z.string().optional(),
  description: z.string().min(1).optional(),
  shortDescription: z.string().min(1).optional(),
  price: z.number().positive().optional(),
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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = roomUpdateSchema.parse(body);

    if (validated.slug) {
      const existing = await prisma.room.findFirst({
        where: { slug: validated.slug, NOT: { id: params.id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: 'Slug sudah digunakan.' },
          { status: 400 }
        );
      }
    }

    const room = await prisma.room.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json({ data: room });
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
    console.error('Update room error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui kamar.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.room.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Data tidak ditemukan.' },
        { status: 404 }
      );
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Kamar tidak dapat dihapus karena masih memiliki data booking.' },
        { status: 409 }
      );
    }
    console.error('Delete room error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus kamar.' },
      { status: 500 }
    );
  }
}
