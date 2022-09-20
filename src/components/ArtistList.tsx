import type { ArtistSimple } from '@statsfm/statsfm.js';
import Link from 'next/link';
import type { FC } from 'react';

export const ArtistList: FC<{ artists: ArtistSimple[] }> = ({ artists }) => {
  return (
    <>
      {artists.map((artist, index) => (
        <>
          <Link href={`/artist/${artist.id}`} key={artist.id}>
            <a className="transition-colors hover:text-white">{artist.name}</a>
          </Link>
          {index < artists.length - 1 && ', '}
        </>
      ))}
    </>
  );
};
