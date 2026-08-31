import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/SectionHeading';
import { bookingSteps } from '@/lib/data/site-content';
import { Reveal } from '@/components/motion/Reveal';

export function BookingStepsSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl container-px">
        <Reveal>
          <SectionHeading
            eyebrow="Cara Booking"
            title="Booking Kamar dengan Mudah"
            description="Empat langkah sederhana untuk menjadi bagian dari Harmony Home."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bookingSteps.map((step, i) => (
            <Reveal key={step.id} delay={i * 100}>
              <div className="relative">
                <div className="rounded-xl border border-border/60 bg-card p-6">
                  <span className="font-serif text-3xl font-semibold text-primary">
                    {step.step}
                  </span>
                  <h3 className="mt-3 font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {i < bookingSteps.length - 1 && (
                  <span
                    className="absolute -right-3 top-1/2 hidden h-px w-6 bg-border lg:block"
                    aria-hidden
                  />
                )}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={400}>
          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <Link href="/booking">
                Booking Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
