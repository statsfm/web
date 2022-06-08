import { FC } from 'vue';
import * as statsfm from '@statsfm/statsfm.js';
import dayjs from '~/dayjs';
import { slugify } from '~/utils/slugify';

// components
import { RouterLink } from 'vue-router';
import { Image } from '../Image';

// hooks
import { useI18n } from 'vue-i18n';

interface Props {
  track: statsfm.Track;
  streams: number;
}

export const TrackListRow: FC<Props> = ({ track, streams }) => {
  const { t } = useI18n();

  return (
    <>
      <RouterLink
        to={{ name: 'Track', params: { id: track.id, slug: slugify(track.name) } }}
        class="flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <Image class="w-12" src={track.albums[0].image} />

          <div class="leading-tight">
            <h4>{track.name}</h4>
            <p class="m-0">
              {/* TODO: list all artist */}
              {track.artists[0].name} • {track.albums[0].name} •{' '}
              {t('times_streamed', { count: streams })}
            </p>
          </div>
        </div>

        <p class="text-right">{dayjs.duration(track.durationMs, 'milliseconds').format('m:ss')}</p>
      </RouterLink>
      <hr class="my-3 border-bodySecundary" />
    </>
  );
};
