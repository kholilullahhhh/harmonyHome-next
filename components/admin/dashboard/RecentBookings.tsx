'use client';

import Link from 'next/link';
import {
  ArrowRight,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Eye,
  CalendarCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Booking {
  id: string;
  bookingCode: string;
  name: string;
  roomName: string;
  startDate: string;
  duration: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface RecentBookingsProps {
  bookings: Booking[];
  onConfirm?: (id: string) => void;
  onReject?: (id: string) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: 'Menunggu',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
  },
  CONFIRMED: {
    label: 'Dikonfirmasi',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
  },
  CANCELLED: {
    label: 'Dibatalkan',
    className: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
  },
  COMPLETED: {
    label: 'Selesai',
    className: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400',
  },
};

function formatPrice(price: number): string {
  return 'Rp' + price.toLocaleString('id-ID');
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function RecentBookings({ bookings, onConfirm, onReject }: RecentBookingsProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold sm:text-base">Booking Terbaru</CardTitle>
        <Button asChild variant="ghost" size="sm" className="h-8">
          <Link href="/admin/bookings">
            Lihat Semua
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CalendarCheck className="h-10 w-10 text-muted-foreground/30" />
            <p className="mt-2 text-sm text-muted-foreground">Belum ada booking</p>
          </div>
        ) : (
          <div className="space-y-2">
            {bookings.map((booking) => {
              const st = statusConfig[booking.status] ?? statusConfig.PENDING;
              return (
                <div
                  key={booking.id}
                  className="flex items-center gap-2.5 rounded-lg border border-border/60 p-2.5 transition-colors hover:bg-secondary/30 sm:gap-3 sm:p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="font-mono text-[11px] font-semibold text-primary sm:text-xs">
                        {booking.bookingCode}
                      </span>
                      <Badge variant="secondary" className={cn('text-[9px] sm:text-[10px]', st.className)}>
                        {st.label}
                      </Badge>
                    </div>
                    <p className="mt-0.5 truncate text-xs font-medium sm:text-sm">{booking.name}</p>
                    <p className="text-[11px] text-muted-foreground sm:text-xs">
                      {booking.roomName} · {booking.duration} bln · {formatDate(booking.startDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <p className="whitespace-nowrap text-right text-xs font-semibold sm:text-sm">
                      {formatPrice(booking.totalPrice)}
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/bookings/${booking.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </Link>
                        </DropdownMenuItem>
                        {booking.status === 'PENDING' && onConfirm && (
                          <DropdownMenuItem
                            onClick={() => onConfirm(booking.id)}
                            className="text-emerald-600"
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Konfirmasi
                          </DropdownMenuItem>
                        )}
                        {booking.status === 'PENDING' && onReject && (
                          <DropdownMenuItem
                            onClick={() => onReject(booking.id)}
                            className="text-rose-600"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Tolak
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
