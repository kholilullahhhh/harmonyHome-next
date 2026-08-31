'use client';

import { ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ImageReveal({ children, className = '', delay = 0 }: ImageRevealProps) {
  const { ref, isInView } = useInView({ once: true, threshold: 0.15 });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        className="transition-all duration-1000 ease-out will-change-transform"
        style={{
          transitionDelay: `${delay}ms`,
          transform: isInView ? 'scale(1)' : 'scale(1.15)',
          opacity: isInView ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
