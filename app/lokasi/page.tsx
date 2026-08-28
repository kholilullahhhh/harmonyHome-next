import type { Metadata } from 'next';

import { PageHeader } from '@/components/PageHeader';
import { LocationSection } from '@/components/LocationSection';
import { CTASection } from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Lokasi',
  description:
    'Lokasi strategis Harmony Home di Makassar, dekat dengan kampus, minimarket, rumah sakit, dan pusat kota.',
};

export default function LokasiPage() {
  return (
    <>
      <PageHeader
        eyebrow="Lokasi"
        title="Lokasi Strategis"
        description="Harmony Home berada di lokasi yang mudah dijangkau, dekat dengan berbagai fasilitas penting di Makassar."
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl container-px">
          <LocationSection />
        </div>
      </section>

      <CTASection
        title="Jadwalkan Survey Lokasi"
        description="Hubungi pengelola untuk mengunjungi Harmony Home dan melihat langsung kenyamanan yang kami tawarkan."
        primaryLabel="Booking Kamar"
        secondaryLabel="Hubungi Kami"
        secondaryHref="/kontak"
      />
    </>
  );
}
