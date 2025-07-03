import { useApi, useAuth } from '@/hooks';
import formatter from '@/utils/formatter';
import type { TopArtist, UserPublic } from '@/utils/statsfm';
import { useState, type FC, useEffect, type RefObject } from 'react';
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
import {
  getTimeframeOptions,
  getTimeframeQueryParam,
  getTimeframeText,
  type TimeframeSelection,
} from './utils';
import { NotEnoughData } from './NotEnoughData';

export const TopArtists: FC<{
  timeframe: TimeframeSelection;
  artistRef: RefObject<HTMLElement>;
  userProfile: UserPublic;
  activeCarousel: boolean;
}> = ({ artistRef, userProfile, timeframe, activeCarousel }) => {
  const api = useApi();
  const { user: currentUser } = useAuth();
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
  const [loading, setLoading] = useState(true);

  const userProfileId = encodeURIComponent(userProfile.id);

  useEffect(() => {
    setTopArtists([]);

    api.users
      .topArtists(userProfileId, getTimeframeOptions(timeframe))
      .then(setTopArtists)
      .catch(() => [])
      .finally(() => setLoading(false));
  }, [timeframe, userProfileId]);

  const gridModeCallback = (gridMode: boolean) => {
    let newUrl = `/${userProfile.customId ?? userProfileId}`;
    if (!gridMode) newUrl += `/artists`;

    // this is some next router weirdness
    // https://github.com/vercel/next.js/discussions/18072#discussioncomment-109059
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      '',
      newUrl,
    );

    return !gridMode;
  };

  const isCurrentUser = currentUser?.id === userProfile.id;

  return (
    <Carousel gridMode={activeCarousel} itemHeight={262}>
      <Section
        ref={artistRef}
        title="Top artists"
        description={`${
          isCurrentUser ? 'Your' : formatter.nounify(userProfile.displayName)
        } top artists ${getTimeframeText(timeframe)}`}
        scope="topArtists"
        toolbar={
          <div className="flex gap-1">
            {topArtists?.length > 0 && (
              <>
                {' '}
                <SectionToolbarGridMode callback={gridModeCallback} />
                <SectionToolbarCarouselNavigation />
                <SectionToolbarCarouselNavigation next />
              </>
            )}
            <SectionToolbarInfoMenu>
              <ShareMenuItem
                // eslint-disable-next-line prettier/prettier
                path={`/${userProfile.customId ?? userProfileId}/artists${getTimeframeQueryParam(timeframe)}`}
              />
            </SectionToolbarInfoMenu>
          </div>
        }
      >
        <Scope value="topArtists">
          <NotEnoughData data={topArtists} loading={loading}>
            <Carousel.Items>
              {topArtists?.length > 0
                ? topArtists
                    .filter((topArtist) => topArtist.artist?.id)
                    .map((item) => (
                      <Carousel.Item key={item.artist.id}>
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
          </NotEnoughData>
        </Scope>
      </Section>
    </Carousel>
  );
};
