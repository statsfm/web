import { Skeleton } from '../Skeleton';

export const TopListenerCardSkeleton = () => (
  <>
    <Skeleton.Avatar size="3xl" />
    <div className="mt-2 flex flex-col items-center justify-center gap-2">
      <Skeleton.Text width="5rem" />
      <Skeleton.Text width="9rem" />
      <Skeleton.Text width="6.5rem" />
    </div>
  </>
);
