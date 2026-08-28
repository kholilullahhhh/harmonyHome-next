import { Card, CardContent } from '@/components/ui/card';
import { type Facility } from '@/lib/data/facilities';

interface FacilityCardProps {
  facility: Facility;
}

export function FacilityCard({ facility }: FacilityCardProps) {
  const Icon = facility.icon;
  return (
    <Card className="group border-border/60 transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
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
