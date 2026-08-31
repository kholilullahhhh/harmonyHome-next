'use client';

import { useScrollProgress } from '@/hooks/useScrollProgress';

export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-primary/10">
      <div
        className="h-full bg-gradient-to-r from-primary to-primary/80 transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
