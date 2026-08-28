import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
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
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
