import { getAllBookings } from '@/lib/db/queries';
import { BookingsListPage } from '@/components/admin/BookingsListPage';

export const dynamic = 'force-dynamic';

interface BookingsPageProps {
  searchParams: {
    status?: string;
    search?: string;
    page?: string;
  };
}

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const result = await getAllBookings({
    status: searchParams.status,
    search: searchParams.search,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: 10,
  });

  return (
    <BookingsListPage
      bookings={result.bookings.map((b) => ({
        id: b.id,
        bookingCode: b.bookingCode,
        name: b.name,
        email: b.email,
        phone: b.phone,
        roomName: b.room.name,
        startDate: b.startDate.toISOString(),
        duration: b.duration,
        totalPrice: b.totalPrice,
        status: b.status,
        createdAt: b.createdAt.toISOString(),
      }))}
      total={result.total}
      page={result.page}
      totalPages={result.totalPages}
    />
  );
}
