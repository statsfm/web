import type { GetServerSideProps, NextPage } from 'next';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type * as statsfm from '@/utils/statsfm';
import { AlbumCard } from '@/components/Album';
import { Carousel } from '@/components/Carousel';
import { Image } from '@/components/Image';
import { useApi, useAuth } from '@/hooks';
import { ArtistList } from '@/components/Artist';
import { Container } from '@/components/Container';
import { RecentStreams } from '@/components/RecentStreams';
import {
  SectionToolbarCarouselNavigation,
  Section,
} from '@/components/Section';
import { StatsCardContainer } from '@/components/Stats';

import { Title } from '@/components/Title';
import { useScrollPercentage } from '@/hooks/use-scroll-percentage';
import dayjs from '@/utils/dayjs';
import formatter from '@/utils/formatter';
import { fetchUser, getApiInstance, type SSRProps } from '@/utils/ssrUtils';
import {
  Chart as ChartJS,
  Filler,
  LineElement,
  PointElement,
  RadialLinearScale,
} from 'chart.js';
import Head from 'next/head';
import { event } from 'nextjs-google-analytics';
import { Radar } from 'react-chartjs-2';
import { AppleMusicLink, SpotifyLink } from '@/components/SocialLink';
import { TopListeners } from '@/components/TopListeners';
import { MdHearingDisabled } from 'react-icons/md';

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
  return notes[key] ?? '-';
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

  const [audioFeatures, setAudioFeatures] = useState<statsfm.AudioFeatures>();
  const [recentStreams, setRecentStreams] = useState<statsfm.Stream[] | null>(
    null,
  );
  const [trackStats, setTrackStats] = useState<statsfm.StreamStats | null>(
    null,
  );

  const omittedAudioFeatures = useMemo(() => {
    return audioFeatures ? omitAudioFeatures(audioFeatures) : undefined;
  }, [audioFeatures]);

  const trackStatsResult = useMemo(() => {
    if (!user || !trackStats) return null;

    const duration = `${formatter.formatMinutes(trackStats.durationMs)}m`;
    const count = `${formatter.localiseNumber(trackStats.count)}x`;
    return { duration, count };
  }, [user, trackStats]);

  useEffect(() => {
    (async () => {
      if (track.externalIds.spotify && track.externalIds.spotify.length > 0) {
        setAudioFeatures(
          await api.tracks.audioFeature(track.externalIds.spotify![0]!),
        );
      }
    })();
  }, [track]);

  useEffect(() => {
    if (user) {
      api.users
        .trackStreams(user.customId, track.id)
        .then((res) => setRecentStreams(res))
        .catch(() => setRecentStreams([]));

      api.users
        .trackStats(user.customId, track.id)
        .then((res) => setTrackStats(res))
        .catch(() => setTrackStats(null));
    }
  }, [track, user]);

  const trackStatsCards = useMemo(() => {
    return [
      {
        label: 'total times streamed',
        value: trackStatsResult?.count ?? '-',
        loading: !trackStatsResult,
        loginRequired: true,
      },
      {
        label: 'total minutes streamed',
        value: trackStatsResult?.duration ?? '-',
        loading: !trackStatsResult,
        loginRequired: true,
      },
      {
        label: '0-10 popularity',
        value: formatter.formatPopularity(track.spotifyPopularity),
      },
      {
        label: 'track length',
        value: dayjs.duration(track.durationMs).format('m:ss'),
      },
    ];
  }, [trackStatsResult, track]);

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
              <div className="mt-2 flex flex-row items-center gap-2">
                {(track.externalIds.spotify ?? []).length > 0 && (
                  <SpotifyLink
                    path={`/track/${track.externalIds.spotify![0]}`}
                  />
                )}
                {(track.externalIds.appleMusic ?? []).length > 0 && (
                  <AppleMusicLink
                    path={`/${user?.country.toLowerCase() ?? 'us'}/song/${
                      track.externalIds.appleMusic![0]
                    }`}
                  />
                )}
              </div>
            </div>
          </section>
        </Container>
      </div>

      <Container className="mt-8">
        <StatsCardContainer stats={trackStatsCards} />
        <Carousel>
          <Section
            title="Appears on"
            description={`Albums featuring ${track.name}`}
            toolbar={
              <div className="flex gap-1">
                <SectionToolbarCarouselNavigation
                  callback={() => event('TRACK_album_previous')}
                />
                <SectionToolbarCarouselNavigation
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

        <TopListeners type="TRACK" data={track} />

        <Section
          title="Audio features"
          {...(audioFeatures
            ? {
                description: 'Audio features of the track',
                className: 'grid grid-cols-1 gap-12 lg:grid-cols-2',
              }
            : {})}
        >
          {audioFeatures ? (
            <>
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
                    value={keyToNote(audioFeatures?.key ?? -1)}
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
                        ? `${formatter.localiseNumber(
                            audioFeatures?.time_signature,
                          )}/4`
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
            </>
          ) : (
            <div className="grid w-full place-items-center py-20">
              <MdHearingDisabled />
              <p className="m-0 text-text-grey">
                No audio features available for this track
              </p>
            </div>
          )}
        </Section>

        {user && (
          <Section
            title="Recent streams"
            description="Your recently played tracks"
          >
            {({ headerRef }) => (
              <RecentStreams
                headerRef={headerRef}
                streams={recentStreams ?? []}
                loading={recentStreams === null}
                track={track}
              />
            )}
          </Section>
        )}
      </Container>
    </>
  );
};

export default Track;
