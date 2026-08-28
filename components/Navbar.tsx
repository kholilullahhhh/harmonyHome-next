'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Menu, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/tentang', label: 'Tentang' },
  { href: '/kamar', label: 'Kamar' },
  { href: '/fasilitas', label: 'Fasilitas' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/lokasi', label: 'Lokasi' },
  { href: '/faq', label: 'FAQ' },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = pathname === '/';
  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isTransparent
          ? 'bg-transparent'
          : 'border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between container-px lg:h-20">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="Harmony Home"
        >
          <span
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
              isTransparent
                ? 'bg-white/90 text-primary'
                : 'bg-primary text-primary-foreground'
            )}
          >
            <Home className="h-5 w-5" />
          </span>
          <span
            className={cn(
              'font-serif text-xl font-semibold tracking-tight transition-colors',
              isTransparent ? 'text-white' : 'text-foreground'
            )}
          >
            Harmony Home
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isTransparent
                      ? 'text-white/80 hover:text-white'
                      : 'text-muted-foreground hover:text-foreground',
                    active &&
                      (isTransparent
                        ? 'text-white'
                        : 'text-foreground')
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/booking">Booking Kamar</Link>
          </Button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Buka menu"
                className={cn(isTransparent && 'text-white hover:bg-white/10')}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px]">
              <div className="flex items-center justify-between border-b pb-4">
                <Link
                  href="/"
                  className="flex items-center gap-2.5"
                  onClick={() => setOpen(false)}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Home className="h-5 w-5" />
                  </span>
                  <span className="font-serif text-lg font-semibold">
                    Harmony Home
                  </span>
                </Link>
              </div>
              <ul className="mt-4 flex flex-col gap-1">
                {navLinks.map((link) => {
                  const active =
                    link.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'rounded-md px-3 py-2.5 text-base font-medium transition-colors',
                          active
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 flex flex-col gap-2 border-t pt-4">
                <Button asChild onClick={() => setOpen(false)}>
                  <Link href="/booking">Booking Kamar</Link>
                </Button>
                <Button asChild variant="outline" onClick={() => setOpen(false)}>
                  <Link href="/kontak">Hubungi Kami</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
