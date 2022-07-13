import { computed, FC } from 'vue';
import * as statsfm from '@statsfm/statsfm.js';
import { slugify } from '~/utils/slugify';
import dayjs from '~/dayjs';

// components
import { RouterLink } from 'vue-router';
import { Image } from '../Image';
import ArtistNameListRender from '../ArtistNameListRender.vue';

// hooks
import { useI18n } from 'vue-i18n';

interface Props extends Partial<Exclude<statsfm.TopTrack, 'track'>> {
  track: statsfm.Track;
}

export const TrackCard: FC<Props> = ({ track, playedMs, streams }) => {
  const { t } = useI18n();
  const image = computed(() => track.albums[0].image);
  const minutes = computed(() =>
    Math.floor(dayjs.duration(playedMs!, 'ms').asMinutes()).toLocaleString()
  );

  return (
    <RouterLink to={{ name: 'Track', params: { id: track.id, slug: slugify(track.name) } }}>
      <div class="w-40">
        <div class="min-h-50 aspect-square w-full group-hover:opacity-90">
          <Image key={image.value} src={image.value} alt={track.name} class="aspect-square" />
        </div>
        <div class="mt-2">
          <h4 class="line-clamp-2">{track.name}</h4>
          <p class="m-0 truncate">
            {playedMs && <span>{t('minutes', { count: minutes.value })} • </span>}
            {streams && <span>{t('streams', { count: streams })} • </span>}
            <ArtistNameListRender artists={track.artists} />
          </p>
        </div>
      </div>
    </RouterLink>
  );
};
