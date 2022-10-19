import type { GetServerSideProps, NextPage } from 'next';
import type { FC } from 'react';
import React, { useMemo, useEffect, useState } from 'react';

import type * as statsfm from '@statsfm/statsfm.js';

import { Image } from '@/components/Image';
import { Section } from '@/components/Section';
import { Carousel } from '@/components/Carousel';
import { TopListenerCardSkeleton } from '@/components/TopListenerCard';
import TopListenerCard from '@/components/TopListenerCard/TopListenerCard';
import { AlbumCard } from '@/components/AlbumCard';

import { useApi, useAuth } from '@/hooks';

import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { RecentStreams } from '@/components/RecentStreams';
import { SectionToolbarCarouselNavigationButton } from '@/components/SectionToolbarCarouselNavigationButton';
import { Container } from '@/components/Container';
import { ArtistList } from '@/components/ArtistList';
import { Title } from '@/components/Title';
import { SectionToolbarInfoMenu } from '@/components/SectionToolbarInfoMenu';
import { supportUrls } from '@/utils/supportUrls';
import Head from 'next/head';
import { StatsCard } from '@/components/StatsCard';
import dayjs from '@/utils/dayjs';
import { SpotifyIcon } from '@/components/Icons';
import { useScrollPercentage } from '@/hooks/use-scroll-percentage';
import { event } from 'nextjs-google-analytics';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser, getApiInstance } from '@/utils/ssrUtils';

const AudioFeaturesRadarChart = ({
  acousticness,
  danceability,
  energy,
  instrumentalness,
  liveness,
  speechiness,
  valence,
}: Partial<statsfm.AudioFeatures>) => {
  const config = {
    data: {
      labels: [
        'Acoustic',
        'Danceable',
        'Energetic',
        'Instrumental',
        'Lively',
        'Speechful',
        'Valence',
      ],
      datasets: [
        {
          label: '',
          data: [
            acousticness,
            danceability,
            energy,
            instrumentalness,
            liveness,
            speechiness,
            valence,
          ],
          fill: true,
          backgroundColor: 'rgb(30, 215, 96, 0.2)',
          borderColor: 'rgb(30, 215, 96)',
          pointBackgroundColor: 'rgb(30, 215, 96)',
        },
      ],
    },
    options: {
      scales: {
        r: {
          grid: {
            circular: true,
            color: 'rgb(23, 26, 32)',
          },
          beginAtZero: true,
          angleLines: {
            color: 'rgb(23, 26, 32)',
          },
          pointLabels: {
            color: 'rgb(163, 163, 163)',
            font: {
              size: 12,
              weight: 'bold',
            },
          },
          ticks: {
            display: false,
            stepSize: 0.25,
          },
        },
      },
      elements: {
        line: {
          borderWidth: 3,
        },
      },
    },
  };

  ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler);

  return <Radar {...config} />;
};

type Props = SSRProps & {
  track: statsfm.Track;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const api = getApiInstance();
  const id = ctx.params?.id?.toString();

  if (!id) {
    throw new Error('no param id recieved');
  }

  let track;
  try {
    track = await api.tracks.get(parseInt(id, 10));
  } catch (e) {
    return { notFound: true };
  }

  const user = await fetchUser(ctx);

  return {
    props: {
      track,
      user,
    },
  };
};

const omitAudioFeatures = ({
  danceability,
  energy,
  loudness,
  speechiness,
  acousticness,
  instrumentalness,
  liveness,
  valence,
}: statsfm.AudioFeatures) => ({
  danceability,
  energy,
  loudness,
  speechiness,
  acousticness,
  instrumentalness,
  liveness,
  valence,
});

const keyToNote = (key: number): string => {
  const notes = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];
  return notes[key] || '-';
};

const FeatureCard: FC<{ feature: string; value: string }> = ({
  feature,
  value,
}) => (
  <li className="rounded-2xl bg-foreground p-5 text-center text-white">
    <h1 className="text-primary">{value}</h1>
    <span>{feature}</span>
  </li>
);

const Track: NextPage<Props> = ({ track }) => {
  const api = useApi();
  const { user } = useAuth();
  useScrollPercentage(30, () => event('TRACK_scroll_30'));

  const [topListeners, setTopListeners] = useState<statsfm.TopUser[]>([]);
  const [audioFeatures, setAudioFeatures] = useState<statsfm.AudioFeatures>();
  const [recentStreams, setRecentStreams] = useState<statsfm.Stream[] | null>(
    null
  );
  const [trackStats, setTrackStats] = useState<statsfm.StreamStats | null>(
    null
  );

  const omittedAudioFeatures = useMemo(() => {
    return audioFeatures ? omitAudioFeatures(audioFeatures) : undefined;
  }, [audioFeatures]);

  const trackStatsResult = useMemo(() => {
    if (!user || !trackStats) return ['-', '-'];

    const duration = `${Math.floor(trackStats.durationMs / 1000 / 60)}m`;
    const count = `${trackStats.count.toLocaleString()}x`;
    return [duration, count];
  }, [user, trackStats]);

  useEffect(() => {
    (async () => {
      setTopListeners(
        await api.http
          .get<statsfm.TopUser[]>(`/tracks/${track.id}/top/listeners`)
          .then((res) => res.data.items)
      );

      setAudioFeatures(
        await api.tracks.audioFeature(track.externalIds.spotify![0] ?? '')
      );
    })();
  }, [track]);

  useEffect(() => {
    if (user) {
      api.users
        .trackStreams(user?.customId, track.id)
        .then((res) => setRecentStreams(res));

      api.users
        .trackStats(user?.customId, track.id)
        .then((res) => setTrackStats(res));
    }
  }, [track, user]);

  return (
    <>
      <Title>{`${track.name}, artists, stats and more`}</Title>
      <Head>
        <meta property="og:image" content={track.albums[0]?.image} />
        <meta property="og:image:alt" content={`${track.name}'s album cover`} />
        <meta property="og:image:width" content="240" />
        <meta property="og:image:height" content="240" />
        <meta
          property="og:description"
          content={`View ${track.name} on stats.fm`}
        />
        <meta property="twitter:card" content="summary" />
      </Head>

      <div className="bg-foreground pt-20">
        <Container>
          <section className="flex flex-col items-center gap-5 pt-24 pb-10 md:flex-row">
            <div className="shrink-0">
              {track.albums[0]?.image && (
                <Image
                  src={track.albums[0].image}
                  alt={track.name}
                  width={192}
                  height={192}
                />
              )}
            </div>

            <div className="flex flex-col justify-end overflow-hidden">
              <span className="text-center text-lg md:text-left">
                <ArtistList artists={track.artists} />
              </span>
              <h1
                className="inline-block truncate text-center font-extrabold md:text-left"
                title={track.name}
              >
                {track.name}
              </h1>
              <div className="mt-2 flex flex-row">
                <a
                  href={`https://open.spotify.com/track/${
                    track.externalIds.spotify![0]
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SpotifyIcon className="h-7 w-7" />
                </a>
              </div>
            </div>
          </section>
        </Container>
      </div>

      <Container className="mt-8">
        {/* TODO: make a reusable component out of this */}
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <li>
            <StatsCard
              label={user ? 'total times streamed' : 'login to see your stats'}
              value={trackStatsResult[1]!}
            />
          </li>
          <li>
            <StatsCard
              label={
                user ? 'total minutes streamed' : 'login to see your stats'
              }
              value={trackStatsResult[0]!}
            />
          </li>
          <li>
            <StatsCard
              label="0-10 popularity"
              value={(track.spotifyPopularity / 10).toLocaleString('eu')}
            />
          </li>
          <li>
            <StatsCard
              label="track length"
              value={dayjs.duration(track.durationMs).format('m:ss')}
            />
          </li>
        </ul>
        <Carousel>
          <Section
            title="Appears on"
            description={`Albums featuring ${track.name}`}
            toolbar={
              <div className="flex gap-1">
                <SectionToolbarCarouselNavigationButton
                  callback={() => event('TRACK_album_previous')}
                />
                <SectionToolbarCarouselNavigationButton
                  next
                  callback={() => event('TRACK_album_next')}
                />
              </div>
            }
          >
            <Carousel.Items>
              {track.albums.map((item, i) => (
                <Carousel.Item
                  key={i}
                  className="w-max"
                  onClick={() => event('TRACK_album_click')}
                >
                  <AlbumCard album={item} />
                </Carousel.Item>
              ))}
            </Carousel.Items>
          </Section>
        </Carousel>

        <Carousel>
          <Section
            title="Top listeners"
            description={`People who listen a lot to ${track.name}`}
            toolbar={
              <div className="flex gap-1">
                <SectionToolbarCarouselNavigationButton
                  callback={() => event('TRACK_listener_previous')}
                />
                <SectionToolbarCarouselNavigationButton
                  next
                  callback={() => event('TRACK_listener_next')}
                />
                <SectionToolbarInfoMenu
                  description="Learn more about what top listeners are and how they're calculated"
                  link={supportUrls.artist.top_listeners}
                />
              </div>
            }
          >
            <Carousel.Items>
              {topListeners.length > 0
                ? topListeners.map((item, i) => (
                    <Carousel.Item
                      key={i}
                      onClick={() => event('TRACK_listener_click')}
                    >
                      <TopListenerCard {...item} />
                    </Carousel.Item>
                  ))
                : Array(10)
                    .fill(null)
                    .map((_n, i) => (
                      <Carousel.Item key={i}>
                        <TopListenerCardSkeleton />
                      </Carousel.Item>
                    ))}
            </Carousel.Items>
          </Section>
        </Carousel>

        <Section
          title="Audio features"
          className="grid grid-cols-1 gap-12 lg:grid-cols-2"
        >
          <div className="flex flex-col">
            <ul className="mt-8 grid w-full grid-cols-2 items-stretch gap-4 gap-y-5">
              {omittedAudioFeatures &&
                Object.entries(omittedAudioFeatures).map((feature, i) => (
                  <li key={i} className="flex flex-col text-neutral-300">
                    <span className="mb-1 capitalize">{feature[0]}</span>
                    <div className="h-2 appearance-none overflow-hidden rounded-full bg-foreground">
                      <span
                        className="block h-full rounded-full bg-primary"
                        style={{ width: `${feature[1] * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
            </ul>
            <ul className="mt-12 grid w-full grid-cols-2 gap-4 lg:grid-cols-3">
              <FeatureCard
                feature="Loudness"
                value={audioFeatures?.loudness.toFixed(1) ?? '-'}
              />
              <FeatureCard
                feature="Key"
                value={keyToNote(audioFeatures?.key || -1)}
              />

              <FeatureCard
                feature="Mode"
                value={
                  // eslint-disable-next-line no-nested-ternary
                  audioFeatures?.mode !== undefined
                    ? audioFeatures?.mode === 0
                      ? 'Minor'
                      : 'Major'
                    : '-'
                }
              />
              <FeatureCard
                feature="Time signature"
                value={
                  audioFeatures?.time_signature
                    ? `${audioFeatures?.time_signature.toLocaleString('en')}/4`
                    : '-'
                }
              />
              <FeatureCard
                feature="BPM"
                value={audioFeatures?.tempo.toFixed(1) ?? '-'}
              />
            </ul>
          </div>
          <div className="mx-auto w-full max-w-lg lg:max-w-none">
            <AudioFeaturesRadarChart {...audioFeatures} />
          </div>
        </Section>

        <Section
          title="Recent streams"
          description="Your recently played tracks"
        >
          {({ headerRef }) => (
            <RecentStreams
              headerRef={headerRef}
              streams={recentStreams || []}
              track={track}
            />
          )}
        </Section>
      </Container>
    </>
  );
};

export default Track;
