import { Skeleton } from '@/components/Skeleton';

export const StatsCardSkeleton = () => (
  <div className="flex flex-col gap-2">
    <Skeleton.Text width="4rem" height="1.75rem" />
    <Skeleton.Text width="8rem" />
  </div>
);
