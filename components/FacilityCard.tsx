import * as LucideIcons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FacilityCardProps {
  facility: {
    id: number;
    name: string;
    description: string;
    icon: string;
  };
}

export function FacilityCard({ facility }: FacilityCardProps) {
  const Icon =
    (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[
      facility.icon
    ] ?? LucideIcons.Star;

  return (
    <Card className="group border-border/60 transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-semibold">{facility.name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {facility.description}
        </p>
      </CardContent>
    </Card>
  );
}
