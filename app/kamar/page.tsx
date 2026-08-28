import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/PageHeader';
import { RoomCard } from '@/components/RoomCard';
import { CTASection } from '@/components/CTASection';
import { rooms } from '@/lib/data/rooms';

export const metadata: Metadata = {
  title: 'Pilihan Kamar',
  description:
    'Tiga tipe kamar eksklusif di Harmony Home: Standard, Premium, dan Executive dengan fasilitas lengkap.',
};

export default function KamarPage() {
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
                <RoomCard key={room.id} room={room} />
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
