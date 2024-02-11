import { useApi, useAuth } from '@/hooks';
import formatter from '@/utils/formatter';
import type { TopAlbum, UserPublic } from '@/utils/statsfm';
import type { RefObject } from 'react';
import { useState, type FC, useEffect } from 'react';
import { event } from 'nextjs-google-analytics';
import { Carousel } from '../Carousel';
import Scope from '../PrivacyScope';
import {
  Section,
  SectionToolbarGridMode,
  SectionToolbarCarouselNavigation,
  SectionToolbarInfoMenu,
} from '../Section';
import { ShareMenuItem } from '../ShareMenuItem';
import { AlbumCard, AlbumCardSkeleton } from '../Album';
import {
  type TimeframeSelection,
  getTimeframeOptions,
  getTimeframeText,
} from './utils';
import { NotEnoughData } from './NotEnoughData';

export const TopAlbums: FC<{
  timeframe: TimeframeSelection;
  albumRef: RefObject<HTMLElement>;
  userProfile: UserPublic;
  activeCarousel: boolean;
}> = ({ albumRef, userProfile, timeframe, activeCarousel }) => {
  const api = useApi();
  const { user: currentUser } = useAuth();
  const [topAlbums, setTopAlbums] = useState<TopAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTopAlbums([]);
    api.users
      .topAlbums(userProfile.id, getTimeframeOptions(timeframe))
      .then(setTopAlbums)
      .catch(() => [])
      .finally(() => setLoading(false));
  }, [timeframe, userProfile]);

  const gridModeCallback = (gridMode: boolean) => {
    let newUrl = `/${userProfile.customId ?? userProfile.id}`;
    if (!gridMode) newUrl += `/albums`;

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
    <Carousel gridMode={activeCarousel} itemHeight={255}>
      <Section
        ref={albumRef}
        title="Top albums"
        description={`${
          isCurrentUser ? 'Your' : formatter.nounify(userProfile.displayName)
        } top albums ${getTimeframeText(timeframe)}`}
        scope="topAlbums"
        toolbar={
          <div className="flex gap-1">
            {topAlbums?.length > 0 && (
              <>
                <SectionToolbarGridMode callback={gridModeCallback} />
                <SectionToolbarCarouselNavigation
                  callback={() => event('USER_top_albums_previous')}
                />
                <SectionToolbarCarouselNavigation
                  next
                  callback={() => event('USER_top_albums_next')}
                />
              </>
            )}
            <SectionToolbarInfoMenu>
              <ShareMenuItem
                path={`/${userProfile.customId ?? userProfile.id}/albums`}
              />
            </SectionToolbarInfoMenu>
          </div>
        }
      >
        <Scope value="topAlbums">
          <NotEnoughData data={topAlbums} loading={loading}>
            <Carousel.Items>
              {topAlbums?.length > 0
                ? topAlbums
                    .filter((topAlbum) => topAlbum.album?.id)
                    .map((item) => (
                      <Carousel.Item
                        key={item.album.id}
                        onClick={() => event('USER_top_album_click')}
                      >
                        <AlbumCard {...item} />
                      </Carousel.Item>
                    ))
                : Array(10)
                    .fill(null)
                    .map((_n, i) => (
                      <Carousel.Item key={i}>
                        <AlbumCardSkeleton />
                      </Carousel.Item>
                    ))}
            </Carousel.Items>
          </NotEnoughData>
        </Scope>
      </Section>
    </Carousel>
  );
};
