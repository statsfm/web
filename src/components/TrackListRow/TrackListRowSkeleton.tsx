import { Divider } from '../Divider';
import { Skeleton } from '../Skeleton';

export const TrackListRowSkeleton = () => (
  <>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton.Image width="48px" height="48px" />

        <div className="flex flex-col gap-2">
          <Skeleton.Text width="4rem" />
          <Skeleton.Text width="15rem" />
        </div>
      </div>

      <Skeleton.Text width="4rem" />
    </div>
    <Divider />
  </>
);
