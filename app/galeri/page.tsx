import type { Metadata } from 'next';

import { PageHeader } from '@/components/PageHeader';
import { Gallery } from '@/components/Gallery';
import { CTASection } from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Galeri',
  description:
    'Galeri foto Harmony Home: eksterior, kamar, kamar mandi, ruang bersama, dapur, dan area parkir.',
};

export default function GaleriPage() {
  return (
    <>
      <PageHeader
        eyebrow="Galeri"
        title="Galeri Harmony Home"
        description="Jelajahi suasana Harmony Home melalui koleksi foto kamar, ruang bersama, dan area properti."
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl container-px">
          <Gallery />
        </div>
      </section>

      <CTASection />
    </>
  );
}
