import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Check,
  ArrowLeft,
  ArrowRight,
  Ruler,
  Users,
  Wallet,
  ScrollText,
  ShieldCheck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  getRoomBySlug,
  getRoomBySlug as getRoom,
  rooms,
  roomStatusMap,
  formatPrice,
} from '@/lib/data/rooms';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return rooms.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const room = getRoomBySlug(params.slug);
  if (!room) return { title: 'Kamar Tidak Ditemukan' };
  return {
    title: room.name,
    description: room.shortDescription,
  };
}

export default function RoomDetailPage({ params }: PageProps) {
  const room = getRoom(params.slug);
  if (!room) notFound();

  const status = roomStatusMap[room.status];

  return (
    <div className="py-8 lg:py-12">
      <div className="mx-auto max-w-7xl container-px">
        {/* Breadcrumb */}
        <Link
          href="/kamar"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar kamar
        </Link>

        {/* Gallery */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="relative col-span-1 aspect-[4/3] overflow-hidden rounded-xl border border-border/60 lg:col-span-2 lg:row-span-2 lg:aspect-auto">
            <Image
              src={room.images[0]}
              alt={`${room.name} — foto utama`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
          </div>
          {room.images.slice(1).map((img, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/60"
            >
              <Image
                src={img}
                alt={`${room.name} — foto ${i + 2}`}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Main info */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="border-border">
                {room.type}
              </Badge>
              <Badge
                variant="outline"
                className={`gap-1.5 ${status.badgeClass}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`}
                />
                {room.status === 'limited'
                  ? `Tersisa ${room.availableCount} kamar`
                  : status.label}
              </Badge>
            </div>

            <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight">
              {room.name}
            </h1>
            <p className="mt-2 text-lg font-semibold text-primary">
              {formatPrice(room.price)}{' '}
              <span className="text-base font-normal text-muted-foreground">
                / bulan
              </span>
            </p>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {room.description}
            </p>

            {/* Quick specs */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-2.5 rounded-lg border border-border/60 p-4">
                <Ruler className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Ukuran</p>
                  <p className="text-sm font-medium">{room.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg border border-border/60 p-4">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Kapasitas</p>
                  <p className="text-sm font-medium">
                    {room.capacity} penghuni
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg border border-border/60 p-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Ketersediaan</p>
                  <p className="text-sm font-medium">
                    {room.availableCount} / {room.totalCount} kamar
                  </p>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="mt-8">
              <h2 className="font-serif text-xl font-semibold">Fasilitas</h2>
              <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {room.facilities.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3 w-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Rules */}
            <div className="mt-8">
              <h2 className="flex items-center gap-2 font-serif text-xl font-semibold">
                <ScrollText className="h-5 w-5 text-primary" />
                Peraturan Kamar
              </h2>
              <ul className="mt-4 space-y-2">
                {room.rules.map((r) => (
                  <li
                    key={r}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment */}
            <div className="mt-8">
              <h2 className="flex items-center gap-2 font-serif text-xl font-semibold">
                <Wallet className="h-5 w-5 text-primary" />
                Informasi Pembayaran
              </h2>
              <ul className="mt-4 space-y-2">
                {room.paymentInfo.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-border/60">
              <CardContent className="p-6">
                <h3 className="font-serif text-lg font-semibold">
                  Booking Kamar Ini
                </h3>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipe</span>
                    <span className="font-medium">{room.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Harga</span>
                    <span className="font-medium">
                      {formatPrice(room.price)}/bln
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium">
                      {room.status === 'limited'
                        ? `Tersisa ${room.availableCount}`
                        : status.label}
                    </span>
                  </div>
                </div>
                <Separator className="my-4" />
                <Button asChild size="lg" className="w-full">
                  <Link
                    href={`/booking?room=${room.slug}`}
                  >
                    Booking Kamar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="mt-2 w-full">
                  <Link href="/kamar">Lihat Kamar Lain</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
