import clsx from 'clsx';
import type { FC } from 'react';

type Props = {
  store: 'apple' | 'google';
  size?: 'xs' | 'lg';
  onClick?: () => void;
};

export const StoreBadge: FC<Props> = ({ store, size, onClick }) => {
  const storeUrl =
    store === 'apple'
      ? 'https://apps.apple.com/app/spotistats-for-spotify/id1526912392'
      : 'https://play.google.com/store/apps/details?id=dev.netlob.spotistats';

  const imageUrl =
    store === 'apple'
      ? 'https://cdn.stats.fm/file/statsfm/images/brands/stores/app_store.webp'
      : 'https://cdn.stats.fm/file/statsfm/images/brands/stores/play_store.webp';

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
