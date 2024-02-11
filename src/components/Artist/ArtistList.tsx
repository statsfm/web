import type { ArtistSimple } from '@/utils/statsfm';
import Link from 'next/link';
import type { FC } from 'react';

export const ArtistList: FC<{ artists: ArtistSimple[] }> = ({ artists }) => {
  return (
    <>
      {artists.map((artist, index) => (
        <span key={artist.id + index}>
          <Link legacyBehavior href={`/artist/${artist.id}`}>
            <a className="transition-colors hover:text-white">{artist.name}</a>
          </Link>
          {index < artists.length - 1 && ', '}
        </span>
      ))}
    </>
  );
};
