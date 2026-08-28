import { Star, Quote } from 'lucide-react';

import { SectionHeading } from '@/components/SectionHeading';
import { Card, CardContent } from '@/components/ui/card';
import { testimonials } from '@/lib/data/testimonials';

export function TestimonialsSection() {
  return (
    <section className="bg-secondary/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl container-px">
        <SectionHeading
          eyebrow="Testimoni"
          title="Apa Kata Penghuni Harmony Home"
          description="Kepercayaan penghuni adalah prioritas kami. Inilah pengalaman mereka."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <Card
              key={t.id}
              className="flex flex-col border-border/60 transition-all duration-300 hover:shadow-md"
            >
              <CardContent className="flex flex-1 flex-col p-6">
                <Quote className="h-7 w-7 text-primary/30" />
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <div className="mt-3 border-t pt-3">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
