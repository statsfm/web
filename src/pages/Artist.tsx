import { defineComponent, FC, onBeforeMount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import * as statsfm from '@statsfm/statsfm.js';
import dayjs from '~/dayjs';
import { mdiInformation, mdiClockOutline } from '@mdi/js';

// components
import Hero from '~/components/base/Hero.vue';
import { Avatar } from '~/components/base/Avatar';
import { ChipGroup, Chip } from '~/components/base/Chip';
import { Image } from '~/components/base/Image';
import StickyHeader from '~/components/base/StickyHeader.vue';
import Icon from '~/components/base/Icon.vue';
import Button from '~/components/base/Button.vue';
import ArtistNameListRender from '~/components/base/ArtistNameListRender.vue';
import Container from '~/components/layout/Container.vue';

// hooks
import { useApi, useLessMore } from '~/hooks';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Carousel } from '~/components/base/Carousel';
import { RecentStreams } from '~/components/base/RecentStreams';
import { Skeleton } from '~/components/base/Skeleton';

interface Props {
  track: statsfm.Track;
}

const TrackCard: FC<Props> = ({ track }) => (
  <RouterLink to={{ name: 'Track', params: { id: track.id } }}>
    <div class="w-40">
      <div class="min-h-50 aspect-square w-full group-hover:opacity-90">
        <Image src={track.albums[0].image} alt={track.name} />
      </div>
      <div class="mt-2">
        <h4 class="line-clamp-2">{track.name}</h4>
        <ArtistNameListRender artists={track.artists} />
      </div>
    </div>
  </RouterLink>
);

const TrackListRow: FC<{ track: statsfm.Track }> = ({ track }) => (
  <RouterLink to={{ name: 'Track', params: { id: track.id } }}>
    <li class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Image class="w-12" src={track.albums[0].image} />

        <div class="leading-tight">
          <h4>{track.name}</h4>
          <p class="m-0">{track.artists[0].name}</p>
        </div>
      </div>

      <p class="flex gap-2 text-right">
        {dayjs.duration(track.durationMs, 'milliseconds').format('m:ss')}{' '}
        <Icon path={mdiClockOutline} />
      </p>
    </li>
    <hr class="my-3 border-bodySecundary" />
  </RouterLink>
);

const RelatedArtistCard: FC<{ artist: statsfm.Artist }> = ({ artist }) => (
  <RouterLink to={{ name: 'Artist', params: { id: artist.id } }}>
    <div class="flex w-80 items-center gap-2">
      <Avatar name={artist.name} src={artist.image} />
      <div>
        <h4>{artist.name}</h4>
      </div>
    </div>
  </RouterLink>
);

const positions: Record<number, string> = {
  1: 'bg-amber-400/30 text-amber-400',
  2: 'bg-gray-500/30 text-gray-500',
  3: 'bg-yellow-700/30 text-yellow-700'
};

const TopListenerCard = defineComponent<{ listener: statsfm.TopUser }>(({ listener }) => {
  const { t } = useI18n();

  return () => (
    <RouterLink
      to={{ name: 'User', params: { userId: listener.user.customId ?? listener.user.id } }}
    >
      <div class="flex w-40 flex-col items-center">
        <Avatar src={listener.user.image} name={listener.user.displayName} size="3xl">
          <div class="rounded-lg bg-black">
            <span
              class={[
                'rounded-lg bg-bodySecundary px-2 py-1.5 text-lg drop-shadow-lg',
                positions[listener.position]
              ]}
            >
              #{listener.position}
            </span>
          </div>
        </Avatar>

        <h4>{listener.user.displayName}</h4>
        <p class="m-0 text-center line-clamp-2">
          <span>
            {t('minutes', {
              count: dayjs.duration(listener.playedMs!, 'milliseconds').asMinutes().toLocaleString()
            })}
          </span>
          • <span>{t('streams', { count: listener.streams })}</span>
        </p>
      </div>
    </RouterLink>
  );
});

TopListenerCard.props = ['listener'];

const MoreTracks = defineComponent<{ tracks?: statsfm.Track[] }>(({ tracks }) => {
  const { t } = useI18n();
  const { data, toggle, showMore } = useLessMore(tracks!, 10);

  return () => (
    <>
      <StickyHeader>
        <div class="flex flex-col">
          <h2>{t('artist.more_tracks.title')}</h2>
          <p class="my-1">{t('artist.more_tracks.description')}</p>
        </div>
      </StickyHeader>

      <section>
        <ul class="transition-all">
          <li>
            <li class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Skeleton.Image width="48px" height="48px" />

                <div class="flex flex-col gap-2">
                  <Skeleton.Text width="8rem" />
                  <Skeleton.Text width="8rem" />
                </div>
              </div>

              <Skeleton.Text width="4rem" />
            </li>
            <hr class="my-3 border-bodySecundary" />
          </li>
          {data.value.map((track) => (
            <TrackListRow track={track} />
          ))}
        </ul>
        <Button variant="secundary" class="uppercase text-textGrey" onClick={toggle}>
          {showMore.value ? 'show less' : 'show more'}
        </Button>
      </section>
    </>
  );
});

MoreTracks.props = ['tracks'];

export default defineComponent(() => {
  const api = useApi();
  const route = useRoute();
  const { t } = useI18n();

  const artist = ref<statsfm.Artist>();
  const tracks = ref<statsfm.Track[]>();
  const related = ref<statsfm.Artist[]>();
  const topListeners = ref<statsfm.TopUser[]>();
  const recentStreams = ref<statsfm.Stream[]>();

  onBeforeMount(async () => {
    const id = parseInt(route.params.id.toString());

    artist.value = await api.artists.get(id);
    tracks.value = await api.artists.tracks(id);
    related.value = await api.artists.related(id);
    topListeners.value = await api.http
      .get(`/artists/${id}/top/listeners`)
      .then((res) => res.data.items);
    recentStreams.value = await api.users.artistStreams('me', id);
  });

  return () => (
    <>
      <Hero>
        {artist.value && <Avatar name={artist.value.name} size="4xl" src={artist.value?.image} />}

        <div class="flex flex-col justify-end">
          <h1 class="text-center md:text-left">{artist.value?.name}</h1>
          <p>{t('artist.followers', { count: artist.value?.followers.toLocaleString() })}</p>
        </div>
      </Hero>
      <Container>
        <div class="my-8"></div>

        {/* genres */}
        <section>
          <ChipGroup>
            {artist.value?.genres.map((genre) => (
              <RouterLink to={{ name: 'Genre', params: { tag: genre } }}>
                <Chip>{genre}</Chip>
              </RouterLink>
            ))}
          </ChipGroup>
        </section>

        <div class="my-8"></div>

        {/* tracks */}
        <StickyHeader>
          <h2>{t('artist.tracks')}</h2>
        </StickyHeader>

        <section>
          <Carousel rows={1} gap={16}>
            {tracks.value
              ? tracks.value.slice().map((track) => (
                  <li>
                    <TrackCard track={track} />
                  </li>
                ))
              : Array(10)
                  .fill(null)
                  .map(() => (
                    <li>
                      <Skeleton.Image width="10rem" height="10rem" />
                      <div class="mt-2 flex flex-col gap-2">
                        <Skeleton.Text width="9rem" />
                        <Skeleton.Text width="6.5rem" />
                      </div>
                    </li>
                  ))}
          </Carousel>
        </section>

        {/* top listeners */}
        <StickyHeader>
          <div class="flex flex-col">
            <h2>{t('artist.top_listeners.title')}</h2>
            <p class="my-1">{t('artist.top_listeners.description')}</p>
          </div>
        </StickyHeader>

        <section>
          <Carousel rows={1} gap={16}>
            {topListeners.value
              ? topListeners.value.map((user) => (
                  <li>
                    <TopListenerCard listener={user} />
                  </li>
                ))
              : Array(10)
                  .fill(null)
                  .map(() => (
                    <li>
                      <Skeleton.Avatar size="3xl" />
                      <div class="gap- mt-2 flex flex-col items-center justify-center gap-2">
                        <Skeleton.Text width="5rem" />
                        <Skeleton.Text width="9rem" />
                        <Skeleton.Text width="6.5rem" />
                      </div>
                    </li>
                  ))}
          </Carousel>
        </section>

        {/* related artists */}
        <StickyHeader>
          <h2>{t('artist.related.title')}</h2>
          <p class="my-1">{t('artist.related.description')}</p>
        </StickyHeader>

        <section>
          <Carousel rows={3} gap={16}>
            {related.value
              ? related.value?.map((artist) => (
                  <li>
                    <RelatedArtistCard artist={artist} />
                  </li>
                ))
              : Array(20)
                  .fill(null)
                  .map(() => (
                    <li>
                      <div class="flex items-center gap-2">
                        <Skeleton.Avatar />
                        <Skeleton.Text width="9rem" />
                      </div>
                    </li>
                  ))}
          </Carousel>
        </section>

        {tracks.value && <MoreTracks tracks={tracks.value} />}
        {recentStreams.value && <RecentStreams streams={recentStreams.value} />}
      </Container>
    </>
  );
});
