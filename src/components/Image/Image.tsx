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
        objectFit="cover"
        placeholder="blur"
        blurDataURL="https://media.discordapp.net/attachments/756495774975655987/1012102493716611132/Rectangle_44.png"
        {...props}
      />
    </div>
  );
};
