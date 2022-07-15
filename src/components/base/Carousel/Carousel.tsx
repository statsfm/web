import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { defineComponent, OlHTMLAttributes, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import Icon from '../Icon.vue';

interface Props extends OlHTMLAttributes {
  rows: number;
  gap: number;
}

const Carousel = defineComponent<Props>(({ rows, gap }, { slots }) => {
  const scrollLeft = ref(0);
  const carouselRef = ref<HTMLUListElement>();

  const handleScrollEvent = (e: Event) => {
    scrollLeft.value = (e.target as any).scrollLeft;
  };

  onMounted(() => {
    carouselRef.value?.addEventListener('scroll', handleScrollEvent);
  });

  onUnmounted(() => {
    carouselRef.value?.removeEventListener('scroll', handleScrollEvent);
  });

  const handlePreviousClick = () => {
    carouselRef.value?.scrollBy(-carouselRef.value?.clientWidth, 0);
  };

  const handleNextClick = () => {
    carouselRef.value?.scrollBy(carouselRef.value?.clientWidth, 0);
  };

  return () => (
    <div class="relative">
      {scrollLeft.value > 0 && (
        <div class="absolute top-0 left-0 z-20 hidden h-full items-center md:flex">
          <button
            class="relative -left-1/2 rounded-full bg-white p-4 shadow-md"
            onClick={handlePreviousClick}
          >
            <Icon path={mdiChevronLeft} />
          </button>
        </div>
      )}

      <ul
        class="no-scrollbar grid snap-x snap-mandatory grid-flow-col overflow-scroll scroll-smooth"
        style={{
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gap: `${gap}px`
        }}
        ref={carouselRef}
      >
        {slots.default && slots.default()}
      </ul>

      {/* TODO: fix types */}
      {scrollLeft.value < (carouselRef.value as any)?.scrollLeftMax && (
        <div class="absolute right-0 top-0 z-10 hidden h-full items-center md:flex">
          <button
            class="relative left-1/2 rounded-full bg-white p-3 shadow-md"
            onClick={handleNextClick}
          >
            <Icon path={mdiChevronRight} />
          </button>
        </div>
      )}
    </div>
  );
});

Carousel.props = ['rows', 'gap', 'children'];

export default Carousel;
