'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { siteConfig } from '@/lib/data/rooms';

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      {/* Tooltip */}
      {!minimized && (
        <div className="animate-in slide-in-from-bottom-2 fade-in duration-300 relative rounded-2xl border bg-card px-4 py-3 shadow-2xl shadow-black/10">
          <button
            onClick={() => setMinimized(true)}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
            aria-label="Tutup"
          >
            <X className="h-3 w-3" />
          </button>
          <p className="text-sm font-medium">Ada yang bisa kami bantu?</p>
          <p className="text-xs text-muted-foreground">Chat via WhatsApp</p>
        </div>
      )}

      {/* Button */}
      <a
        href={siteConfig.contact.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat via WhatsApp"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:bg-emerald-600 hover:scale-110 hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-95"
      >
        <MessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
      </a>
    </div>
  );
}
