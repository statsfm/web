import { FC } from 'vue';

// components
import { Skeleton } from '../Skeleton';

export const ArtistCardSkeleton: FC = () => (
  <>
    <Skeleton.Avatar size="3xl" />
    <div class="mt-2 flex flex-col items-center gap-2">
      <Skeleton.Text width="6rem" />
    </div>
  </>
);
