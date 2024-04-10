import type { FC } from 'react';
import { Skeleton } from '../Skeleton';

export const ImportItemSkeleton: FC = () => (
  <li className="flex items-center justify-between gap-x-6 py-5">
    <div className="min-w-0">
      <div className="flex items-start gap-x-3">
        <Skeleton.Text width="7rem" />
        <Skeleton.Text width="9rem" />
      </div>
      <div className="mt-1 flex items-center gap-x-2 pb-1 pt-3 text-sm leading-5 text-gray-500">
        <Skeleton.Text width="17rem" />
        <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
          <circle cx={1} cy={1} r={1} />
        </svg>
        <Skeleton.Text width="6rem" />
      </div>
    </div>
  </li>
);
