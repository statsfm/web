import { FC } from 'vue';
import * as statsfm from '@statsfm/statsfm.js';
import { slugify } from '~/utils/slugify';

// components
import { RouterLink } from 'vue-router';
import { Image } from '../Image';
import ArtistNameListRender from '../ArtistNameListRender.vue';

interface Props {
  track: statsfm.Track;
}

export const TrackCard: FC<Props> = ({ track }) => (
  <RouterLink to={{ name: 'Track', params: { id: track.id, slug: slugify(track.name) } }}>
    <div class="w-40">
      <div class="min-h-50 aspect-square w-full group-hover:opacity-90">
        <Image
          key={track.albums[0].image}
          src={track.albums[0].image}
          alt={track.name}
          class="aspect-square"
        />
      </div>
      <div class="mt-2">
        <h4 class="line-clamp-2">{track.name}</h4>
        <ArtistNameListRender artists={track.artists} />
      </div>
    </div>
  </RouterLink>
);
