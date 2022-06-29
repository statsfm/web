import { computed, defineComponent, FC, onBeforeMount, ref, watchEffect } from 'vue';
import * as statsfm from '@statsfm/statsfm.js';
import dayjs from '../dayjs';
import { mdiEyeOff, mdiFileImportOutline } from '@mdi/js';
import { slugify } from '~/utils/slugify';

// components
import { Header } from '~/components/layout/Header';
import Container from '~/components/layout/Container.vue';
import { Avatar } from '~/components/base/Avatar';
import StickyHeader from '~/components/base/StickyHeader.vue';
import { Carousel } from '~/components/base/Carousel';
import { StatsCard, StatsCardSkeleton } from '~/components/base/StatsCard';
import { SegmentedControls } from '~/components/base/SegmentedControls';
import { TrackCard, TrackCardSkeleton } from '~/components/base/TrackCard';
import Icon from '~/components/base/Icon.vue';
import { TrackListRow, TrackListRowSkeleton } from '~/components/base/TrackListRow';
import { Skeleton } from '~/components/base/Skeleton';

// hooks
import { useApi, useTitle, useUser } from '../hooks';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

// TODO: maby inject the privacysettings instead of constantly passing it as a prop
const PrivacyScope: FC<{
  scope: keyof statsfm.UserPrivacySettings;
  settings: statsfm.UserPrivacySettings;
  name?: string;
}> = ({ scope, settings, name }, { slots }) => {
  if (settings[scope]) {
    return slots.default && slots.default();
  }

  return (
    <div class="grid w-full place-items-center">
      <Icon path={mdiEyeOff} />
      <p class="m-0 text-textGrey">{name} doesn't share this</p>
    </div>
  );
};

const ImportRequiredScope: FC<{
  imported?: boolean;
  userId: string;
}> = ({ imported = false, userId }, { slots }) => {
  const currentUser = useUser();

  if (imported) return slots.default && slots.default();

  // TODO: look for a better way to implement getting the user context
  if (userId == currentUser?.id || 'me') {
    return (
      <div class="grid w-full place-items-center">
        <Icon path={mdiFileImportOutline} />
        {/* TODO: use i18n */}
        <p class="m-0 text-textGrey">
          this feature requires{' '}
          <RouterLink class="underline" to={{ name: 'Import' }}>
            import of streams
          </RouterLink>
        </p>
      </div>
    );
  }
};

export default defineComponent(() => {
  const api = useApi();
  // TODO: rename
  // the currently signed in user
  const currentUser = useUser();
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();

  const user = ref<statsfm.UserPublic>();
  const stats = ref<{ label: string; value: string | number }[]>([]);
  const topTracks = ref<statsfm.TopTrack[]>();
  const topArtists = ref<statsfm.TopArtist[]>();
  // const topGenres = ref<statsfm.TopGenre[]>();
  const recentStreams = ref<statsfm.RecentlyPlayedTrack[]>();

  const id = route.params.userId.toString();
  const isCurrentUser = computed(() => currentUser?.id == user.value?.id);
  const rangeRef = ref<statsfm.Range>(statsfm.Range.WEEKS);

  onBeforeMount(async () => {
    // TODO: show not found screen but stay on same route
    user.value = await api.users.get(id).catch(() => router.push({ name: 'NotFound' }));
    // TOOD: think of a better way of fetching based on privacy settings
    recentStreams.value = user.value?.privacySettings!.recentlyPlayed
      ? await api.users.recentlyStreamed(id)
      : [];

    // load data with weeks as default
    load(rangeRef.value);
  });

  const load = async (range: statsfm.Range) => {
    rangeRef.value = range;
    stats.value = [];

    // TODO: look for a better solution
    user.value?.privacySettings?.streamStats &&
      api.users.stats(id, { range }).then(({ durationMs, count }) => {
        stats.value.push(
          {
            label: t('user.streams'),
            value: count?.toLocaleString()
          },
          {
            label: t('user.minutes_streamed'),
            value: Math.round(dayjs.duration(durationMs).asMinutes()).toLocaleString()
          },
          {
            label: t('user.hours_streamed'),
            value: Math.round(dayjs.duration(durationMs).asHours()).toLocaleString()
          }
        );
      });

    topTracks.value = user.value?.privacySettings?.topTracks
      ? await api.users.topTracks(id, { range })
      : [];
    topArtists.value = user.value?.privacySettings?.topArtists
      ? await api.users.topArtists(id, { range })
      : [];
    // topGenres.value = user.value?.privacySettings?.topGenres
    //   ? await api.users.topGenres(id, { range })
    //   : [];
  };

  watchEffect(() => useTitle(user.value?.displayName));

  const onRangeSelect = (value: string) => {
    load(statsfm.Range[value.toUpperCase() as keyof typeof statsfm.Range]);
  };

  return () => (
    <>
      <Header />

      <Container class="flex flex-col items-center gap-5 pt-24 pb-10 md:flex-row">
        {user.value ? (
          <>
            <Avatar size="4xl" name={user.value.displayName} src={user.value.image} />

            <div class="flex flex-col justify-end">
              {user.value.privacySettings?.profile && (
                <span class="text-center text-lg font-medium md:text-left">
                  {user.value.profile?.pronouns}
                </span>
              )}
              <h1 class="text-center md:text-left">{user.value.displayName}</h1>
              {user.value.privacySettings?.profile && (
                <span class="text-center text-xl font-medium md:text-left">
                  {user.value.profile?.bio}
                </span>
              )}
              {/* TODO: look if connections can be scoped (privacy) */}
              <ul>
                {
                  // TODO: create a pull request to the statsfm library to add the social media connections to the `UserPublic` interface
                  (
                    user.value as statsfm.UserPublic & {
                      socialMediaConnections: statsfm.UserSocialMediaConnection[];
                    }
                  ).socialMediaConnections.map((connection) => (
                    <li>
                      <a href="/">
                        <img src={connection.platform.icon} alt={connection.platform.name} />
                      </a>
                    </li>
                  ))
                }
              </ul>
            </div>
          </>
        ) : (
          <>
            <Skeleton.Avatar size="4xl" />

            <div class="flex flex-col justify-end gap-2">
              <Skeleton.Text width="4rem" />
              <Skeleton.Text width="8rem" style={{ height: '1.75rem' }} />
              <Skeleton.Text width="18rem" />
            </div>
          </>
        )}
      </Container>

      <Container>
        <div class="my-8"></div>

        {/* stats */}
        <section class="flex flex-col justify-between gap-5 md:flex-row-reverse">
          <SegmentedControls
            class="w-1/8 h-max"
            segments={[
              { label: t('range.weeks'), value: statsfm.Range.WEEKS },
              { label: t('range.months'), value: statsfm.Range.MONTHS },
              { label: t('range.lifetime'), value: statsfm.Range.LIFETIME }
            ]}
            // TOOD: add emit type checking
            onSelect={(value) => onRangeSelect(value as unknown as string)}
          />

          <ImportRequiredScope imported={user.value?.hasImported} userId={id}>
            <PrivacyScope
              scope="streamStats"
              settings={user.value?.privacySettings!}
              name={user.value?.displayName}
            >
              <ul class="grid grid-cols-2 gap-4 md:grid-cols-4">
                {stats.value.length > 0
                  ? stats.value.map((item) => (
                      <li>
                        <StatsCard {...item} />
                      </li>
                    ))
                  : Array(3)
                      .fill(null)
                      .map(() => <StatsCardSkeleton />)}
              </ul>
            </PrivacyScope>
          </ImportRequiredScope>
        </section>

        <div class="my-8"></div>

        {/* top tracks */}
        <StickyHeader>
          <div>
            <h2>{t('user.top_tracks.title')}</h2>
            <p class="my-1">
              {t('user.top_tracks.description', {
                // TODO: add name pluralization
                name: isCurrentUser.value ? 'Your' : user.value?.displayName,
                range: t(`range.${rangeRef.value}`)
              })}
            </p>
          </div>
        </StickyHeader>

        <section>
          <PrivacyScope
            scope="topTracks"
            settings={user.value?.privacySettings!}
            name={user.value?.displayName}
          >
            <Carousel rows={1} gap={16}>
              {topTracks.value
                ? topTracks.value.map((item) => (
                    <li>
                      <TrackCard {...item} />
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
          </PrivacyScope>
        </section>

        <div class="my-8"></div>

        {/* top artists */}
        <StickyHeader>
          <div>
            <h2>{t('user.top_artists.title')}</h2>
            <p class="my-1">
              {t('user.top_artists.description', {
                name: isCurrentUser.value ? 'Your' : user.value?.displayName,
                range: t(`range.${rangeRef.value}`)
              })}
            </p>
          </div>
        </StickyHeader>

        <section>
          <PrivacyScope
            scope="topArtists"
            settings={user.value?.privacySettings!}
            name={user.value?.displayName}
          >
            <Carousel rows={1} gap={16}>
              {topArtists.value
                ? topArtists.value?.map((item) => (
                    // TODO: move to separate component
                    <li>
                      <RouterLink
                        to={{
                          name: 'Artist',
                          params: { id: item.artist.id, slug: slugify(item.artist.name) }
                        }}
                      >
                        <div class="flex w-40 flex-col items-center">
                          <Avatar
                            key={item.artist.image}
                            name={item.artist.name}
                            src={item.artist.image}
                            size="3xl"
                          >
                            <div class="rounded-lg bg-bodySecundary px-2 py-1">
                              <h4 class="text-neutral-400">#{item.position}</h4>
                            </div>
                          </Avatar>

                          <div class="mt-2 text-center">
                            <h4>{item.artist.name}</h4>
                            {/* TOOD: add minutes played and streams count */}
                            {/* <p class="m-0 line-clamp-2">
                          <span>{item.playedMs}</span>
                        </p> */}
                          </div>
                        </div>
                      </RouterLink>
                    </li>
                  ))
                : Array(10)
                    .fill(null)
                    .map(() => (
                      <li>
                        <Skeleton.Avatar size="3xl" />

                        <div class="mt-2 flex flex-col items-center gap-2">
                          <Skeleton.Text width="6rem" />
                        </div>
                      </li>
                    ))}
            </Carousel>
          </PrivacyScope>
        </section>

        {/* recent streams */}
        <StickyHeader>
          <div>
            <h2>{t('user.recent_streams.title')}</h2>
            <p class="my-1">
              {t('user.recent_streams.description', {
                name: isCurrentUser.value ? 'Your' : user.value?.displayName
              })}
            </p>
          </div>
        </StickyHeader>

        <section>
          <PrivacyScope
            scope="recentlyPlayed"
            settings={user.value?.privacySettings!}
            name={user.value?.displayName}
          >
            {/* TOOD: replace this with a recently streamed ui */}
            {recentStreams.value?.length! > 0
              ? recentStreams.value?.map((item) => <TrackListRow track={item.track} streams={0} />)
              : Array(8)
                  .fill(null)
                  .map(() => <TrackListRowSkeleton />)}
          </PrivacyScope>
        </section>
      </Container>
    </>
  );
});
