import { FC } from 'vue';

// components
import { Skeleton } from '../Skeleton';

export const TopListenerCardSkeleton: FC = () => (
  <>
    <Skeleton.Avatar size="3xl" />
    <div class="gap- mt-2 flex flex-col items-center justify-center gap-2">
      <Skeleton.Text width="5rem" />
      <Skeleton.Text width="9rem" />
      <Skeleton.Text width="6.5rem" />
    </div>
  </>
);
