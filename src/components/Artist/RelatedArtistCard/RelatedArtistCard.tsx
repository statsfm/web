import type * as statsfm from '@/utils/statsfm';

// components
import Link from 'next/link';
import { Avatar } from '@/components/Avatar';

interface Props extends statsfm.Artist {}

export const RelatedArtistCard = (artist: Props) => (
  <Link
    href={`/artist/${artist.id}`}
    passHref
    className="flex w-60 items-center gap-2"
  >
    <Avatar name={artist.name} src={artist.image} size="md" />

    <div>
      <h4 className="line-clamp-1">{artist.name}</h4>
    </div>
  </Link>
);
