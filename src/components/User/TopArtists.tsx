import { useApi, useAuth } from '@/hooks';
import formatter from '@/utils/formatter';
import type { Range, TopArtist, UserPublic } from '@statsfm/statsfm.js';
import type { RefObject } from 'react';
import { useState, type FC, useEffect } from 'react';
import { event } from 'nextjs-google-analytics';
import type { UserPageCarouselsWithGrid } from '@/utils';
import { Carousel } from '../Carousel';
import Scope from '../PrivacyScope';
import {
  Section,
  SectionToolbarGridMode,
  SectionToolbarCarouselNavigation,
  SectionToolbarInfoMenu,
} from '../Section';
import { ShareMenuItem } from '../ShareMenuItem';
import { ArtistCard, ArtistCardSkeleton } from '../Artist';
import { ranges } from './utils';

export const TopArtists: FC<{
  range: Range;
  artistRef: RefObject<HTMLElement>;
  userProfile: UserPublic;
  activeCarousel: UserPageCarouselsWithGrid | null;
}> = ({ artistRef, userProfile, range, activeCarousel }) => {
  const api = useApi();
  const { user: currentUser } = useAuth();
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);

  useEffect(() => {
    setTopArtists([]);
    api.users.topArtists(userProfile.id, { range }).then(setTopArtists);
  }, [range, userProfile]);

  const gridModeCallback = (gridMode: boolean) => {
    let newUrl = `/${userProfile.customId ?? userProfile.id}`;
    if (!gridMode) newUrl += `/artists`;

    // this is some next router weirdness
    // https://github.com/vercel/next.js/discussions/18072#discussioncomment-109059
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      '',
      newUrl
    );

    return !gridMode;
  };

  const isCurrentUser = currentUser?.id === userProfile.id;

  return (
    <Carousel gridMode={activeCarousel === 'artists'} itemHeight={262}>
      <Section
        ref={artistRef}
        title="Top artists"
        description={`${
          isCurrentUser ? 'Your' : formatter.nounify(userProfile.displayName)
        } top artists ${ranges[range]}`}
        scope="topArtists"
        toolbar={
          <div className="flex gap-1">
            <SectionToolbarGridMode callback={gridModeCallback} />
            <SectionToolbarCarouselNavigation
              callback={() => event('USER_top_artists_previous')}
            />
            <SectionToolbarCarouselNavigation
              next
              callback={() => event('USER_top_artists_next')}
            />
            <SectionToolbarInfoMenu>
              <ShareMenuItem
                path={`/${userProfile.customId ?? userProfile.id}/artists`}
              />
            </SectionToolbarInfoMenu>
          </div>
        }
      >
        <Scope value="topArtists">
          {/* <NotEnoughData data={topArtists}> */}

          <Carousel.Items>
            {topArtists.length > 0
              ? topArtists.map((item) => (
                  <Carousel.Item
                    key={item.artist.id}
                    onClick={() => event('USER_top_artist_click')}
                  >
                    <ArtistCard {...item} />
                  </Carousel.Item>
                ))
              : Array(10)
                  .fill(null)
                  .map((_n, i) => (
                    <Carousel.Item key={i}>
                      <ArtistCardSkeleton />
                    </Carousel.Item>
                  ))}
          </Carousel.Items>
          {/* </NotEnoughData> */}
        </Scope>
      </Section>
    </Carousel>
  );
};
