'use client';

import { ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  once?: boolean;
}

const directionMap = {
  up: 'translate-y-8',
  down: '-translate-y-8',
  left: 'translate-x-8',
  right: '-translate-x-8',
  none: '',
};

export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  once = true,
}: RevealProps) {
  const { ref, isInView } = useInView({ once, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isInView
          ? 'opacity-100 translate-x-0 translate-y-0'
          : `opacity-0 ${directionMap[direction]}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
