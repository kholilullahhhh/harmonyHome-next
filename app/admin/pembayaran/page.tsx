import { getMonthlyPayments, serializePayment } from '@/lib/db/monthly-payments';
import { maybeRunPaymentReminders } from '@/lib/db/reminders';
import { getAllRooms } from '@/lib/db/queries';
import { businessDateString } from '@/lib/payment-dates';
import { MonthlyPaymentsListPage } from '@/components/admin/MonthlyPaymentsListPage';

export const dynamic = 'force-dynamic';

interface PaymentsPageProps {
  searchParams: {
    year?: string;
    month?: string;
    status?: string;
    roomId?: string;
    search?: string;
    page?: string;
  };
}

function parseIntParam(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export default async function MonthlyPaymentsPage({ searchParams }: PaymentsPageProps) {
  const [result, rooms] = await Promise.all([
    getMonthlyPayments({
      year: parseIntParam(searchParams.year),
      month: parseIntParam(searchParams.month),
      status: searchParams.status,
      roomId: searchParams.roomId,
      search: searchParams.search,
      page: parseIntParam(searchParams.page) ?? 1,
      limit: 15,
    }),
    getAllRooms(),
    // Lazy reminder run (idempotent) alongside the list query.
    maybeRunPaymentReminders(),
  ]);

  const currentYear = Number(businessDateString().slice(0, 4));
  const years = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <MonthlyPaymentsListPage
      rows={result.payments.map((payment) => ({
        ...serializePayment(payment),
        booking: {
          id: payment.booking.id,
          bookingCode: payment.booking.bookingCode,
          name: payment.booking.name,
          phone: payment.booking.phone,
          roomName: payment.booking.room.name,
        },
      }))}
      total={result.total}
      page={result.page}
      totalPages={result.totalPages}
      rooms={rooms.map((room) => ({ id: room.id, name: room.name }))}
      years={years}
      filters={{
        year: searchParams.year ?? '',
        month: searchParams.month ?? '',
        status: searchParams.status ?? '',
        roomId: searchParams.roomId ?? '',
        search: searchParams.search ?? '',
      }}
    />
  );
}
