import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { PageHeader } from '@/components/PageHeader';
import { FAQAccordion } from '@/components/FAQAccordion';
import { CTASection } from '@/components/CTASection';
import { Button } from '@/components/ui/button';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Pertanyaan yang sering diajukan seputar Harmony Home: harga, listrik, WiFi, kamar mandi, parkir, booking, dan pembayaran.',
};

export default function FAQPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Pertanyaan yang Sering Diajukan"
        description="Temukan jawaban atas pertanyaan umum seputar Harmony Home."
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl container-px">
          <FAQAccordion />

          <div className="mt-10 rounded-xl border bg-card p-6 text-center">
            <h3 className="font-serif text-xl font-semibold">
              Masih ada pertanyaan?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tim pengelola Harmony Home siap membantu menjawab pertanyaanmu.
            </p>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <WhatsAppButton label="Chat via WhatsApp" />
              <Button asChild variant="outline">
                <Link href="/kontak">
                  Hubungi Kami
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
