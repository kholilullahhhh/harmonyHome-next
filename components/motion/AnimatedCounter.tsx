'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedCounter({
  target,
  duration = 1500,
  suffix = '',
  prefix = '',
  className = '',
}: AnimatedCounterProps) {
  const { ref, isInView } = useInView({ once: true, threshold: 0.5 });
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString('id-ID')}{suffix}
    </span>
  );
}
