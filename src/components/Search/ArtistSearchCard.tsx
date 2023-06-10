import Link from 'next/link';
import { Avatar } from '@/components/Avatar';
import type { Artist } from '@statsfm/statsfm.js';

interface Props extends Artist {}

export const ArtistSearchCard = ({ id, image, name }: Props) => {
  return (
    <Link legacyBehavior href={`/artist/${id}`}>
      <a className="flex w-40 flex-col items-center transition-transform duration-300 ease-in-out active:scale-95">
        <Avatar src={image} name={name} size="3xl" />

        <div className="mt-2 text-center">
          <h4 className="line-clamp-2">{name}</h4>
        </div>
      </a>
    </Link>
  );
};
