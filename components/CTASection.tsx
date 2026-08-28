import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTASection({
  title = 'Siap Menjadi Bagian dari Harmony Home?',
  description = 'Ajukan booking sekarang dan rasakan hunian nyaman dengan fasilitas lengkap di Harmony Home.',
  primaryLabel = 'Booking Sekarang',
  primaryHref = '/booking',
  secondaryLabel = 'Lihat Kamar',
  secondaryHref = '/kamar',
}: CTASectionProps) {
  return (
    <section className="bg-primary py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8 lg:px-12">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-primary-foreground text-balance sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-primary-foreground/80 text-balance">
          {description}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="min-w-[180px]"
          >
            <Link href={primaryHref}>
              {primaryLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="min-w-[180px] border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
