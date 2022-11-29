import { useApi, useStatAnimation } from '@/hooks';
import formatter from '@/utils/formatter';
import type { DatabaseSizeItem, DatabaseSize } from '@statsfm/statsfm.js';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { MdOutlineArrowRightAlt } from 'react-icons/md';

const TotalStatsItem: FC<{
  label: string;
  snapshot: DatabaseSizeItem;
  liveIndicator?: boolean;
}> = (props) => {
  const { snapshot } = props;
  const { count, indicator } = useStatAnimation(snapshot);

  return (
    <li className="-mb-5">
      <span>{props.label}</span>
      <h2 className="leading-9">
        {formatter.localiseNumber(Math.round(count))}
        {props.liveIndicator && (
          <span className="relative aspect-square w-3">
            <span className="absolute aspect-square h-4 animate-ping rounded-full bg-primary/75 duration-[1000s]"></span>
            <span className="absolute mt-0.5 ml-0.5 aspect-square w-3 rounded-full bg-primary opacity-80"></span>
          </span>
        )}
      </h2>
      <p className="mt-0 ml-[-12px] inline-flex scale-90 text-neutral-500">
        <MdOutlineArrowRightAlt className="-rotate-90" />
        <span className="mr-1 font-bold text-inherit">
          {formatter.localiseNumber(Math.round(indicator))}
        </span>
        in the last hour
      </p>
    </li>
  );
};

const totalStatsLabels = {
  artists: 'Artists',
  albums: 'Albums',
  tracks: 'Tracks',
  users: 'Users',
  plusUsers: 'Plus Users',
  streams: 'Streams',
};

export const TotalStats: FC = () => {
  const api = useApi();
  const [snapshots, setSnapshots] = useState<DatabaseSize | null>(null);

  useEffect(() => {
    api.stats.databaseSize().then((size) => {
      setSnapshots(size);
    });
  }, []);

  // THE RETURNED VALUE FROM THE API IS "null" INSTEAD OF null
  if (!snapshots || typeof snapshots !== 'object')
    return (
      <div className="flex h-72 w-full items-center justify-center text-neutral-400">
        Total stats currently unavailable
      </div>
    );

  return (
    <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6">
      {Object.entries(snapshots).map(([key, snapshot]) => (
        <TotalStatsItem
          key={key}
          label={totalStatsLabels[key as keyof DatabaseSize]}
          snapshot={snapshot}
          liveIndicator={key === 'streams'}
        />
      ))}
    </ul>
  );
};
