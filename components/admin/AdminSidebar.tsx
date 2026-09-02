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
  ChevronLeft,
  Users,
  Banknote,
  BarChart3,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Properti',
    items: [
      { href: '/admin/rooms', label: 'Kamar', icon: DoorOpen },
      { href: '/admin/facilities', label: 'Fasilitas', icon: Settings },
      { href: '/admin/gallery', label: 'Galeri', icon: ImageIcon },
    ],
  },
  {
    label: 'Penghuni',
    items: [
      { href: '/admin/bookings', label: 'Booking', icon: CalendarCheck },
    ],
  },
  {
    label: 'Konten',
    items: [
      { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
      { href: '/admin/rules', label: 'Aturan', icon: ShieldCheck },
      { href: '/admin/testimonials', label: 'Testimoni', icon: Star },
      { href: '/admin/messages', label: 'Pesan', icon: MessageCircle },
    ],
  },
  {
    label: 'Sistem',
    items: [
      { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
    ],
  },
];

export function SidebarContent({ user, collapsed = false }: AdminSidebarProps & { collapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col">
        {/* Logo / Brand */}
        <div className={cn('flex items-center gap-3 px-4 py-5', collapsed && 'justify-center px-2')}>
          {!collapsed && (
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                  HH
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">Harmony Home</p>
                <p className="truncate text-[10px] text-muted-foreground">Admin Panel</p>
              </div>
            </div>
          )}
          {collapsed && (
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                HH
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(item.href);

                  const linkContent = (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                        collapsed && 'justify-center px-2'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      </Tooltip>
                    );
                  }

                  return <div key={item.href}>{linkContent}</div>;
                })}
              </div>
            </div>
          ))}
        </nav>

        <Separator />

        {/* Footer */}
        <div className="space-y-1 px-3 py-4">
          {!collapsed && (
            <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="bg-secondary text-xs font-medium">
                  {(user.name ?? 'A').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{user.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
              </div>
            </div>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground',
                  collapsed && 'justify-center px-2'
                )}
              >
                <Home className="h-4 w-4" />
                {!collapsed && <span>Lihat Website</span>}
              </Link>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Lihat Website</TooltipContent>}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive',
                  collapsed && 'justify-center px-2'
                )}
              >
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Keluar</span>}
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Keluar</TooltipContent>}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-card lg:block">
      <SidebarContent user={user} />
    </aside>
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
