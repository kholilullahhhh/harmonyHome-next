import type { Metadata } from 'next';

import { PageHeader } from '@/components/PageHeader';
import { FacilityCard } from '@/components/FacilityCard';
import { CTASection } from '@/components/CTASection';
import { getPublicFacilities } from '@/lib/db/public';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Fasilitas',
  description:
    'Fasilitas lengkap di Harmony Home: WiFi, AC, kamar mandi dalam, CCTV, parkir, laundry, dapur bersama, dan lebih banyak lagi.',
};

export default async function FasilitasPage() {
  const facilities = await getPublicFacilities();

  const mapped = facilities.map((f) => ({
    id: parseInt(f.id.slice(-8), 16) || 0,
    key: f.id,
    name: f.name,
    description: f.description,
    icon: f.icon,
  }));

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
            {mapped.map((f) => (
              <FacilityCard key={f.key} facility={f} />
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
