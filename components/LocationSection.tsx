import Link from 'next/link';
import { MapPin, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { siteConfig } from '@/lib/data/rooms';
import { nearbyPlaces } from '@/lib/data/site-content';
import * as LucideIcons from 'lucide-react';

export function LocationSection() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Map */}
      <div className="relative overflow-hidden rounded-xl border border-border/60">
        <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[400px]">
          <iframe
            title="Lokasi Harmony Home"
            src={siteConfig.maps.embedUrl}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col justify-center">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-serif text-xl font-semibold">Alamat</h3>
            <p className="mt-1 text-muted-foreground">
              {siteConfig.address.street}
              <br />
              {siteConfig.address.city}, {siteConfig.address.province}{' '}
              {siteConfig.address.postalCode}
            </p>
          </div>
        </div>

        <a
          href={siteConfig.maps.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4"
        >
          <Button variant="outline">
            Buka Google Maps
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </a>

        <div className="mt-8">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Fasilitas Sekitar
          </h4>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {nearbyPlaces.map((place) => {
              const Icon =
                (LucideIcons as Record<string, LucideIcons.LucideIcon>)[
                  place.icon
                ] ?? MapPin;
              return (
                <Card
                  key={place.id}
                  className="border-border/60 transition-colors hover:border-primary/40"
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {place.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {place.distance}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <Button asChild>
            <Link href="/kontak">Hubungi Pengelola</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
