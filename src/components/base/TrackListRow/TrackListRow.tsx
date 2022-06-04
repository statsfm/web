import { FC } from 'vue';
import * as statsfm from '@statsfm/statsfm.js';
import dayjs from '../../../dayjs';
import { mdiClockOutline } from '@mdi/js';

// components
import { RouterLink } from 'vue-router';
import { Image } from '../Image';
import Icon from '../Icon.vue';

interface Props {
  track: statsfm.Track;
}

export const TrackListRow: FC<Props> = ({ track }) => (
  <>
    <RouterLink
      to={{ name: 'Track', params: { id: track.id } }}
      class="flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <Image class="w-12" src={track.albums[0].image} />

        <div class="leading-tight">
          <h4>{track.name}</h4>
          <p class="m-0">{track.artists[0].name}</p>
        </div>
      </div>

      <p class="flex gap-2 text-right">
        {dayjs.duration(track.durationMs, 'milliseconds').format('m:ss')}{' '}
        {/* <Icon path={mdiClockOutline} /> */}
      </p>
    </RouterLink>
    <hr class="my-3 border-bodySecundary" />
  </>
);
