'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/data/rooms';

const highlights = [
  "Kamar Eksklusif",
  "Fasilitas Lengkap",
  "Lingkungan Nyaman",
  "Lokasi Strategis",
];

export function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative -mt-16 lg:-mt-20 min-h-[100svh] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.pexels.com/photos/30580640/pexels-photo-30580640.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Suasana Harmony Home — kost eksklusif di Makassar"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 pt-16 text-center sm:px-8 lg:px-12 lg:pt-20">
        <div className="max-w-3xl">
          <span
            className={`inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/90 backdrop-blur transition-all duration-700 ease-out ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {siteConfig.tagline}
          </span>
          <h1
            className={`mt-6 font-serif text-4xl font-semibold leading-tight tracking-tight text-white text-balance sm:text-5xl lg:text-6xl transition-all duration-900 ease-out ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '350ms' }}
          >
            Temukan Hunian Nyaman
            <br />
            di Harmony Home
          </h1>
          <p
            className={`mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80 text-balance sm:text-lg transition-all duration-700 ease-out ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: '550ms' }}
          >
            {siteConfig.description}
          </p>

          <div
            className={`mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row transition-all duration-700 ease-out ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: '750ms' }}
          >
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

          <ul
            className={`mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 transition-all duration-700 ease-out ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '900ms' }}
          >
            {highlights.map((h) => (
              <li
                key={h}
                className="flex items-center gap-1.5 text-sm !text-white"
              >
                <Check className="h-4 w-4 !text-emerald-400" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
