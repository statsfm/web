import type { ImageProps as NextImageProps } from 'next/image';
import NextImage from 'next/image';
import clsx from 'clsx';
import { useState } from 'react';

interface Props extends NextImageProps {
  rounded?: boolean;
}

export const Image = ({ rounded = false, className, src, ...props }: Props) => {
  const [error, setError] = useState(false);
  return (
    <div className={clsx('overflow-hidden', rounded && 'rounded-full')}>
      <NextImage
        className={clsx(
          'bg-foreground before:grid before:h-full before:place-items-center before:p-2 before:text-center',
          rounded && 'rounded-full',
          className,
        )}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAQSURBVHgBAQUA+v8ANTU1/wLhAZ/HkyyzAAAAAElFTkSuQmCC"
        style={{
          maxWidth: '100%',
          height: 'auto',
          objectFit: 'cover',
        }}
        loading="lazy"
        src={
          error
            ? 'https://cdn.stats.fm/file/statsfm/images/placeholders/users/private.webp'
            : src
        }
        onError={() => setError(true)}
        {...props}
      />
    </div>
  );
};
