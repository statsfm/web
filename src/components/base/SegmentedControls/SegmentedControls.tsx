import { defineComponent, onBeforeUnmount, onMounted, PropType, Ref, ref, watch } from 'vue';

interface Segment {
  label: string;
  value: string;
  ref?: Ref<HTMLLIElement>;
}

export default defineComponent({
  //  TODO: look why whe can't use typescript generics as props
  props: {
    segments: Object as PropType<Segment[]>,
    defaultIndex: Number
  },
  emits: ['change'],
  setup({ segments, defaultIndex = 0 }, { emit }) {
    const activeIndex = ref(defaultIndex);
    const offsetWidth = ref(0);

    onMounted(() => {
      // create a ref for each segment so it styles can be accessed when calculating the width
      // TODO: improve this
      segments?.forEach((segment) => {
        if (!segment.ref) {
          segment.ref = ref();
        }
      });

      // recalculate the pill width on resize
      window.addEventListener('resize', calculateActiveSegmentOffsetWidth);
    });

    onBeforeUnmount(() => {
      // remove the resize event listener before unmount
      window.removeEventListener('resize', calculateActiveSegmentOffsetWidth);
    });

    // recalculate the pill width on index change
    // TODO: look if necessary and listen for the segments prop to recalculate
    watch(activeIndex, () => calculateActiveSegmentOffsetWidth());

    const calculateActiveSegmentOffsetWidth = () => {
      const activeSegmentRef = segments![activeIndex.value].ref;
      if (activeSegmentRef?.value) offsetWidth.value = activeSegmentRef.value.offsetWidth;
    };

    const handleInputChange = (value: string, i: number) => {
      activeIndex.value = i;
      emit('change', value);
    };

    return () => (
      <ul class="grid auto-cols-[1fr] grid-flow-col rounded-2xl bg-bodySecundary p-2">
        <span
          class="z-2 col-[1] row-[1] rounded-xl bg-primaryLighter transition-transform duration-200 will-change-transform"
          style={[`transform:translateX(${offsetWidth.value * activeIndex.value}px)`]}
        />
        {segments?.map((segment, i) => (
          <li
            ref={segment.ref}
            class="relative select-none rounded-lg px-4 py-2 text-white first-of-type:col-[1] first-of-type:row-[1]"
          >
            <input
              class="peer sr-only"
              type="radio"
              id={segment.value}
              value={segment.value}
              onChange={() => handleInputChange(segment.value, i)}
              checked={i == activeIndex.value}
            />
            <label
              htmlFor={segment.value}
              class={[
                'flex h-full w-full  cursor-pointer items-center justify-center font-semibold',
                i == activeIndex.value && 'text-primary'
              ]}
            >
              {segment.label}
            </label>
          </li>
        ))}
      </ul>
    );
  }
});
