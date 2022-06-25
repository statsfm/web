import { FC, HTMLAttributes } from 'vue';
import { AvatarSize, sizes } from '../Avatar';

type Animation = 'pulse';

interface Props extends HTMLAttributes {
  animation?: Animation;
}

const animations: Record<Animation, string> = {
  pulse: 'animate-pulse'
};

interface ImageProps extends Props {
  width: string;
  height: string;
}

export const Image: FC<ImageProps> = ({ animation = 'pulse', width, height }) => (
  <span
    class={['block rounded-lg bg-bodySecundary', animation && animations[animation]]}
    style={{ width, height }}
  />
);

interface TextProps extends Props {
  width: string;
}

export const Text: FC<TextProps> = ({ animation = 'pulse', width }) => (
  <span
    class={['h-4 rounded-full bg-bodySecundary', animation && animations[animation]]}
    style={{ width }}
  />
);

interface AvatarProps extends Props {
  size?: AvatarSize;
}

export const Avatar: FC<AvatarProps> = ({ animation = 'pulse', size = 'md' }) => (
  <div
    class={[
      'aspect-square rounded-full bg-bodySecundary',
      sizes[size],
      animation && animations[animation]
    ]}
  />
);
