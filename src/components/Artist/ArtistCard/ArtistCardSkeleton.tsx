import { Skeleton } from '@/components/Skeleton';

export const ArtistCardSkeleton = () => (
  <>
    <Skeleton.Avatar size="3xl" />
    <div className="mt-2 flex flex-col items-center gap-2">
      <Skeleton.Text width="6rem" />
    </div>
  </>
);
