import Link from 'next/link';
import { Avatar } from '@/components/Avatar';
import type { UserPublic } from '@/utils/statsfm';

interface Props extends UserPublic {}

export const UserSearchCard = ({ id, image, customId, displayName }: Props) => {
  return (
    <Link legacyBehavior href={`/user/${customId ?? id}`}>
      <a className="flex w-40 flex-col items-center transition-transform duration-300 ease-in-out active:scale-95">
        <Avatar src={image} name={displayName} size="3xl" />

        <div className="mt-2 text-center">
          <h4 className="line-clamp-2">{displayName}</h4>
        </div>
      </a>
    </Link>
  );
};
