import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/PageHeader';
import { RoomCard } from '@/components/RoomCard';
import { CTASection } from '@/components/CTASection';
import { getPublicRooms } from '@/lib/db/public';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pilihan Kamar',
  description:
    'Tiga tipe kamar eksklusif di Harmony Home: Standard, Premium, dan Executive dengan fasilitas lengkap.',
};

export default async function KamarPage() {
  const dbRooms = await getPublicRooms();

  const rooms = dbRooms.map((r) => ({
    id: parseInt(r.id.slice(-8), 16) || 0,
    slug: r.slug,
    name: r.name,
    type: r.type,
    price: r.price,
    priceLabel: r.priceLabel || `Rp${r.price.toLocaleString('id-ID')} / bulan`,
    size: r.size,
    capacity: r.capacity,
    status: r.status as 'available' | 'limited' | 'full',
    availableCount: r.availableCount,
    totalCount: r.totalCount,
    shortDescription: r.shortDescription,
    description: r.description,
    facilities: r.facilities,
    rules: r.rules,
    paymentInfo: r.paymentInfo,
    images: r.images,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Pilihan Kamar"
        title="Pilih Kamar yang Sesuai"
        description="Tiga tipe kamar eksklusif dengan fasilitas berbeda, dirancang untuk berbagai kebutuhan dan anggaran."
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl container-px">
          {rooms.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard key={room.slug} room={room} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Belum ada kamar yang tersedia.
            </p>
          )}
        </div>
      </section>

      <CTASection
        title="Tertarik dengan Salah Satu Kamar?"
        description="Ajukan booking sekarang dan jadilah bagian dari Harmony Home."
        primaryLabel="Booking Sekarang"
        secondaryLabel="Lihat Fasilitas"
        secondaryHref="/fasilitas"
      />
    </>
  );
}
