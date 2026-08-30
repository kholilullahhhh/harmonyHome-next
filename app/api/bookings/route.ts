import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const bookingSchema = z.object({
  roomId: z.string().min(1, 'Kamar harus dipilih'),
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(8, 'Nomor HP tidak valid'),
  identityNumber: z.string().optional(),
  address: z.string().optional(),
  startDate: z.string().min(1, 'Tanggal masuk wajib diisi'),
  duration: z.number().int().min(1, 'Durasi minimal 1 bulan').max(120, 'Durasi maksimal 120 bulan'),
  notes: z.string().optional(),
});

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function startOfDay(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function generateBookingCode(year: number, sequence: number): string {
  return `HH-${year}-${String(sequence).padStart(4, '0')}`;
}

export async function POST(request: Request) {
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

    let validated: z.infer<typeof bookingSchema>;
    try {
      validated = bookingSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validasi gagal', details: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }

    const startDate = new Date(`${validated.startDate}T00:00:00Z`);

    if (isNaN(startDate.getTime())) {
      return NextResponse.json(
        { error: 'Tanggal masuk tidak valid.' },
        { status: 400 }
      );
    }

    const today = startOfDay();
    if (startDate < today) {
      return NextResponse.json(
        { error: 'Tanggal masuk tidak boleh di masa lalu.' },
        { status: 400 }
      );
    }

    const endDate = addMonths(startDate, validated.duration);

    // Serialisable transaction: guards the overlap check AND the
    // booking-code sequence against concurrent double-bookings.
    const result = await prisma.$transaction(
      async (tx) => {
        const room = await tx.room.findUnique({
          where: { id: validated.roomId },
        });

        if (!room) {
          return { kind: 'not-found' } as const;
        }

        if (room.status !== 'AVAILABLE') {
          return { kind: 'unavailable' } as const;
        }

        // Candidate bookings whose start falls before the requested end;
        // true range overlap is then resolved in JS (existing start + duration).
        const candidates = await tx.booking.findMany({
          where: {
            roomId: validated.roomId,
            status: { in: ['PENDING', 'CONFIRMED'] },
            startDate: { lt: endDate },
          },
          select: { startDate: true, duration: true },
        });

        const overlaps = candidates.some((existing) => {
          const existingEnd = addMonths(existing.startDate, existing.duration);
          return startDate < existingEnd;
        });

        if (overlaps) {
          return { kind: 'conflict' } as const;
        }

        // Next booking code from the max sequence already used this year
        // (avoids reuse/collision when old bookings are deleted).
        const currentYear = new Date().getFullYear();
        const latest = await tx.booking.findFirst({
          where: { bookingCode: { startsWith: `HH-${currentYear}-` } },
          orderBy: { bookingCode: 'desc' },
          select: { bookingCode: true },
        });

        const lastSeq = latest
          ? parseInt(latest.bookingCode.split('-')[2] || '0', 10) || 0
          : 0;

        // Calculate total price server-side
        const totalPrice = room.price * validated.duration;
        let bookingCode = generateBookingCode(currentYear, lastSeq + 1);

        let booking: Prisma.BookingGetPayload<{
          include: { room: { select: { name: true } } };
        }> | null = null;
        for (let attempt = 0; attempt < 3; attempt += 1) {
          try {
            booking = await tx.booking.create({
              data: {
                bookingCode,
                roomId: validated.roomId,
                name: validated.name,
                email: validated.email,
                phone: validated.phone,
                identityNumber: validated.identityNumber || null,
                address: validated.address || null,
                startDate,
                duration: validated.duration,
                durationUnit: 'month',
                totalPrice,
                notes: validated.notes || null,
              },
              include: { room: { select: { name: true } } },
            });
            break;
          } catch (error) {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError &&
              error.code === 'P2002' &&
              attempt < 2
            ) {
              bookingCode = generateBookingCode(currentYear, lastSeq + 2 + attempt);
              continue;
            }
            throw error;
          }
        }

        if (!booking) {
          throw new Error('Gagal membuat booking.');
        }

        return { kind: 'ok', booking } as const;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

    if (result.kind === 'not-found') {
      return NextResponse.json(
        { error: 'Kamar tidak ditemukan.' },
        { status: 404 }
      );
    }

    if (result.kind === 'unavailable') {
      return NextResponse.json(
        { error: 'Kamar tidak tersedia untuk saat ini.' },
        { status: 400 }
      );
    }

    if (result.kind === 'conflict') {
      return NextResponse.json(
        { error: 'Kamar sudah dibooking pada periode tersebut.' },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: result.booking.id,
        bookingCode: result.booking.bookingCode,
        roomName: result.booking.room.name,
        name: result.booking.name,
        duration: result.booking.duration,
        totalPrice: result.booking.totalPrice,
      },
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat booking.' },
      { status: 500 }
    );
  }
}