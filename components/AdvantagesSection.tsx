import * as LucideIcons from 'lucide-react';

import { SectionHeading } from '@/components/SectionHeading';
import { advantages } from '@/lib/data/site-content';

export function AdvantagesSection() {
  return (
    <section className="bg-secondary/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl container-px">
        <SectionHeading
          eyebrow="Keunggulan"
          title="Kenapa Harmony Home?"
          description="Kami berkomitmen memberikan pengalaman hunian terbaik melalui fasilitas, keamanan, dan kenyamanan yang terjaga."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((a) => {
            const Icon =
              (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[
                a.icon
              ] ?? LucideIcons.CheckCircle2;
            return (
              <div
                key={a.id}
                className="group relative rounded-xl border border-border/60 bg-card p-6 transition-all duration-300 hover:shadow-md"
              >
                <span className="font-serif text-4xl font-semibold text-muted/60">
                  {a.number}
                </span>
                <span className="mt-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold">{a.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {a.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
