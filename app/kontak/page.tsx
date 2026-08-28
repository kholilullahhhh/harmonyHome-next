import type { Metadata } from 'next';
import { Mail, Instagram, MapPin, MessageCircle, Clock } from 'lucide-react';

import { PageHeader } from '@/components/PageHeader';
import { CTASection } from '@/components/CTASection';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Card, CardContent } from '@/components/ui/card';
import { siteConfig } from '@/lib/data/rooms';

export const metadata: Metadata = {
  title: 'Kontak',
  description:
    'Hubungi pengelola Harmony Home melalui WhatsApp, email, atau Instagram. Kami siap membantu kebutuhanmu.',
};

const contactCards = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: siteConfig.contact.whatsappDisplay,
    href: siteConfig.contact.whatsappLink,
  },
  {
    icon: Mail,
    label: 'Email',
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: siteConfig.contact.instagram,
    href: siteConfig.contact.instagramLink,
  },
];

export default function KontakPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kontak"
        title="Hubungi Harmony Home"
        description="Kami senang mendengar darimu. Hubungi pengelola untuk pertanyaan, survey, atau proses booking."
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl container-px">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact cards */}
            <div>
              <h2 className="font-serif text-2xl font-semibold">
                Informasi Kontak
              </h2>
              <p className="mt-2 text-muted-foreground">
                Pilih saluran komunikasi yang paling nyaman untukmu.
              </p>

              <div className="mt-6 space-y-4">
                {contactCards.map((c) => {
                  const Icon = c.icon;
                  return (
                    <a
                      key={c.label}
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Card className="border-border/60 transition-all duration-300 hover:border-primary/40 hover:shadow-md">
                        <CardContent className="flex items-center gap-4 p-5">
                          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">
                              {c.label}
                            </p>
                            <p className="font-medium">{c.value}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  );
                })}
              </div>

              <div className="mt-6">
                <WhatsAppButton size="lg" className="w-full sm:w-auto" />
              </div>
            </div>

            {/* Address & hours */}
            <div>
              <Card className="border-border/60">
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-semibold">Alamat</h3>
                  <div className="mt-4 flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-muted-foreground">
                      {siteConfig.address.street}
                      <br />
                      {siteConfig.address.city}, {siteConfig.address.province}{' '}
                      {siteConfig.address.postalCode}
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                      <Clock className="h-4 w-4 text-primary" />
                      Jam Operasional
                    </h4>
                    <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      <li className="flex justify-between">
                        <span>Senin – Jumat</span>
                        <span className="font-medium text-foreground">
                          08.00 – 20.00
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>Sabtu – Minggu</span>
                        <span className="font-medium text-foreground">
                          09.00 – 17.00
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>Keamanan</span>
                        <span className="font-medium text-foreground">
                          24 jam
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold">Lokasi di Peta</h4>
                    <div className="relative mt-3 aspect-video overflow-hidden rounded-lg border border-border/60">
                      <iframe
                        title="Peta lokasi Harmony Home"
                        src={siteConfig.maps.embedUrl}
                        className="h-full w-full"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Siap Bergabung dengan Harmony Home?"
        description="Ajukan booking sekarang dan rasakan hunian nyaman dengan fasilitas lengkap."
      />
    </>
  );
}
