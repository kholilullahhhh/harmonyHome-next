'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  children?: ReactNode;
}

export function ParallaxImage({
  src,
  alt,
  className = '',
  speed = 0.15,
  children,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.bottom < 0 || rect.top > windowHeight) return;
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        setOffset((progress - 0.5) * speed * 100);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-100 ease-out will-change-transform"
        style={{ transform: `translateY(${offset}px) scale(1.1)` }}
      />
      {children}
    </div>
  );
}
