import { useState, type FC, useEffect } from 'react';
import {
  OrderBySetting,
  type Artist,
  type Album,
  type TopAlbum,
} from '@statsfm/statsfm.js';
import { useApi, useAuth } from '@/hooks';
import clsx from 'clsx';
import { event } from 'nextjs-google-analytics';
import { Carousel } from '@/components/Carousel';
import { AlbumCard, AlbumCardSkeleton } from '@/components/Album/AlbumCard';
import {
  Section,
  SectionToolbarCarouselNavigation,
  SectionToolbarGridMode,
  SectionToolbarUserMode,
} from '@/components/Section';

type Props = {
  artist: Artist;
};

export const ArtistTopAlbums: FC<Props> = ({ artist }) => {
  const [topAlbums, setTopAlbums] = useState<Album[]>([]);
  const [ownTopAlbums, setOwnTopAlbums] = useState<TopAlbum[]>([]);
  const [showOwnTopAlbums, setShowOnTopAlbums] = useState(false);
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
      setTopAlbums(await api.artists.albums(artist.id).catch(() => []));
      if (user && isEligible)
        setOwnTopAlbums(
          await api.users
            .topAlbumsFromArtist(user.id, artist.id)
            .catch(() => [])
        );
      setLoading(false);
    })();
  }, [artist.id]);

  const normalTopTracks =
    !loading && topAlbums.length > 0
      ? topAlbums.map((item) => (
          <Carousel.Item
            key={item.id}
            onClick={() =>
              event('ARTIST_top_album_click', {
                ownTopTracks: showOwnTopAlbums,
                gridmodeOn: !gridMode,
              })
            }
          >
            <div className="h-[276px]">
              <AlbumCard album={item} />
            </div>
          </Carousel.Item>
        ))
      : Array(10)
          .fill(null)
          .map(() => (
            <Carousel.Item key={(Math.random() + 1).toString(36).substring(7)}>
              <AlbumCardSkeleton />
            </Carousel.Item>
          ));

  return (
    <Carousel>
      <Section
        title={`${showOwnTopAlbums ? 'Your top' : 'Top'} albums`}
        description={`${showOwnTopAlbums ? 'Your top' : 'Top'} albums of ${
          artist.name
        }`}
        toolbar={
          <div
            className={clsx(
              'flex gap-1',
              loading ? 'pointer-events-none opacity-30' : ''
            )}
          >
            {isEligible && (
              <SectionToolbarUserMode
                callback={(data) => {
                  setShowOnTopAlbums(data);
                }}
              />
            )}
            <SectionToolbarGridMode
              callback={(gridmode) => {
                event('ARTIST_top_album_grid', {
                  ownTopAlbums: showOwnTopAlbums,
                  gridmodeOn: !gridmode,
                });
                setGridMode(!gridmode);
                return !gridmode;
              }}
            />
            <div
              className={clsx(gridMode ? 'pointer-events-none opacity-30' : '')}
            >
              <SectionToolbarCarouselNavigation
                callback={() =>
                  event('ARTIST_top_album_previous', {
                    ownTopAlbums: showOwnTopAlbums,
                  })
                }
              />
              <SectionToolbarCarouselNavigation
                next
                callback={() =>
                  event('ARTIST_top_album_next', {
                    ownTopAlbums: showOwnTopAlbums,
                  })
                }
              />
            </div>
          </div>
        }
      >
        <Carousel.Items>
          {!loading && showOwnTopAlbums && isEligible && ownTopAlbums.length > 0
            ? ownTopAlbums.map((item, i) => (
                <Carousel.Item
                  key={item.album.id}
                  onClick={() =>
                    event('ARTIST_top_album_click', {
                      ownTopAlbums: showOwnTopAlbums,
                      gridmodeOn: !gridMode,
                    })
                  }
                >
                  <div className="h-[276px]">
                    <AlbumCard
                      album={item.album}
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
