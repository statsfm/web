import clsx from 'clsx';
import type { HTMLAttributes } from 'react';
import { type AvatarSize, sizes } from '@/components/Avatar';

type Animation = 'pulse';

interface DefaultProps extends HTMLAttributes<HTMLElement> {
  animation?: Animation | null;
}

const animations: Record<Animation, string> = {
  pulse: 'animate-pulse',
};

export interface ImageProps extends DefaultProps {
  width: string;
  height: string;
}

export const Image = ({ animation = 'pulse', width, height }: ImageProps) => (
  <span
    className={clsx(
      'block rounded-lg bg-foreground',
      animation && animations[animation],
    )}
    style={{ width, height }}
  />
);

export interface TextProps extends DefaultProps {
  width: string;
  height?: string;
}

export const Text = ({
  animation = 'pulse',
  width,
  height = '1rem',
}: TextProps) => (
  <span
    className={clsx(
      `rounded-full bg-foreground`,
      animation && animations[animation],
    )}
    style={{ height, width }}
  />
);

export interface AvatarProps extends DefaultProps {
  size?: AvatarSize;
}

export const Avatar = ({ animation = 'pulse', size = 'md' }: AvatarProps) => (
  <div
    className={clsx(
      'aspect-square rounded-full bg-foreground',
      animation && animations[animation],
    )}
    style={{ width: sizes[size] }}
  />
);
