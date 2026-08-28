import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Wifi, Car, Sparkles, Bath } from 'lucide-react';

import { PageHeader } from '@/components/PageHeader';
import { CTASection } from '@/components/CTASection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Tentang Harmony Home',
  description:
    'Harmony Home adalah kost eksklusif yang dirancang untuk memberikan pengalaman hunian nyaman, aman, dan praktis di Makassar.',
};

const values = [
  {
    icon: ShieldCheck,
    title: 'Keamanan',
    description:
      'Sistem keamanan 24 jam dengan CCTV dan petugas keamanan untuk ketenangan penghuni.',
  },
  {
    icon: Wifi,
    title: 'Konektivitas',
    description:
      'WiFi berkecepatan tinggi di seluruh area untuk mendukung produktivitas harian.',
  },
  {
    icon: Bath,
    title: 'Privasi',
    description:
      'Kamar mandi dalam untuk tipe Premium dan Executive, memberikan privasi penuh.',
  },
  {
    icon: Car,
    title: 'Kemudahan',
    description: 'Area parkir aman dan akses mudah ke berbagai fasilitas kota.',
  },
  {
    icon: Sparkles,
    title: 'Kebersihan',
    description:
      'Lingkungan yang terjaga kebersihannya dengan cleaning service untuk tipe Executive.',
  },
];

export default function TentangPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tentang Kami"
        title="Tentang Harmony Home"
        description="Hunian eksklusif yang dirancang untuk memberikan kenyamanan, privasi, dan fasilitas yang mendukung aktivitas sehari-hari."
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl container-px">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60">
              <Image
                src="https://images.pexels.com/photos/27953061/pexels-photo-27953061.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Eksterior Harmony Home"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-balance">
                Hunian Eksklusif untuk Gaya Hidup Modern
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Harmony Home hadir sebagai hunian eksklusif bagi kamu yang
                  menginginkan kenyamanan, privasi, dan fasilitas yang mendukung
                  aktivitas sehari-hari. Setiap ruang dirancang dengan
                  memperhatikan kenyamanan penghuni dan kemudahan dalam
                  menjalani aktivitas.
                </p>
                <p>
                  Dengan lokasi yang strategis di Makassar, Harmony Home
                  menghadirkan pengalaman hunian premium dengan fasilitas
                  lengkap, lingkungan yang aman, dan pengelolaan yang
                  profesional. Kami percaya bahwa tempat tinggal yang baik
                  mendukung kualitas hidup yang lebih baik.
                </p>
              </div>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/kamar">
                    Lihat Pilihan Kamar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl container-px">
          <h2 className="text-center font-serif text-3xl font-semibold tracking-tight">
            Nilai yang Kami Utamakan
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <Card key={v.title} className="border-border/60">
                  <CardContent className="p-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-4 font-semibold">{v.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {v.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
