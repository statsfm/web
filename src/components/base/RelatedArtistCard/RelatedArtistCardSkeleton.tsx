import { FC } from 'vue';

// components
import { Skeleton } from '../Skeleton';

export const RelatedArtistCardSkeleton: FC = () => (
  <div class="flex w-60 items-center gap-2">
    <Skeleton.Avatar />
    <Skeleton.Text width="9rem" />
  </div>
);
