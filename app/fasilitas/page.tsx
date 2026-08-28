import type { Metadata } from 'next';

import { PageHeader } from '@/components/PageHeader';
import { FacilityCard } from '@/components/FacilityCard';
import { CTASection } from '@/components/CTASection';
import { facilities } from '@/lib/data/facilities';

export const metadata: Metadata = {
  title: 'Fasilitas',
  description:
    'Fasilitas lengkap di Harmony Home: WiFi, AC, kamar mandi dalam, CCTV, parkir, laundry, dapur bersama, dan lebih banyak lagi.',
};

export default function FasilitasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Fasilitas"
        title="Fasilitas Harmony Home"
        description="Segala kebutuhan utama tersedia dalam satu tempat untuk mendukung kenyamanan dan produktivitas harianmu."
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl container-px">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((f) => (
              <FacilityCard key={f.id} facility={f} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Rasakan Fasilitas Harmony Home Sendiri"
        description="Ajukan booking dan nikmati seluruh fasilitas eksklusif yang kami sediakan."
        secondaryLabel="Lihat Kamar"
        secondaryHref="/kamar"
      />
    </>
  );
}
