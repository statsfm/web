import { FC } from 'vue';

// components
import { Skeleton } from '../Skeleton';

export const StatsCardSkeleton: FC = () => (
  <div class="flex flex-col gap-2">
    {/* TODO: add some sort of prop to say it's an heading instead of setting the height */}
    <Skeleton.Text width="4rem" style={{ height: '1.75rem' }} />
    <Skeleton.Text width="8rem" />
  </div>
);
