'use client';

import * as React from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  galleryImages,
  galleryCategories,
  type GalleryCategory,
} from '@/lib/data/gallery';
import { cn } from '@/lib/utils';

type Filter = GalleryCategory | 'all';

export function Gallery({ limit }: { limit?: number }) {
  const [filter, setFilter] = React.useState<Filter>('all');
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const filtered =
    filter === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);

  const images = limit ? filtered.slice(0, limit) : filtered;

  const openLightbox = (id: number) => {
    const idx = images.findIndex((img) => img.id === id);
    setLightboxIndex(idx);
  };

  const closeLightbox = React.useCallback(() => setLightboxIndex(null), []);
  const prev = React.useCallback(
    () =>
      setLightboxIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = React.useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );

  React.useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, images.length, prev, next, closeLightbox]);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {galleryCategories.map((cat) => (
          <Button
            key={cat.value}
            variant={filter === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => openLightbox(img.id)}
            className="group relative block w-full overflow-hidden rounded-lg border border-border/60"
            aria-label={`Lihat foto: ${img.alt}`}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="p-4 text-xs font-medium uppercase tracking-wider text-white">
                {img.categoryLabel}
              </span>
            </div>
          </button>
        ))}
      </div>

      {images.length === 0 && (
        <p className="mt-8 text-center text-muted-foreground">
          Belum ada foto pada kategori ini.
        </p>
      )}

      {/* Lightbox */}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => !open && closeLightbox()}
      >
        <DialogContent className="max-w-4xl border-0 bg-black/95 p-0 sm:rounded-xl">
          <DialogTitle className="sr-only">
            {lightboxIndex !== null ? images[lightboxIndex].alt : 'Galeri'}
          </DialogTitle>
          {lightboxIndex !== null && (
            <div className="relative flex items-center justify-center">
              <button
                onClick={prev}
                aria-label="Sebelumnya"
                className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="relative h-[60vh] w-full">
                <Image
                  src={images[lightboxIndex].src}
                  alt={images[lightboxIndex].alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              <button
                onClick={next}
                aria-label="Berikutnya"
                className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-xs text-white backdrop-blur">
                {images[lightboxIndex].categoryLabel} — {lightboxIndex + 1} /{' '}
                {images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
