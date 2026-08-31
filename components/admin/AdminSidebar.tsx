'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  CalendarCheck,
  DoorOpen,
  Settings,
  MessageCircle,
  LogOut,
  Star,
  HelpCircle,
  ShieldCheck,
  ImageIcon,
  Home,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Booking', icon: CalendarCheck },
  { href: '/admin/rooms', label: 'Kamar', icon: DoorOpen },
  { href: '/admin/facilities', label: 'Fasilitas', icon: Settings },
  { href: '/admin/gallery', label: 'Galeri', icon: ImageIcon },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/rules', label: 'Aturan', icon: ShieldCheck },
  { href: '/admin/testimonials', label: 'Testimoni', icon: Star },
  { href: '/admin/messages', label: 'Pesan', icon: MessageCircle },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
];

export function SidebarContent({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-6 py-5">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
            {(user.name ?? 'A').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator />

      <div className="space-y-1 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Home className="h-4 w-4" />
          Lihat Website
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-card lg:block">
        <SidebarContent user={user} />
      </aside>
    </>
  );
}

export function AdminMobileSidebar({
  user,
  open,
  onOpenChange,
}: AdminSidebarProps & { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[85%] max-w-xs p-0">
        <SidebarContent user={user} />
      </SheetContent>
    </Sheet>
  );
}
