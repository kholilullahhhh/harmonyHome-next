import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import type { Prisma } from '@prisma/client';
import { requireAdminSession } from '@/lib/auth/session';
import {
  isBillableBooking,
  serializePayment,
} from '@/lib/db/monthly-payments';
import {
  businessDateString,
  calculatePaymentStatus,
  getMonthlyAmount,
  isValidCalendarDate,
  toDateString,
} from '@/lib/payment-dates';

const updatePaymentSchema = z.object({
  status: z
    .enum(['PAID', 'UNPAID'], {
      errorMap: () => ({ message: 'Status pembayaran tidak valid.' }),
    })
    .optional(),
  paidAt: z
    .string()
    .refine(isValidCalendarDate, { message: 'Tanggal pembayaran tidak valid.' })
    .optional(),
  paymentMethod: z
    .enum(['CASH', 'TRANSFER', 'QRIS', 'OTHER'], {
      errorMap: () => ({ message: 'Metode pembayaran tidak valid.' }),
    })
    .optional(),
  notes: z.string().max(500).nullable().optional(),
  amount: z.number().int().positive('Nominal harus lebih dari 0.').optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 });
  }

  try {
    const payment = await prisma.monthlyPayment.findUnique({
      where: { id: params.id },
      include: { booking: { include: { room: true, user: true } } },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Pembayaran tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        ...serializePayment(payment),
        booking: {
          id: payment.booking.id,
          bookingCode: payment.booking.bookingCode,
          name: payment.booking.name,
          phone: payment.booking.phone,
          roomName: payment.booking.room.name,
        },
      },
    });
  } catch (error) {
    console.error('Get monthly payment error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pembayaran.' },
      { status: 500 }
    );
  }
}

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

    const parsed = updatePaymentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.errors[0]?.message ?? 'Validasi gagal.',
          details: parsed.error.errors,
        },
        { status: 400 }
      );
    }
    const validated = parsed.data;

    const payment = await prisma.monthlyPayment.findUnique({
      where: { id: params.id },
      include: { booking: true },
    });
    if (!payment) {
      return NextResponse.json(
        { error: 'Pembayaran tidak ditemukan.' },
        { status: 404 }
      );
    }

    const expectedAmount = getMonthlyAmount(payment.booking);
    if (validated.amount !== undefined && validated.amount !== expectedAmount) {
      return NextResponse.json(
        {
          error: `Nominal tidak sesuai dengan tarif sewa (Rp${expectedAmount.toLocaleString('id-ID')}).`,
        },
        { status: 400 }
      );
    }

    const today = businessDateString();
    const targetStatus =
      validated.status ?? (payment.paidAt ? 'PAID' : 'UNPAID');

    if (targetStatus === 'PAID' && !isBillableBooking(payment.booking)) {
      return NextResponse.json(
        { error: 'Booking tidak aktif sehingga tidak dapat dicatat pembayarannya.' },
        { status: 400 }
      );
    }

    const data: Prisma.MonthlyPaymentUpdateInput = {};

    if (targetStatus === 'PAID') {
      const paidAt =
        validated.paidAt ??
        (payment.paidAt ? toDateString(payment.paidAt) : today);
      const method = validated.paymentMethod ?? payment.paymentMethod;
      if (!method) {
        return NextResponse.json(
          { error: 'Metode pembayaran wajib diisi.' },
          { status: 400 }
        );
      }
      data.status = 'PAID';
      data.paidAt = new Date(
        Date.UTC(
          Number(paidAt.slice(0, 4)),
          Number(paidAt.slice(5, 7)) - 1,
          Number(paidAt.slice(8, 10)),
          12
        )
      );
      data.paymentMethod = method;
      // Nominal selalu mengikuti kontrak booking, bukan input client.
      data.amount = expectedAmount;
    } else {
      // Deliberate reversal: recompute the stored status from the due date.
      data.status = calculatePaymentStatus({
        paidAt: null,
        dueDate: toDateString(payment.dueDate),
        today,
      });
      data.paidAt = null;
    }

    if (validated.notes !== undefined) {
      data.notes = validated.notes;
    }

    const updated = await prisma.monthlyPayment.update({
      where: { id: payment.id },
      data,
    });

    return NextResponse.json({ data: serializePayment(updated) });
  } catch (error) {
    console.error('Update monthly payment error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui pembayaran.' },
      { status: 500 }
    );
  }
}
