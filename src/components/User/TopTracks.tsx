import { useApi, useAuth } from '@/hooks';
import formatter from '@/utils/formatter';
import type { TopTrack, UserPublic } from '@/utils/statsfm';
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
import { TrackCard, TrackCardSkeleton } from '../Track';
import {
  getTimeframeOptions,
  getTimeframeText,
  type TimeframeSelection,
} from './utils';
import { NotEnoughData } from './NotEnoughData';

export const TopTracks: FC<{
  timeframe: TimeframeSelection;
  trackRef: RefObject<HTMLElement>;
  userProfile: UserPublic;
  activeCarousel: UserPageCarouselsWithGrid | null;
}> = ({ trackRef, userProfile, timeframe, activeCarousel }) => {
  const api = useApi();
  const { user: currentUser } = useAuth();
  const [topTracks, setTopTracks] = useState<TopTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTopTracks([]);
    api.users
      .topTracks(userProfile.id, getTimeframeOptions(timeframe))
      .then(setTopTracks)
      .catch(() => [])
      .finally(() => setLoading(false));
  }, [timeframe, userProfile]);

  const gridModeCallback = (gridMode: boolean) => {
    let newUrl = `/${userProfile.customId ?? userProfile.id}`;
    if (!gridMode) newUrl += `/tracks`;

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
    <Carousel gridMode={activeCarousel === 'tracks'} itemHeight={276}>
      <Section
        ref={trackRef}
        title="Top tracks"
        description={`${
          isCurrentUser ? 'Your' : formatter.nounify(userProfile.displayName)
        } top tracks ${getTimeframeText(timeframe)}`}
        scope="topTracks"
        toolbar={
          <div className="flex gap-1">
            {topTracks?.length > 0 && (
              <>
                <SectionToolbarGridMode callback={gridModeCallback} />
                <SectionToolbarCarouselNavigation
                  callback={() => event('USER_top_tracks_previous')}
                />
                <SectionToolbarCarouselNavigation
                  next
                  callback={() => event('USER_top_tracks_next')}
                />
              </>
            )}
            <SectionToolbarInfoMenu>
              <ShareMenuItem
                path={`/${userProfile.customId ?? userProfile.id}/tracks`}
              />
            </SectionToolbarInfoMenu>
          </div>
        }
      >
        <Scope value="topTracks">
          <NotEnoughData data={topTracks} loading={loading}>
            <Carousel.Items>
              {topTracks?.length > 0
                ? topTracks
                    .filter((topTrack) => topTrack.track?.id)
                    .filter(
                      (topTrack, i, arr) =>
                        arr.findIndex(
                          (t) => t.track?.id === topTrack.track?.id
                        ) === i
                    )
                    .map((item) => (
                      <Carousel.Item
                        key={item.track.id}
                        onClick={() => event('USER_top_track_click')}
                      >
                        <TrackCard {...item} />
                      </Carousel.Item>
                    ))
                : Array(10)
                    .fill(null)
                    .map((_n, i) => (
                      <Carousel.Item key={i}>
                        <TrackCardSkeleton />
                      </Carousel.Item>
                    ))}
            </Carousel.Items>
          </NotEnoughData>
        </Scope>
      </Section>
    </Carousel>
  );
};
