import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Wifi, Car } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/SectionHeading';

const points = [
  {
    icon: ShieldCheck,
    title: 'Aman & Terkontrol',
    description: 'Keamanan 24 jam dengan CCTV dan akses terkontrol.',
  },
  {
    icon: Wifi,
    title: 'Terhubung & Produktif',
    description: 'WiFi berkecepatan tinggi untuk bekerja dan belajar.',
  },
  {
    icon: Car,
    title: 'Parkir Aman',
    description: 'Area parkir luas untuk kendaraan seluruh penghuni.',
  },
];

export function AboutSection() {
  return (
    <section id="tentang" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl container-px">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60">
              <Image
                src="https://images.pexels.com/photos/12196310/pexels-photo-12196310.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Interior ruang bersama Harmony Home"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden rounded-xl border bg-card p-5 shadow-lg sm:block lg:-right-6">
              <p className="font-serif text-3xl font-semibold text-primary">20+</p>
              <p className="text-sm text-muted-foreground">Kamar Eksklusif</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <SectionHeading
              eyebrow="Tentang Harmony Home"
              title="Hunian Eksklusif yang Dirancang untuk Kenyamanan"
              description="Harmony Home hadir sebagai hunian eksklusif bagi kamu yang menginginkan kenyamanan, privasi, dan fasilitas yang mendukung aktivitas sehari-hari. Setiap ruang dirancang dengan memperhatikan kenyamanan penghuni dan kemudahan dalam menjalani aktivitas."
              align="left"
            />
            <div className="mt-8 space-y-4">
              {points.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-medium">{p.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8">
              <Button asChild variant="outline">
                <Link href="/tentang">
                  Kenali Harmony Home
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
