import type { ImageProps as NextImageProps } from 'next/image';
import NextImage from 'next/image';
import clsx from 'clsx';

interface Props extends NextImageProps {
  rounded?: boolean;
}

export const Image = ({ rounded = false, className, ...props }: Props) => {
  return (
    <div
      className={clsx(
        'overflow-hidden',
        rounded ? 'rounded-full' : 'rounded-lg'
      )}
    >
      <NextImage
        className={clsx(
          'bg-foreground before:grid before:h-full before:place-items-center before:p-2 before:text-center',
          rounded ? 'rounded-full' : 'rounded-lg',
          className
        )}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAQSURBVHgBAQUA+v8ANTU1/wLhAZ/HkyyzAAAAAElFTkSuQmCC"
        style={{
          maxWidth: '100%',
          height: 'auto',
          objectFit: 'cover',
        }}
        {...props}
      />
    </div>
  );
};
