import { Skeleton } from '../Skeleton';

export const RelatedArtistCardSkeleton = () => (
  <div className="flex w-60 items-center gap-2">
    <Skeleton.Avatar />
    <Skeleton.Text width="9rem" />
  </div>
);
