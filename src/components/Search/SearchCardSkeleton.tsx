import { Skeleton } from '@/components/Skeleton';
import clsx from 'clsx';
import type { FC } from 'react';

export const SearchCardSkeleton: FC<{ type: string }> = ({ type }) => (
  <>
    {type === 'artist' ? (
      <Skeleton.Avatar size="3xl" />
    ) : (
      <Skeleton.Image width="10rem" height="10rem" />
    )}
    <div
      className={clsx(
        'mt-2 flex flex-col gap-2',
        type === 'artist' ? 'items-center' : '',
      )}
    >
      <Skeleton.Text width="9rem" />
      {['album', 'track'].includes(type) && <Skeleton.Text width="6.5rem" />}
    </div>
  </>
);
