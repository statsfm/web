import { FC } from 'vue';

// components
import { Skeleton } from '../Skeleton';

export const TrackListRowSkeleton: FC = () => (
  <>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Skeleton.Image width="48px" height="48px" />

        <div class="flex flex-col gap-2">
          <Skeleton.Text width="8rem" />
          <Skeleton.Text width="8rem" />
        </div>
      </div>

      <Skeleton.Text width="4rem" />
    </div>
    <hr class="my-3 border-bodySecundary" />
  </>
);
