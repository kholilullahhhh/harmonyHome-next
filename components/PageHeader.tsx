import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        'border-b bg-secondary/40 py-14 lg:py-20',
        className
      )}
    >
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8 lg:px-12">
        {eyebrow && (
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground text-balance sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
