import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { requireAdminSession } from '@/lib/auth/session';
import { getDueDay, getMonthlyAmount } from '@/lib/payment-dates';

const dueDaySchema = z.object({
  paymentDueDay: z
    .number({ required_error: 'Tanggal jatuh tempo wajib diisi.' })
    .int('Tanggal jatuh tempo harus bilangan bulat.')
    .min(1, 'Tanggal jatuh tempo minimal 1.')
    .max(31, 'Tanggal jatuh tempo maksimal 31.'),
});

export async function PATCH(
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

    const parsed = dueDaySchema.safeParse(body);
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

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { paymentDueDay: parsed.data.paymentDueDay },
    });

    return NextResponse.json({
      data: {
        id: updated.id,
        bookingCode: updated.bookingCode,
        paymentDueDay: updated.paymentDueDay,
        dueDay: getDueDay(updated),
        monthlyAmount: getMonthlyAmount(updated),
      },
      message: `Tanggal jatuh tempo diatur ke tanggal ${parsed.data.paymentDueDay} setiap bulan. Perubahan hanya berlaku untuk tagihan berikutnya yang belum dibuat; tagihan yang sudah ada tidak diubah.`,
    });
  } catch (error) {
    console.error('Update due day error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui tanggal jatuh tempo.' },
      { status: 500 }
    );
  }
}
