import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { SiteChrome } from '@/components/SiteChrome';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Harmony Home — Kost Eksklusif dengan Hunian Nyaman',
    template: '%s | Harmony Home',
  },
  description:
    'Harmony Home adalah kost eksklusif dengan fasilitas lengkap, lingkungan nyaman, dan lokasi strategis di Makassar.',
  keywords: [
    'kost eksklusif',
    'kost makassar',
    'harmony home',
    'hunian nyaman',
    'boarding house',
  ],
  openGraph: {
    title: 'Harmony Home — Kost Eksklusif dengan Hunian Nyaman',
    description:
      'Kost eksklusif dengan fasilitas lengkap, lingkungan nyaman, dan lokasi strategis.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SiteChrome>{children}</SiteChrome>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
