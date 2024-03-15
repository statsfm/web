import type { PropsWithChildren } from 'react';
import Link from 'next/link';
import { Image } from '@/components/Image';
import type { Track } from '@/utils/statsfm';

interface Props extends Track {}

export const TrackSearchCard = ({
  name,
  albums,
  id,
}: PropsWithChildren<Props>) => {
  return (
    <Link legacyBehavior href={`/track/${id}`} passHref>
      <a className="block w-40 transition-transform duration-300 ease-in-out active:scale-95">
        <div className="w-full group-hover:opacity-90">
          <Image
            src={albums[0]!.image}
            width={160}
            height={160}
            alt={name}
            className="aspect-square"
          />
        </div>
        <div className="mt-2">
          <h4 className="line-clamp-2">{name}</h4>
        </div>
      </a>
    </Link>
  );
};
