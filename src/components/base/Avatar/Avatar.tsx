import { computed, FC, ImgHTMLAttributes } from 'vue';
import { Image } from '../Image';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface Props extends ImgHTMLAttributes {
  name: string;
  size?: Size;
}

const sizes: Record<Size, string> = {
  xs: 'w-6',
  sm: 'w-8',
  md: 'w-12',
  lg: 'w-16',
  xl: 'w-24',
  '2xl': 'w-32'
};

const Avatar: FC<Props> = ({ name, size = 'md', ...props }, { slots }) => {
  const initials = computed(() => {
    return name
      .match(/(\b\S)?/g)!
      .join('')
      .match(/(^\S|\S$)?/g)!
      .join('')
      .toUpperCase();
  });

  return (
    <Image class={'select-none rounded-full shadow-sm'} {...props}>
      {{
        loading: () => (
          <span class={'text-fontSecundary animation-pulse font-medium'}>{initials.value}</span>
        ),
        unavailable: () => <span class={'font-medium'}>{initials.value}</span>
      }}
    </Image>
  );
};

export default Avatar;
