import Link from 'next/link';
import { Home, Mail, Instagram, MessageCircle, MapPin } from 'lucide-react';

import { siteConfig } from '@/lib/data/rooms';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/tentang', label: 'Tentang' },
  { href: '/kamar', label: 'Kamar' },
  { href: '/fasilitas', label: 'Fasilitas' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/lokasi', label: 'Lokasi' },
  { href: '/faq', label: 'FAQ' },
];

const legalLinks = [
  { href: '/aturan', label: 'Aturan Kost' },
  { href: '/kontak', label: 'Kontak' },
];

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl container-px py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Home className="h-5 w-5" />
              </span>
              <span className="font-serif text-xl font-semibold">
                Harmony Home
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.tagline}. Fasilitas, privasi, dan kenyamanan yang
              dirancang untuk kebutuhanmu.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={siteConfig.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.contact.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Navigasi
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-1 gap-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Lainnya
            </h3>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Kontak
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{siteConfig.address.full}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href={siteConfig.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  {siteConfig.contact.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="transition-colors hover:text-foreground"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Instagram className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href={siteConfig.contact.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  {siteConfig.contact.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Harmony Home. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/aturan" className="transition-colors hover:text-foreground">
              Kebijakan Privasi
            </Link>
            <span aria-hidden>·</span>
            <Link href="/aturan" className="transition-colors hover:text-foreground">
              Syarat &amp; Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
