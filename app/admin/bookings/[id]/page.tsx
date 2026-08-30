import { getBookingById } from '@/lib/db/queries';
import { notFound } from 'next/navigation';
import { BookingDetailPage } from '@/components/admin/BookingDetailPage';

export const dynamic = 'force-dynamic';

export default async function BookingDetail({
  params,
}: {
  params: { id: string };
}) {
  const booking = await getBookingById(params.id);
  if (!booking) notFound();

  const serialized = {
    ...booking,
    startDate: booking.startDate.toISOString(),
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
  };

  return <BookingDetailPage booking={serialized} />;
}
