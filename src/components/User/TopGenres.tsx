import { useApi, useAuth } from '@/hooks';
import type { UserPublic, Range, TopGenre } from '@statsfm/statsfm.js';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, type FC, useState } from 'react';
import { event } from 'nextjs-google-analytics';
import { ChipGroup, Chip } from '../Chip';
import Scope from '../PrivacyScope';
import { Section } from '../Section';
import { ranges } from './utils';

export const TopGenres: FC<{
  range: Range;
  userProfile: UserPublic;
}> = ({ userProfile, range }) => {
  const api = useApi();
  const { user: currentUser } = useAuth();
  const [topGenres, setTopGenres] = useState<TopGenre[]>([]);

  useEffect(() => {
    setTopGenres([]);
    api.users
      .topGenres(userProfile.id, { range })
      .then(setTopGenres)
      .catch(() => []);
  }, [range, userProfile]);

  const isCurrentUser = currentUser?.id === userProfile.id;

  return (
    <Section
      title="Top genres"
      description={`${
        isCurrentUser ? 'Your' : `${userProfile.displayName}'s`
      } top genres ${ranges[range]}`}
      scope="topGenres"
    >
      <Scope value="topGenres">
        <ChipGroup
          className={clsx(topGenres.length === 0 && '!overflow-x-hidden')}
        >
          {topGenres?.length > 0
            ? topGenres.map((genre, i) => (
                <Chip key={i}>
                  <Link legacyBehavior href={`/genre/${genre.genre.tag}`}>
                    <a onClick={() => event('USER_top_genre_click')}>
                      {genre.genre.tag}
                    </a>
                  </Link>
                </Chip>
              ))
            : Array(8)
                .fill(null)
                .map((_v, i) => (
                  <Chip
                    className="shrink-0 animate-pulse text-transparent"
                    key={i}
                  >
                    {i.toString().repeat(i + (10 % 17))}
                  </Chip>
                ))}
        </ChipGroup>
      </Scope>
    </Section>
  );
};
