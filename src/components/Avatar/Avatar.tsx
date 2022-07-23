import Image from 'next/image';

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

// TODO: conditionally render because src prop is not recieved
// https://github.com/vercel/next.js/discussions/18531
export const Avatar = ({ name, size = 'md', src, ...props }: Props) => {
  const initials = name
    .match(/(\b\S)?/g)!
    .join('')
    .match(/(^\S|\S$)?/g)!
    .join('')
    .toUpperCase();

  if (!src) {
    return (
      <div
        className="grid aspect-square place-items-center rounded-full bg-foreground"
        style={{ width: sizes[size] }}
      >
        <p>{initials}</p>
      </div>
    );
  }

  return (
    <Image
      className="rounded-full"
      objectFit="cover"
      width={sizes[size]}
      height={sizes[size]}
      alt={initials}
      src={src}
      {...props}
    />
  );
};
