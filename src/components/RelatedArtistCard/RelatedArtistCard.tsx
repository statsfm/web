import type * as statsfm from '@statsfm/statsfm.js';

// components
import Link from 'next/link';
import { Avatar } from '../Avatar';

interface Props extends statsfm.Artist {}

export const RelatedArtistCard = (artist: Props) => (
  <Link legacyBehavior href={`/artist/${artist.id}`} passHref>
    <a className="flex w-60 items-center gap-2">
      <Avatar name={artist.name} src={artist.image} size="md" />

      <div>
        <h4 className="line-clamp-1">{artist.name}</h4>
      </div>
    </a>
  </Link>
);
