import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { requireAdminSession } from '@/lib/auth/session';
import {
  createMonthlyPaymentIfMissing,
  getMonthlyPayments,
  isBillableBooking,
  markMonthlyPaymentAsPaid,
  serializePayment,
} from '@/lib/db/monthly-payments';
import {
  businessDateString,
  getMonthlyAmount,
  isValidCalendarDate,
} from '@/lib/payment-dates';

const dateOnlySchema = z
  .string()
  .refine(isValidCalendarDate, { message: 'Tanggal pembayaran tidak valid.' });

const recordPaymentSchema = z.object({
  bookingId: z.string().min(1, 'Penyewa harus dipilih.'),
  periodYear: z.number().int().min(2000).max(2100, 'Tahun periode tidak valid.'),
  periodMonth: z.number().int().min(1).max(12, 'Bulan periode tidak valid.'),
  amount: z.number().int().positive('Nominal harus lebih dari 0.'),
  paidAt: dateOnlySchema,
  paymentMethod: z.enum(['CASH', 'TRANSFER', 'QRIS', 'OTHER'], {
    errorMap: () => ({ message: 'Metode pembayaran tidak valid.' }),
  }),
  notes: z.string().max(500).optional().nullable(),
});

export async function GET(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');

    const result = await getMonthlyPayments({
      year: year ? parseInt(year, 10) : undefined,
      month: month ? parseInt(month, 10) : undefined,
      status: searchParams.get('status') ?? undefined,
      roomId: searchParams.get('roomId') ?? undefined,
      bookingId: searchParams.get('bookingId') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });

    return NextResponse.json({
      data: result.payments.map((payment) => ({
        ...serializePayment(payment),
        booking: {
          id: payment.booking.id,
          bookingCode: payment.booking.bookingCode,
          name: payment.booking.name,
          phone: payment.booking.phone,
          roomName: payment.booking.room.name,
        },
      })),
      meta: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error('List monthly payments error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pembayaran.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const parsed = recordPaymentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Validasi gagal.', details: parsed.error.errors },
        { status: 400 }
      );
    }
    const validated = parsed.data;

    const booking = await prisma.booking.findUnique({ where: { id: validated.bookingId } });
    if (!booking) {
      return NextResponse.json({ error: 'Penyewa tidak ditemukan.' }, { status: 404 });
    }
    if (!isBillableBooking(booking)) {
      return NextResponse.json(
        { error: 'Booking tidak aktif sehingga tidak dapat dicatat pembayarannya.' },
        { status: 400 }
      );
    }

    // The amount always comes from the stored contract, never from the client.
    const expectedAmount = getMonthlyAmount(booking);
    if (validated.amount !== expectedAmount) {
      return NextResponse.json(
        {
          error: `Nominal tidak sesuai dengan tarif sewa (Rp${expectedAmount.toLocaleString('id-ID')}).`,
        },
        { status: 400 }
      );
    }

    const created = await createMonthlyPaymentIfMissing(
      booking,
      validated.periodYear,
      validated.periodMonth,
      businessDateString()
    );
    if (!created.ok) {
      return NextResponse.json({ error: created.error }, { status: 400 });
    }

    if (created.payment.paidAt) {
      return NextResponse.json(
        { error: 'Tagihan periode ini sudah dibayar.' },
        { status: 409 }
      );
    }

    const updated = await markMonthlyPaymentAsPaid(created.payment.id, {
      paidAt: validated.paidAt,
      paymentMethod: validated.paymentMethod,
      notes: validated.notes ?? null,
    });

    return NextResponse.json({ data: updated ? serializePayment(updated) : null });
  } catch (error) {
    console.error('Record monthly payment error:', error);
    return NextResponse.json(
      { error: 'Gagal mencatat pembayaran.' },
      { status: 500 }
    );
  }
}
