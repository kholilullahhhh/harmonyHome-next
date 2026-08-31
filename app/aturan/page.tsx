import type { Metadata } from 'next';
import {
  Clock,
  Sparkles,
  ShieldCheck,
  Car,
  VolumeX,
  Sofa,
  PawPrint,
  Wallet,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';

import { PageHeader } from '@/components/PageHeader';
import { CTASection } from '@/components/CTASection';
import { Card, CardContent } from '@/components/ui/card';
import { ruleGroups } from '@/lib/data/rules';

const iconMap: Record<string, LucideIcon> = {
  Clock,
  Sparkles,
  ShieldCheck,
  Car,
  VolumeX,
  Sofa,
  PawPrint,
  Wallet,
  ScrollText,
};

export const metadata: Metadata = {
  title: 'Aturan Kost',
  description:
    'Aturan dan ketentuan tinggal di Harmony Home: jam bertamu, kebersihan, keamanan, parkir, pembayaran, dan lainnya.',
};

export default function AturanPage() {
  return (
    <>
      <PageHeader
        eyebrow="Aturan"
        title="Aturan Kost Harmony Home"
        description="Untuk menjaga kenyamanan bersama, berikut aturan yang berlaku bagi seluruh penghuni Harmony Home."
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-5xl container-px">
          <div className="grid gap-6 sm:grid-cols-2">
            {ruleGroups.map((group) => {
              const Icon = iconMap[group.icon] ?? ScrollText;
              return (
                <Card key={group.id} className="border-border/60">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="font-serif text-lg font-semibold">
                        {group.title}
                      </h3>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection
        title="Punya Pertanyaan tentang Aturan?"
        description="Hubungi pengelola kami untuk klarifikasi atau informasi lebih lanjut."
        primaryLabel="Booking Kamar"
        secondaryLabel="Hubungi Kami"
        secondaryHref="/kontak"
      />
    </>
  );
}
