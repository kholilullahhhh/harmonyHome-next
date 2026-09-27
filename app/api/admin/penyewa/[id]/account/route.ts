import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hash } from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { requireAdminSession } from '@/lib/auth/session';

const accountSchema = z.object({
  email: z.string().email('Email tidak valid.').optional(),
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter.')
    .max(100, 'Password maksimal 100 karakter.'),
});

/**
 * Creates (or refreshes) the tenant account used to log in on /pembayaran
 * and links it to the booking. Admin/staff accounts are never overwritten.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 });
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Format data tidak valid.' },
        { status: 400 }
      );
    }

    const parsed = accountSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.errors[0]?.message ?? 'Validasi gagal.',
          details: parsed.error.errors,
        },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({ where: { id: params.id } });
    if (!booking) {
      return NextResponse.json({ error: 'Penyewa tidak ditemukan.' }, { status: 404 });
    }

    const email = (parsed.data.email ?? booking.email).trim().toLowerCase();
    const passwordHash = await hash(parsed.data.password, 12);

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing && existing.role !== 'PENYEWA') {
      return NextResponse.json(
        { error: 'Email sudah digunakan oleh akun admin/staff.' },
        { status: 400 }
      );
    }

    let userId: string;
    if (existing) {
      const updated = await prisma.user.update({
        where: { id: existing.id },
        data: { passwordHash, isActive: true, role: 'PENYEWA' },
      });
      userId = updated.id;
    } else {
      const created = await prisma.user.create({
        data: {
          name: booking.name,
          email,
          passwordHash,
          role: 'PENYEWA',
        },
      });
      userId = created.id;
    }

    await prisma.booking.update({
      where: { id: booking.id },
      data: { userId },
    });

    return NextResponse.json({
      data: { userId, email, bookingId: booking.id },
      message: `Akun penyewa ${email} berhasil dibuat dan ditautkan ke booking ${booking.bookingCode}.`,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email sudah digunakan oleh pengguna lain.' },
        { status: 409 }
      );
    }
    console.error('Create tenant account error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat akun penyewa.' },
      { status: 500 }
    );
  }
}
