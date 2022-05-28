import { computed, FC, ImgHTMLAttributes } from 'vue';
import { Image } from '../Image';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

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
  '2xl': 'w-32',
  '3xl': 'w-40',
  '4xl': 'w-48'
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
    <div class="relative">
      <Image class={['select-none rounded-full shadow-sm', sizes[size]]} {...props}>
        {{
          loading: () => (
            <span class={'text-fontSecundary animation-pulse font-medium'}>{initials.value}</span>
          ),
          unavailable: () => <span class={'font-medium'}>{initials.value}</span>
        }}
      </Image>

      <div class="absolute bottom-0 right-0">{slots.default && slots.default()}</div>
    </div>
  );
};

export default Avatar;
