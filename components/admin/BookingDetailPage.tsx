'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, Clock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Booking {
  id: string;
  bookingCode: string;
  name: string;
  email: string;
  phone: string;
  identityNumber: string | null;
  address: string | null;
  startDate: string;
  duration: number;
  durationUnit: string;
  totalPrice: number;
  status: string;
  notes: string | null;
  createdAt: string;
  room: {
    id: string;
    name: string;
    price: number;
    slug: string;
  };
}

interface BookingDetailPageProps {
  booking: Booking;
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
    month: 'long',
    year: 'numeric',
  });
}

export function BookingDetailPage({ booking }: BookingDetailPageProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const st = statusConfig[booking.status] ?? statusConfig.PENDING;

  const updateStatus = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Gagal memperbarui');

      toast.success('Status booking berhasil diperbarui.');
      router.refresh();
    } catch {
      toast.error('Gagal memperbarui status booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/bookings">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight">
            Detail Booking
          </h1>
          <p className="font-mono text-sm text-primary">{booking.bookingCode}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Customer Info */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Data Pelanggan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nama</span>
                <span className="font-medium">{booking.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{booking.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telepon</span>
                <span className="font-medium">{booking.phone}</span>
              </div>
              {booking.identityNumber && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">No. Identitas</span>
                  <span className="font-medium">{booking.identityNumber}</span>
                </div>
              )}
              {booking.address && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Alamat</span>
                  <span className="max-w-xs text-right font-medium">
                    {booking.address}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Detail Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kamar</span>
                <span className="font-medium">{booking.room.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Harga/Bulan</span>
                <span className="font-medium">
                  {formatPrice(booking.room.price)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tanggal Mulai</span>
                <span className="font-medium">
                  {formatDate(booking.startDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Durasi</span>
                <span className="font-medium">{booking.duration} bulan</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-serif text-lg font-semibold text-primary">
                  {formatPrice(booking.totalPrice)}
                </span>
              </div>
              {booking.notes && (
                <>
                  <Separator />
                  <div>
                    <span className="text-muted-foreground">Catatan</span>
                    <p className="mt-1 whitespace-pre-wrap">{booking.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status & Actions */}
        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="secondary" className={`w-full justify-center py-1.5 text-sm ${st.className}`}>
                {st.label}
              </Badge>

              <p className="text-xs text-muted-foreground">
                Dibuat: {formatDate(booking.createdAt)}
              </p>

              <div className="space-y-2">
                {booking.status === 'PENDING' && (
                  <>
                    <Button
                      className="w-full"
                      disabled={loading}
                      onClick={() => updateStatus('CONFIRMED')}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Konfirmasi
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={loading}
                      onClick={() => updateStatus('CANCELLED')}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Batalkan
                    </Button>
                  </>
                )}
                {booking.status === 'CONFIRMED' && (
                  <>
                    <Button
                      className="w-full"
                      disabled={loading}
                      onClick={() => updateStatus('COMPLETED')}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Selesai
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={loading}
                      onClick={() => updateStatus('CANCELLED')}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Batalkan
                    </Button>
                  </>
                )}
                {(booking.status === 'CANCELLED' || booking.status === 'COMPLETED') && (
                  <p className="py-2 text-center text-sm text-muted-foreground">
                    Tidak ada aksi tersedia.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
