import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/data/rooms';

const highlights = [
  'Kamar Eksklusif',
  'Fasilitas Lengkap',
  'Lingkungan Nyaman',
  'Lokasi Strategis',
];

export function Hero() {
  return (
    <section className="relative -mt-16 lg:-mt-20 min-h-[100svh] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.pexels.com/photos/30580640/pexels-photo-30580640.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Harmony Home — kost eksklusif"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 pt-16 text-center sm:px-8 lg:px-12 lg:pt-20">
        <div className="max-w-3xl animate-fade-up">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/90 backdrop-blur">
            {siteConfig.tagline}
          </span>
          <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
            Temukan Hunian Nyaman
            <br />
            di Harmony Home
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80 text-balance sm:text-lg">
            {siteConfig.description}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="min-w-[180px]">
              <Link href="/booking">
                Booking Kamar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-w-[180px] border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/kamar">Lihat Kamar</Link>
            </Button>
          </div>

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {highlights.map((h) => (
              <li
                key={h}
                className="flex items-center gap-1.5 text-sm text-white/85"
              >
                <Check className="h-4 w-4 text-emerald-400" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
