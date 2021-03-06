import { FC } from 'vue';
import * as statsfm from '@statsfm/statsfm.js';
import { slugify } from '~/utils/slugify';

// components
import { Avatar } from '../Avatar';
import { RouterLink } from 'vue-router';

interface Props {
  artist: statsfm.Artist;
}

export const RelatedArtistCard: FC<Props> = ({ artist }) => (
  <RouterLink to={{ name: 'Artist', params: { id: artist.id, slug: slugify(artist.name) } }}>
    <div class="flex w-60 items-center gap-2">
      <Avatar name={artist.name} src={artist.image} />
      <div>
        <h4>{artist.name}</h4>
      </div>
    </div>
  </RouterLink>
);
