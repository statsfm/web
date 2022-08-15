import { Skeleton } from '../Skeleton';

export const AlbumCardSkeleton = () => (
  <>
    <Skeleton.Image width="10rem" height="10rem" />
    <div className="mt-2 flex flex-col gap-2">
      <Skeleton.Text width="9rem" />
      <Skeleton.Text width="6.5rem" />
    </div>
  </>
);
