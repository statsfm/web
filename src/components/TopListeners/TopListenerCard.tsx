import type * as statsfm from '@/utils/statsfm';
import clsx from 'clsx';
import Link from 'next/link';
import formatter from '@/utils/formatter';
import { Avatar } from '@/components/Avatar';

interface Props extends statsfm.TopUser {}

const positions: Record<number, string> = {
  1: 'bg-amber-400/30 text-amber-400',
  2: 'bg-gray-500/30 text-gray-500',
  3: 'bg-yellow-700/30 text-yellow-700',
};

export const TopListenerCard = ({
  user,
  position,
  playedMs,
  streams,
}: Props) => {
  return (
    <Link
      href={`/${user.id}`}
      className="flex w-40 flex-col items-center transition-transform duration-300 ease-in-out active:scale-95"
    >
      <Avatar src={user.image} name={user.displayName} size="3xl">
        <span
          className={clsx(
            'rounded-lg bg-foreground px-2 py-1.5 text-lg drop-shadow-lg',
            positions[position]
          )}
        >
          #{position}
        </span>
      </Avatar>

      <div className="mt-2 w-full text-center">
        <h4 className="!block text-ellipsis line-clamp-2">
          {user.displayName}
        </h4>

        <p className="m-0 line-clamp-2">
          {playedMs && <span>{formatter.formatMinutes(playedMs)} minutes</span>}

          <br />
          <span>{formatter.localiseNumber(streams)} streams</span>
        </p>
      </div>
    </Link>
  );
};
