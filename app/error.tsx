'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">
        Terjadi Kesalahan
      </p>
      <h1 className="mt-4 font-serif text-3xl font-semibold">
        Ada yang Tidak Beres
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Maaf, terjadi kesalahan tak terduga. Silakan coba lagi atau hubungi
        pengelola jika masalah berlanjut.
      </p>
      <Button onClick={reset} className="mt-8">
        Coba Lagi
      </Button>
    </div>
  );
}
