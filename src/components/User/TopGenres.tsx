import { useApi, useAuth } from '@/hooks';
import type { UserPublic, TopGenre } from '@/utils/statsfm';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, type FC, useState } from 'react';
import { ChipGroup, Chip } from '../Chip';
import Scope from '../PrivacyScope';
import { Section } from '../Section';
import type { TimeframeSelection } from './utils';
import { getTimeframeOptions, getTimeframeText } from './utils';
import { NotEnoughData } from './NotEnoughData';

export const TopGenres: FC<{
  timeframe: TimeframeSelection;
  userProfile: UserPublic;
  topGenresRef: React.RefObject<HTMLElement>;
}> = ({ userProfile, timeframe, topGenresRef: ref }) => {
  const api = useApi();
  const { user: currentUser } = useAuth();
  const [topGenres, setTopGenres] = useState<TopGenre[]>([]);
  const [loading, setLoading] = useState(true);

  const userProfileId = encodeURIComponent(userProfile.id);

  useEffect(() => {
    setTopGenres([]);

    api.users
      .topGenres(userProfileId, getTimeframeOptions(timeframe))
      .then(setTopGenres)
      .catch(() => [])
      .finally(() => setLoading(false));
  }, [timeframe, userProfileId]);

  const isCurrentUser = currentUser?.id === userProfile.id;

  return (
    <Section
      title="Top genres"
      description={`${
        isCurrentUser ? 'Your' : `${userProfile.displayName}'s`
      } top genres ${getTimeframeText(timeframe)}`}
      scope="topGenres"
      ref={ref}
    >
      <Scope value="topGenres">
        <ChipGroup
          className={clsx(topGenres.length === 0 && '!overflow-x-hidden')}
        >
          <NotEnoughData data={topGenres} loading={loading}>
            {topGenres?.length > 0
              ? topGenres.map((genre, i) => (
                  <Chip key={i}>
                    <Link
                      legacyBehavior
                      href={`/genre/${encodeURIComponent(genre.genre.tag)}`}
                    >
                      <a>{genre.genre.tag}</a>
                    </Link>
                  </Chip>
                ))
              : Array(8)
                  .fill(null)
                  .map((_v, i) => (
                    <Chip
                      className="shrink-0 animate-pulse !text-transparent"
                      key={i}
                    >
                      {i.toString().repeat(i + (10 % 17))}
                    </Chip>
                  ))}
          </NotEnoughData>
        </ChipGroup>
      </Scope>
    </Section>
  );
};
