import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">
        404
      </p>
      <h1 className="mt-4 font-serif text-3xl font-semibold">
        Halaman Tidak Ditemukan
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Halaman yang kamu cari tidak tersedia atau telah dipindahkan.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  );
}
