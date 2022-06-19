import {
  computed,
  defineComponent,
  onBeforeMount,
  onMounted,
  Ref,
  ref,
  Suspense,
  watchEffect
} from 'vue';
import { RouterLink } from 'vue-router';
import * as statsfm from '@statsfm/statsfm.js';
import { mdiSortVariant } from '@mdi/js';

// components
import Hero from '~/components/base/Hero.vue';
import { Avatar } from '~/components/base/Avatar';
import { ChipGroup, Chip } from '~/components/base/Chip';
import StickyHeader from '~/components/base/StickyHeader.vue';
import Container from '~/components/layout/Container.vue';
import { RelatedArtistCard, RelatedArtistCardSkeleton } from '~/components/base/RelatedArtistCard';
import { TrackCard, TrackCardSkeleton } from '~/components/base/TrackCard';
import { TrackListRow, TrackListRowSkeleton } from '~/components/base/TrackListRow';
import { TopListenerCard, TopListenerCardSkeleton } from '~/components/base/TopListenerCard';
import { Carousel } from '~/components/base/Carousel';
import { RecentStreams } from '~/components/base/RecentStreams';
import { Menu, MenuButton, MenuItem, MenuItems } from '~/components/base/Menu';
import Icon from '~/components/base/Icon.vue';

// hooks
import { useApi, useLessMore, useSort, SortOptions, useTitle } from '~/hooks';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

export default defineComponent(() => {
  const api = useApi();
  const route = useRoute();
  const { t } = useI18n();

  const artist = ref<statsfm.Artist>();
  const tracks = ref<statsfm.Track[]>();
  const related = ref<statsfm.Artist[]>();
  const topListeners = ref<statsfm.TopUser[]>();
  const recentStreams = ref<statsfm.Stream[]>();

  const id = parseInt(route.params.id.toString());

  // TODO: look at async loading in refs
  onBeforeMount(async () => {
    artist.value = await api.artists.get(id);
    tracks.value = await api.artists.tracks(id);
    related.value = await api.artists.related(id);
    topListeners.value = await api.http
      .get(`/artists/${id}/top/listeners`)
      .then((res) => res.data.items);
    recentStreams.value = await api.users.artistStreams('me', id);
  });

  watchEffect(() => {
    useTitle(artist.value?.name);
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
                <Chip class="font-bold">{genre}</Chip>
              </RouterLink>
            ))}
          </ChipGroup>
        </section>

        <div class="my-8"></div>

        {/* popular tracks */}
        <StickyHeader>
          <div>
            <h2>{t('artist.popular_tracks.title')}</h2>
            <p class="my-1">
              {t('artist.popular_tracks.description', { artist: artist.value?.name })}
            </p>
          </div>
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
                      <TrackCardSkeleton />
                    </li>
                  ))}
          </Carousel>
        </section>

        {/* top listeners */}
        <StickyHeader>
          <div>
            <h2>{t('artist.top_listeners.title')}</h2>
            <p class="my-1">
              {t('artist.top_listeners.description', { artist: artist.value?.name })}
            </p>
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
                      <TopListenerCardSkeleton />
                    </li>
                  ))}
          </Carousel>
        </section>

        {/* related artists */}
        <StickyHeader>
          <div>
            <h2>{t('artist.related.title')}</h2>
            <p class="my-1">{t('artist.related.description')}</p>
          </div>
        </StickyHeader>

        <section>
          <Carousel rows={3} gap={16} class="snap snap-x snap-mandatory">
            {related.value
              ? related.value?.map((artist) => (
                  <li class="snap-start snap-normal">
                    <RelatedArtistCard artist={artist} />
                  </li>
                ))
              : Array(20)
                  .fill(null)
                  .map(() => (
                    <li>
                      <RelatedArtistCardSkeleton />
                    </li>
                  ))}
          </Carousel>
        </section>

        {/* more tracks */}
        <StickyHeader>
          <div>
            <h2>{t('artist.more_tracks.title')}</h2>
            <p class="my-1">
              {t('artist.more_tracks.description', { artist: artist.value?.name })}
            </p>
          </div>
        </StickyHeader>

        <section>
          <ul>
            <Suspense>
              {{
                default: <MoreTracks limit={8} id={id} />,
                fallback: (
                  <>
                    {Array(8)
                      .fill(null)
                      .map(() => (
                        <TrackListRowSkeleton />
                      ))}
                  </>
                )
              }}
            </Suspense>
          </ul>
        </section>

        {/* recent streams */}
        <StickyHeader>
          <div>
            <h2>{t('artist.recent_streams.title')}</h2>
            <p class="my-1">
              {t('artist.recent_streams.description', { artist: artist.value?.name })}
            </p>
          </div>
        </StickyHeader>
        {recentStreams.value && <RecentStreams streams={recentStreams.value} />}
      </Container>
    </>
  );
});

const MoreTracks = defineComponent<{ id: number; limit: number }>(async ({ id, limit }) => {
  const api = useApi();
  // TODO: don't fetch artist tracks multiple times
  const tracks = ref(await api.artists.tracks(id));
  const top = ref(await api.users.topTracksFromArtist('me', id));

  const streams = (id: number) => top.value.find((stream) => stream.track.id === id)?.streams ?? 0;

  const sortOptions: SortOptions<statsfm.Track>[] = [
    {
      label: 'Popularity',
      value: 'popularity',
      compare: (a, b) => b.spotifyPopularity - a.spotifyPopularity
    },
    {
      label: 'Streams',
      value: 'streams',
      compare: (a, b) => streams(b.id) - streams(a.id)
    },
    {
      label: 'Duration',
      value: 'duration',
      compare: (a, b) => b.durationMs - a.durationMs
    }
  ];

  const { data: sorted, setSortKey } = useSort(tracks.value, sortOptions);
  const { data, toggle, showMore } = useLessMore(sorted, limit);

  return () => (
    <>
      {/* TODO: move menu to header */}
      <div class="flex justify-end">
        <Menu>
          <MenuButton>
            Sort <Icon path={mdiSortVariant} />
          </MenuButton>

          <MenuItems class="right-0">
            {sortOptions.map((option) => (
              <MenuItem onSelect={() => setSortKey(option.value)}>{option.label}</MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </div>

      <ul>
        {data.value?.map((item) => (
          <li>
            <TrackListRow track={item} streams={streams(item.id)} />
          </li>
        ))}
      </ul>

      {tracks.value.length > limit && (
        <button class="py-3 font-bold uppercase text-textGrey" onClick={toggle}>
          {showMore.value ? 'show less' : 'show more'}
        </button>
      )}
    </>
  );
});

MoreTracks.props = ['id', 'limit'];
