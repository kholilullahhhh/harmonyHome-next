'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search, Command } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  onMenuClick: () => void;
  className?: string;
}

export function AdminHeader({ user, onMenuClick, className }: AdminHeaderProps) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSearchSelect = (value: string) => {
    setSearchOpen(false);
    router.push(value);
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:h-14 sm:gap-3 sm:px-6',
          className
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          aria-label="Buka menu navigasi"
          className="h-10 w-10 shrink-0 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden min-w-0 lg:block">
          <p className="truncate text-sm font-semibold">Harmony Home Admin</p>
        </div>

        <div className="flex-1" />

        {/* Search Trigger - desktop */}
        <Button
          variant="outline"
          className="hidden h-8 w-56 justify-between text-xs text-muted-foreground sm:flex"
          onClick={() => setSearchOpen(true)}
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            Cari...
          </span>
          <kbd className="pointer-events-none flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </Button>

        {/* Search Trigger - mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0 sm:hidden"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-5 sm:hidden" />

        <div className="flex items-center gap-1">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {user.name ?? user.email}
          </span>
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          <ThemeToggle />
        </div>
      </header>

      {/* Command Dialog (Global Search) */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Cari kamar, booking, atau pengaturan..." />
        <CommandList>
          <CommandEmpty>Tidak ada hasil ditemukan.</CommandEmpty>
          <CommandGroup heading="Navigasi">
            <CommandItem
              value="dashboard"
              onSelect={() => handleSearchSelect('/admin')}
            >
              Dashboard
            </CommandItem>
            <CommandItem
              value="rooms kamar"
              onSelect={() => handleSearchSelect('/admin/rooms')}
            >
              Kamar
            </CommandItem>
            <CommandItem
              value="bookings booking"
              onSelect={() => handleSearchSelect('/admin/bookings')}
            >
              Booking
            </CommandItem>
            <CommandItem
              value="facilities fasilitas"
              onSelect={() => handleSearchSelect('/admin/facilities')}
            >
              Fasilitas
            </CommandItem>
            <CommandItem
              value="gallery galeri"
              onSelect={() => handleSearchSelect('/admin/gallery')}
            >
              Galeri
            </CommandItem>
            <CommandItem
              value="faq"
              onSelect={() => handleSearchSelect('/admin/faq')}
            >
              FAQ
            </CommandItem>
            <CommandItem
              value="rules aturan"
              onSelect={() => handleSearchSelect('/admin/rules')}
            >
              Aturan
            </CommandItem>
            <CommandItem
              value="testimonials testimoni"
              onSelect={() => handleSearchSelect('/admin/testimonials')}
            >
              Testimoni
            </CommandItem>
            <CommandItem
              value="messages pesan"
              onSelect={() => handleSearchSelect('/admin/messages')}
            >
              Pesan
            </CommandItem>
            <CommandItem
              value="settings pengaturan"
              onSelect={() => handleSearchSelect('/admin/settings')}
            >
              Pengaturan
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Aksi Cepat">
            <CommandItem
              value="add room tambah kamar"
              onSelect={() => handleSearchSelect('/admin/rooms/new')}
            >
              + Tambah Kamar
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
