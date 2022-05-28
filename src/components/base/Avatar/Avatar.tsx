import { computed, FC, ImgHTMLAttributes } from 'vue';
import { Image } from '../Image';

interface Props extends ImgHTMLAttributes {
  name: string;
}

const Avatar: FC<Props> = ({ name, ...props }) => {
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
