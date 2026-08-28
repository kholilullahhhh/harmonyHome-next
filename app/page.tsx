import { Hero } from '@/components/Hero';
import { QuickInfo } from '@/components/QuickInfo';
import { AboutSection } from '@/components/AboutSection';
import { SectionHeading } from '@/components/SectionHeading';
import { RoomCard } from '@/components/RoomCard';
import { FacilityCard } from '@/components/FacilityCard';
import { Gallery } from '@/components/Gallery';
import { LocationSection } from '@/components/LocationSection';
import { AdvantagesSection } from '@/components/AdvantagesSection';
import { BookingStepsSection } from '@/components/BookingStepsSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { FAQAccordion } from '@/components/FAQAccordion';
import { CTASection } from '@/components/CTASection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { rooms } from '@/lib/data/rooms';
import { facilities } from '@/lib/data/facilities';

export default function Home() {
  return (
    <>
      <Hero />
      <QuickInfo />
      <AboutSection />

      {/* Tipe Kamar */}
      <section id="kamar" className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl container-px">
          <SectionHeading
            eyebrow="Pilihan Kamar"
            title="Pilih Kamar yang Sesuai"
            description="Tiga tipe kamar eksklusif dengan fasilitas berbeda, dirancang untuk berbagai kebutuhan dan anggaran."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </section>

      {/* Fasilitas */}
      <section id="fasilitas" className="bg-secondary/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl container-px">
          <SectionHeading
            eyebrow="Fasilitas"
            title="Fasilitas Harmony Home"
            description="Segala kebutuhan utama tersedia dalam satu tempat untuk mendukung kenyamanan harianmu."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((f) => (
              <FacilityCard key={f.id} facility={f} />
            ))}
          </div>
        </div>
      </section>

      {/* Galeri */}
      <section id="galeri" className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl container-px">
          <SectionHeading
            eyebrow="Galeri"
            title="Intip Suasana Harmony Home"
            description="Lihat langsung suasana kamar, ruang bersama, dan area properti Harmony Home."
          />
          <div className="mt-8">
            <Gallery limit={6} />
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/galeri">
                Lihat Semua
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Lokasi */}
      <section id="lokasi" className="bg-secondary/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl container-px">
          <SectionHeading
            eyebrow="Lokasi"
            title="Lokasi Strategis"
            description="Berada di lokasi yang mudah dijangkau, dekat dengan berbagai fasilitas penting."
          />
          <div className="mt-12">
            <LocationSection />
          </div>
        </div>
      </section>

      <AdvantagesSection />

      <BookingStepsSection />

      <TestimonialsSection />

      {/* FAQ */}
      <section id="faq" className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl container-px">
          <SectionHeading
            eyebrow="FAQ"
            title="Pertanyaan yang Sering Diajukan"
            description="Temukan jawaban atas pertanyaan umum seputar Harmony Home."
          />
          <div className="mt-10">
            <FAQAccordion />
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
