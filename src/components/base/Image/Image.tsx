import { defineComponent, ImgHTMLAttributes, Transition } from 'vue';
import Icon from '../Icon.vue';
import { useImageState } from './hook';
import { mdiImageOff } from '@mdi/js';

interface Props extends ImgHTMLAttributes {}

const Image = defineComponent<Props>(({ src, ...props }, { slots }) => {
  const { state } = useImageState(src);

  return () => (
    <div class="grid place-items-center overflow-hidden bg-bodySecundary">
      <Transition
        enter-active-class="transition ease-out"
        enter-from-class="transform opacity-0"
        enter-to-class="transform opacity-100"
        leave-active-class="transition ease-in"
        leave-from-class="transform opacity-100"
        leave-to-class="transform opacity-0"
        mode="out-in"
      >
        {() => {
          switch (state.value) {
            case 'pending':
            case 'loading': {
              return slots.loading && slots.loading();
            }

            case 'loaded': {
              return <img src={src} {...props} />;
            }

            case 'failed':
            case 'unavailable': {
              return slots.unavailable ? slots.unavailable() : <Icon path={mdiImageOff} />;
            }
          }
        }}
      </Transition>
    </div>
  );
});

Image.props = ['src'];

export default Image;
