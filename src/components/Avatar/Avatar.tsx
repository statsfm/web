import clsx from 'clsx';
import { Image } from '@/components/Image';
import type { PropsWithChildren } from 'react';
import { defaultUserImageURL } from '@/contants';

export type AvatarSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl';

interface Props {
  name: string;
  size?: AvatarSize;
  src?: string;
}

export const sizes: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
  '2xl': 128,
  '3xl': 160,
  '4xl': 192,
};

export const Avatar = ({
  name,
  size = 'md',
  src,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const initials = name
    .match(/(\b\S)?/g)!
    .join('')
    .match(/(^\S|\S$)?/g)!
    .join('')
    .toUpperCase();

  if (!src) {
    return (
      <div
        className="relative grid aspect-square shrink-0 place-items-center rounded-full bg-foreground"
        style={{ width: sizes[size] }}
      >
        <p>{initials}</p>

        <div className="absolute bottom-0 right-0">{children}</div>
      </div>
    );
  }

  return (
    <div
      className="relative shrink-0"
      style={{ width: sizes[size], height: sizes[size] }}
    >
      <Image
        // eslint-disable-next-line tailwindcss/no-custom-classname
        className={clsx(
          'aspect-square bg-foreground object-cover text-center text-neutral-400',
          `leading-[${sizes[size]}px]`,
        )}
        rounded
        width={sizes[size]}
        height={sizes[size]}
        alt={initials}
        // If src contains fbcdn or fbsbx, use "URL"
        src={
          src.includes('fbcdn') || src.includes('fbsbx')
            ? defaultUserImageURL
            : src
        }
        {...props}
      />

      <div className="absolute bottom-0 right-0">{children}</div>
    </div>
  );
};
