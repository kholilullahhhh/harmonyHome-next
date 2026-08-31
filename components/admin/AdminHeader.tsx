'use client';

import * as React from 'react';
import { Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  onMenuClick: () => void;
  className?: string;
}

export function AdminHeader({ user, onMenuClick, className }: AdminHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6',
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label="Buka menu navigasi"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden min-w-0 lg:block">
        <p className="truncate text-sm font-semibold">Harmony Home Admin</p>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5">
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {user.name ?? user.email}
        </span>
        <Separator orientation="vertical" className="hidden h-4 sm:block" />
        <ThemeToggle />
      </div>
    </header>
  );
}
