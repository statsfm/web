import clsx from 'clsx';
import type { FC } from 'react';
import {
  STORE_APPLE_URL,
  STORE_GOOGLE_URL,
  STORE_APPLE_LOGO,
  STORE_GOOGLE_LOGO,
} from '@/constants';

type Props = {
  store: 'apple' | 'google';
  size?: 'xs' | 'lg';
  onClick?: () => void;
};

export const StoreBadge: FC<Props> = ({ store, size, onClick }) => {
  const storeUrl = store === 'apple' ? STORE_APPLE_URL : STORE_GOOGLE_URL;
  const imageUrl = store === 'apple' ? STORE_APPLE_LOGO : STORE_GOOGLE_LOGO;

  const isSmall = size === 'xs';

  return (
    <a
      href={storeUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={store}
        className={clsx({ 'h-9': isSmall, 'h-14': !isSmall })}
      />
    </a>
  );
};
