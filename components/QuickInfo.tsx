import { BedDouble, LayoutGrid, Tag, MapPin } from 'lucide-react';

import { siteConfig } from '@/lib/data/rooms';

const items = [
  {
    icon: BedDouble,
    label: 'Jumlah Kamar',
    value: siteConfig.stats.totalRooms,
  },
  {
    icon: LayoutGrid,
    label: 'Tipe Kamar',
    value: siteConfig.stats.roomTypes,
  },
  {
    icon: Tag,
    label: 'Harga Mulai',
    value: siteConfig.stats.startingPricePerMonth,
  },
  {
    icon: MapPin,
    label: 'Lokasi',
    value: siteConfig.stats.location,
  },
];

export function QuickInfo() {
  return (
    <section className="border-b bg-background py-12 lg:py-16">
      <div className="mx-auto max-w-7xl container-px">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 bg-card p-6 text-center sm:p-8"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                <p className="font-serif text-lg font-semibold sm:text-xl">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
