import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';

const statusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'], {
    errorMap: () => ({ message: 'Status booking tidak valid.' }),
  }),
});

async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }
  return session;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { error: 'Tidak terautentikasi.' },
      { status: 401 }
    );
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { room: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data booking.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { error: 'Tidak terautentikasi.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const validated = statusSchema.parse(body);

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking tidak ditemukan.' },
        { status: 404 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: { status: validated.status },
      include: { room: { select: { name: true } } },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Data tidak ditemukan.' },
        { status: 404 }
      );
    }
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui booking.' },
      { status: 500 }
    );
  }
}