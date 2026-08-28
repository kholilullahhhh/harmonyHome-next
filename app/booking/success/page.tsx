import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Home, MessageCircle, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { siteConfig, formatPrice } from '@/lib/data/rooms';

export const metadata: Metadata = {
  title: 'Booking Berhasil',
  description: 'Booking Anda di Harmony Home telah berhasil diajukan.',
};

interface SuccessPageProps {
  searchParams: {
    id?: string;
    room?: string;
    name?: string;
    duration?: string;
    total?: string;
  };
}

export default function BookingSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const bookingId = searchParams.id ?? 'HH-2026-0001';
  const room = searchParams.room ?? 'Kamar';
  const duration = searchParams.duration ?? '1';
  const total = searchParams.total
    ? formatPrice(parseInt(searchParams.total, 10) || 0)
    : '-';

  return (
    <section className="flex min-h-[70vh] items-center justify-center py-16 lg:py-24">
      <div className="mx-auto w-full max-w-xl container-px">
        <Card className="border-border/60 text-center">
          <CardContent className="p-8 sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60">
              <CheckCircle2 className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
            </div>

            <h1 className="mt-6 font-serif text-3xl font-semibold tracking-tight">
              Booking Berhasil Diajukan
            </h1>
            <p className="mt-3 text-muted-foreground">
              Terima kasih telah memilih Harmony Home.
            </p>

            <div className="mt-8 rounded-xl border bg-secondary/40 p-5 text-left">
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking ID</span>
                  <span className="font-mono font-semibold text-primary">
                    {bookingId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipe Kamar</span>
                  <span className="font-medium">{room}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Durasi</span>
                  <span className="font-medium">{duration} bulan</span>
                </div>
                {total !== '-' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium">{total}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t pt-2.5">
                  <span className="text-muted-foreground">Status</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                    <Clock className="h-3 w-3" />
                    Menunggu Konfirmasi
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Pengelola akan menghubungi Anda melalui nomor yang diberikan
              dalam 1×24 jam.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Kembali ke Home
                </Link>
              </Button>
              <WhatsAppButton
                size="lg"
                variant="outline"
                label="Hubungi Pengelola"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
