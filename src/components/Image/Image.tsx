import type { ImageProps as NextImageProps } from 'next/image';
import NextImage from 'next/image';
import clsx from 'clsx';

interface Props extends NextImageProps {
  rounded?: boolean;
}

export const Image = ({ rounded = false, className, ...props }: Props) => {
  return (
    <NextImage
      className={clsx(
        'bg-foreground before:grid before:h-full before:place-items-center before:p-2 before:text-center',
        rounded ? 'rounded-full' : 'rounded-lg',
        className
      )}
      {...props}
    />
  );
};
