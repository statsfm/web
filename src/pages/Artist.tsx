import { defineComponent, FC, onBeforeMount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import * as statsfm from '@statsfm/statsfm.js';
import dayjs from '~/dayjs';
import { mdiClockOutline } from '@mdi/js';

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

// hooks
import { useApi, useLessMore } from '~/hooks';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Carousel } from '~/components/base/Carousel';
import { RecentStreams } from '~/components/base/RecentStreams';

const MoreTracks = defineComponent<{ tracks?: statsfm.Track[] }>(({ tracks }) => {
  const { t } = useI18n();
  const limit = 8;
  const { data, toggle, showMore } = useLessMore(tracks!, limit);

  return () => (
    <>
      <StickyHeader>
        <div class="flex flex-col">
          <h2>{t('artist.more_tracks.title')}</h2>
          <p class="my-1">{t('artist.more_tracks.description')}</p>
        </div>
      </StickyHeader>

      <section>
        <ul>
          {tracks ? (
            <>
              {data.value.map((track) => (
                <li>
                  <TrackListRow track={track} />
                </li>
              ))}

              <button class="py-3 font-bold uppercase text-textGrey" onClick={toggle}>
                {showMore.value ? 'show less' : 'show more'}
              </button>
            </>
          ) : (
            Array(limit)
              .fill(null)
              .map(() => (
                <li>
                  <TrackListRowSkeleton />
                </li>
              ))
          )}
        </ul>
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
                      <TrackCardSkeleton />
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
                      <TopListenerCardSkeleton />
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
                      <RelatedArtistCardSkeleton />
                    </li>
                  ))}
          </Carousel>
        </section>

        {<MoreTracks tracks={tracks.value} />}
        {recentStreams.value && <RecentStreams streams={recentStreams.value} />}
      </Container>
    </>
  );
});
