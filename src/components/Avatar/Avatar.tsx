import type { ImageProps as NextImageProps } from 'next/image';
import Image from 'next/image';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

interface Props extends NextImageProps {
  name: string;
  size: Size;
}

export const sizes: Record<Size, number> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
  '2xl': 128,
  '3xl': 160,
  '4xl': 192,
};

const Avatar = ({ name, size, ...props }: Props) => {
  const initials = name
    .match(/(\b\S)?/g)!
    .join('')
    .match(/(^\S|\S$)?/g)!
    .join('')
    .toUpperCase();

  return (
    <Image
      className="rounded-full"
      width={sizes[size]}
      height={sizes[size]}
      alt={initials}
      {...props}
    />
  );
};

export default Avatar;
