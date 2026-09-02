import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  rows?: number;
  title?: string;
}

export function TableSkeleton({ rows = 5, title = 'Data' }: TableSkeletonProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-36" />
      </div>

      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Header */}
            <div className="flex gap-4 border-b pb-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-3 flex-1" />
              ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex gap-4 py-3">
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 flex-1" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
