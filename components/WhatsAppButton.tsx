import { MessageCircle } from 'lucide-react';
import { siteConfig } from '@/lib/data/rooms';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  className?: string;
  label?: string;
  size?: 'default' | 'sm' | 'lg';
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
}

export function WhatsAppButton({
  className,
  label = 'Chat via WhatsApp',
  size = 'default',
  variant = 'default',
}: WhatsAppButtonProps) {
  return (
    <Button
      asChild
      size={size}
      variant={variant}
      className={cn(
        'bg-emerald-600 text-white hover:bg-emerald-700',
        variant === 'outline' &&
          'border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
        className
      )}
    >
      <a
        href={siteConfig.contact.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        {label}
      </a>
    </Button>
  );
}
