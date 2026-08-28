import Link from 'next/link';
import Image from 'next/image';
import { Check, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Room, roomStatusMap } from '@/lib/data/rooms';

interface RoomCardProps {
  room: Room;
  className?: string;
}

export function RoomCard({ room, className }: RoomCardProps) {
  const status = roomStatusMap[room.status];

  return (
    <Card
      className={cn(
        'group flex flex-col overflow-hidden border-border/60 transition-all duration-300 hover:shadow-lg',
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={room.images[0]}
          alt={room.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4">
          <Badge
            variant="outline"
            className={cn(
              'gap-1.5 border bg-background/90 backdrop-blur',
              status.badgeClass
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', status.dotClass)} />
            {room.status === 'limited'
              ? `Tersisa ${room.availableCount} kamar`
              : status.label}
          </Badge>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <span className="text-xs font-medium uppercase tracking-wider text-white/90">
            {room.type}
          </span>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-xl font-semibold">{room.name}</h3>
          <p className="text-right">
            <span className="block font-serif text-lg font-semibold text-primary">
              {room.priceLabel.split(' /')[0]}
            </span>
            <span className="text-xs text-muted-foreground">/ bulan</span>
          </p>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {room.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>Ukuran: {room.size}</span>
          <span aria-hidden>·</span>
          <span>Kapasitas: {room.capacity} penghuni</span>
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5">
          {room.facilities.slice(0, 6).map((f) => (
            <li
              key={f}
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center gap-3 pt-2">
          <Button asChild className="flex-1">
            <Link href={`/kamar/${room.slug}`}>
              Lihat Detail
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/booking">Booking</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
