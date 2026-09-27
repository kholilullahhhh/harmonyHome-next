import { notFound } from 'next/navigation';
import { getTenantDetail } from '@/lib/db/monthly-payments';
import { PenyewaDetailPage } from '@/components/admin/PenyewaDetailPage';

export const dynamic = 'force-dynamic';

export default async function PenyewaDetail({ params }: { params: { id: string } }) {
  const detail = await getTenantDetail(params.id);

  if (!detail) notFound();

  const { booking, ...rest } = detail;

  return (
    <PenyewaDetailPage
      data={{
        ...rest,
        booking: {
          id: booking.id,
          bookingCode: booking.bookingCode,
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          identityNumber: booking.identityNumber,
          address: booking.address,
          startDate: booking.startDate.toISOString(),
          duration: booking.duration,
          durationUnit: booking.durationUnit,
          totalPrice: booking.totalPrice,
          status: booking.status,
          notes: booking.notes,
          paymentDueDay: booking.paymentDueDay,
          userId: booking.userId,
          room: {
            id: booking.room.id,
            name: booking.room.name,
            price: booking.room.price,
            slug: booking.room.slug,
          },
          user: booking.user ? { id: booking.user.id, email: booking.user.email } : null,
        },
      }}
    />
  );
}
