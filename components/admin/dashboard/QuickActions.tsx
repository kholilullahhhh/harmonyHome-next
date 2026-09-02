'use client';

import Link from 'next/link';
import {
  DoorOpen,
  CalendarCheck,
  Settings,
  ImageIcon,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const actions = [
  {
    label: 'Tambah Kamar',
    href: '/admin/rooms/new',
    icon: DoorOpen,
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    label: 'Buat Booking',
    href: '/admin/bookings',
    icon: CalendarCheck,
    color: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    label: 'Lihat Pesan',
    href: '/admin/messages',
    icon: Users,
    color: 'text-violet-600 dark:text-violet-400',
  },
  {
    label: 'Fasilitas',
    href: '/admin/facilities',
    icon: Settings,
    color: 'text-amber-600 dark:text-amber-400',
  },
  {
    label: 'Upload Galeri',
    href: '/admin/gallery',
    icon: ImageIcon,
    color: 'text-rose-600 dark:text-rose-400',
  },
];

export function QuickActions() {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold sm:text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                asChild
                variant="outline"
                className="h-auto flex-col gap-1.5 border-border/60 px-2 py-3 sm:gap-2 sm:py-4"
              >
                <Link href={action.href}>
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${action.color}`} />
                  <span className="text-[10px] font-medium sm:text-xs">{action.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
