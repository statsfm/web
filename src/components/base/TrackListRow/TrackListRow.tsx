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
  streams?: number;
  endTime?: Date;
}

export const TrackListRow: FC<Props> = ({ track, streams, endTime }) => {
  const { t } = useI18n();

  return (
    <>
      <RouterLink
        to={{ name: 'Track', params: { id: track.id, slug: slugify(track.name) } }}
        class="flex max-w-full items-center justify-between"
      >
        <div class="flex w-4/5 items-center gap-3">
          <Image key={track.albums[0].image} class="w-12" src={track.albums[0].image} />

          <div class="truncate leading-tight">
            <h4 class="truncate">{track.name}</h4>
            <p class="m-0 truncate">
              {/* TODO: list all artist */}
              {track.artists[0].name} • {track.albums[0].name}
              {streams !== undefined && ` • ${t('times_streamed', { count: streams })}`}
            </p>
          </div>
        </div>

        <p class="w-1/5 text-right">
          {endTime
            ? dayjs(endTime).fromNow()
            : dayjs.duration(track.durationMs, 'milliseconds').format('m:ss')}
        </p>
      </RouterLink>
      <hr class="my-3 border-bodySecundary" />
    </>
  );
};
