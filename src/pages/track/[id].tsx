import type { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';

import * as statsfm from '@statsfm/statsfm.js';

import { Image } from '@/components/Image';
import Head from 'next/head';
import { Section } from '@/components/Section';
import { Carousel } from '@/components/Carousel';
import { TopListenerCardSkeleton } from '@/components/TopListenerCard';
import TopListenerCard from '@/components/TopListenerCard/TopListenerCard';
import { AlbumCard } from '@/components/AlbumCard';

import { useApi } from '@/hooks';

import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { RecentStreams } from '@/components/RecentStreams';
import { MdMusicOff } from 'react-icons/md';
import { SectionToolbarCarouselNavigationButton } from '@/components/SectionToolbarCarouselNavigationButton';
import { Container } from '@/components/Container';

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

interface Props {
  track: statsfm.Track;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const api = new statsfm.Api();

  const id = ctx.params?.id?.toString();

  if (!id) {
    throw new Error('no param id recieved');
  }

  const track = await api.tracks.get(parseInt(id, 10));

  return {
    props: {
      track,
    },
  };
};

// const omitAudioFeatures = ({
//   danceability,
//   energy,
//   loudness,
//   speechiness,
//   acousticness,
//   instrumentalness,
//   liveness,
//   valence,
// }: statsfm.AudioFeatures) => ({
//   danceability,
//   energy,
//   loudness,
//   speechiness,
//   acousticness,
//   instrumentalness,
//   liveness,
//   valence,
// });

const Track: NextPage<Props> = ({ track }) => {
  const api = useApi();

  // const [stats, setStats] = useState<statsfm.StreamStats>();
  const [topListeners, setTopListeners] = useState<statsfm.TopUser[]>([]);
  const [audioFeatures, setAudioFeatures] = useState<statsfm.AudioFeatures>();
  // const audioFeaturesOnly = omitAudioFeatures(audioFeatures);

  const [recentStreams, setRecentStreams] = useState<statsfm.Stream[] | null>(
    null
  );

  useEffect(() => {
    (async () => {
      // const stats = await api.users.trackStats('me', track.id);

      setTopListeners(
        await api.http
          .get<statsfm.TopUser[]>(`/tracks/${track.id}/top/listeners`)
          .then((res) => res.data.items)
      );
      // TODO: fix
      setAudioFeatures(
        await api.tracks.audioFeature(track.externalIds.spotify![0] ?? '')
      );
      setRecentStreams(await api.users.trackStreams('martijn', track.id));
    })();
  }, []);

  return (
    <>
      <Head>
        <title>{track.name}</title>
      </Head>

      <div className="bg-bodySecundary pt-20">
        <Container>
          <section className="flex flex-col items-center gap-5 pt-24 pb-10 md:flex-row">
            {track.albums[0]?.image && (
              <Image
                src={track.albums[0].image}
                alt={track.name}
                width={192}
                height={192}
              />
            )}

            <div className="flex flex-col justify-end">
              <span className="text-center text-lg md:text-left">
                {track.artists.map((artist) => artist.name).join(', ')}
              </span>
              <h1 className="text-center font-extrabold md:text-left">
                {track.name}
              </h1>
            </div>
          </section>
        </Container>
      </div>

      <Container className="mt-8">
        <Carousel slide={6}>
          <Section
            title="Appears on"
            description={`Albums featuring ${track.name}`}
            toolbar={
              <div className="flex gap-1">
                <SectionToolbarCarouselNavigationButton />
                <SectionToolbarCarouselNavigationButton next />
              </div>
            }
          >
            <Carousel.Items>
              {track.albums.map((item, i) => (
                <Carousel.Item key={i} className="w-max">
                  <AlbumCard album={item} />
                </Carousel.Item>
              ))}
            </Carousel.Items>
          </Section>
        </Carousel>

        <Carousel slide={6}>
          <Section
            title="Top listeners"
            description={`People who listen a lot to ${track.name}`}
            toolbar={
              <div className="flex gap-1">
                <SectionToolbarCarouselNavigationButton />
                <SectionToolbarCarouselNavigationButton next />
              </div>
            }
          >
            <Carousel.Items>
              {topListeners.length > 0
                ? topListeners.map((item, i) => (
                    <Carousel.Item key={i}>
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

        <Section title="Audio features" className="grid grid-cols-2">
          <div>
            {/* <ul className="grid w-full grid-cols-2 items-stretch gap-4">
            {audioFeaturesOnly &&
              Object.entries(audioFeaturesOnly).map((feature, i) => (
                <li key={i} className="flex flex-col">
                  <label>{feature[0]}</label>
                  <div className="h-2 appearance-none rounded-full bg-foreground">
                    <span
                      className="h-full bg-primary"
                      style={{ width: `${feature[1] * 100}%` }}
                    ></span>
                  </div>
                </li>
              ))}
          </ul> */}
          </div>
          <div>
            <AudioFeaturesRadarChart {...audioFeatures} />
          </div>
        </Section>

        <Section
          title="Recent streams"
          description="Your recently played tracks"
        >
          {recentStreams ? (
            <RecentStreams streams={recentStreams} track={track} />
          ) : (
            <div className="grid w-full place-items-center">
              <MdMusicOff />

              <p className="m-0 text-text-grey">
                Looks like you haven&apos;t listened to {track.name} yet
              </p>
            </div>
          )}
        </Section>
      </Container>
    </>
  );
};

export default Track;
