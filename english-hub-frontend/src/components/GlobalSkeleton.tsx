import { Skeleton } from './ui/skeleton';

export default function GlobalSkeleton() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="space-y-4">
        <Skeleton className="h-6 w-[300px]" /> {/* Title */}
        <Skeleton className="h-4 w-[250px]" /> {/* Subtitle */}
        <Skeleton className="h-4 w-[200px]" /> {/* Smaller line */}
      </div>
    </div>
  );
}
