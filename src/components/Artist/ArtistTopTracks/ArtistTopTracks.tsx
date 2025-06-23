import { useState, type FC, useEffect } from 'react';
import {
  OrderBySetting,
  type Artist,
  type TopTrack,
  type Track,
} from '@/utils/statsfm';
import { useApi, useAuth } from '@/hooks';
import clsx from 'clsx';
import {
  Section,
  SectionToolbarCarouselNavigation,
  SectionToolbarGridMode,
  SectionToolbarUserMode,
} from '@/components/Section';
import { Carousel } from '@/components/Carousel';
import { TrackCard, TrackCardSkeleton } from '@/components/Track';

type Props = {
  artist: Artist;
};

export const ArtistTopTracks: FC<Props> = ({ artist }) => {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [ownTopTracks, setOwnTopTracks] = useState<TopTrack[]>([]);
  const [showOwnTopTracks, setShowOnTopTracks] = useState(false);
  const [gridMode, setGridMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const { user } = useAuth();
  const isEligible = user
    ? user.isPlus &&
      user.hasImported &&
      user.orderBy !== OrderBySetting.PLATFORM
    : false;

  useEffect(() => {
    (async () => {
      setLoading(true);
      setTopTracks(await api.artists.tracks(artist.id).catch(() => []));
      if (user && isEligible)
        setOwnTopTracks(
          await api.users
            .topTracksFromArtist(user.id, artist.id)
            .catch(() => []),
        );
      setLoading(false);
    })();
  }, [artist.id]);

  const normalTopTracks =
    !loading && topTracks.length > 0
      ? topTracks.map((item) => (
          <Carousel.Item key={item.id}>
            <div className="h-[276px]">
              <TrackCard track={item} />
            </div>
          </Carousel.Item>
        ))
      : Array(10)
          .fill(null)
          .map(() => (
            <Carousel.Item key={(Math.random() + 1).toString(36).substring(7)}>
              <TrackCardSkeleton />
            </Carousel.Item>
          ));

  return (
    <Carousel>
      <Section
        title={`${showOwnTopTracks ? 'Your top' : 'Top'} tracks`}
        description={`${showOwnTopTracks ? 'Your top' : 'Top'} tracks of ${
          artist.name
        }`}
        toolbar={
          <div
            className={clsx(
              'flex gap-1',
              loading ? 'pointer-events-none opacity-30' : '',
            )}
          >
            {isEligible && (
              <SectionToolbarUserMode
                callback={(data) => {
                  setShowOnTopTracks(data);
                }}
              />
            )}
            <SectionToolbarGridMode
              callback={(gridmode) => {
                setGridMode(!gridmode);
                return !gridmode;
              }}
            />
            <div
              className={clsx(gridMode ? 'pointer-events-none opacity-30' : '')}
            >
              <SectionToolbarCarouselNavigation />
              <SectionToolbarCarouselNavigation next />
            </div>
          </div>
        }
      >
        <Carousel.Items>
          {!loading && showOwnTopTracks && isEligible && ownTopTracks.length > 0
            ? ownTopTracks.map((item, i) => (
                <Carousel.Item key={item.track.id}>
                  <div className="h-[276px]">
                    <TrackCard
                      track={item.track}
                      streams={item.streams}
                      position={i + 1}
                      playedMs={item.playedMs}
                    />
                  </div>
                </Carousel.Item>
              ))
            : normalTopTracks}
        </Carousel.Items>
      </Section>
    </Carousel>
  );
};
