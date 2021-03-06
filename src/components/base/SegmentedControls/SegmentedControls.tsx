import { defineComponent, HTMLAttributes, onBeforeUnmount, onMounted, Ref, ref, watch } from 'vue';

interface Segment {
  label: string;
  value: string;
  ref?: Ref;
}

interface Props extends HTMLAttributes {
  segments: Segment[];
  defaultIndex?: number;
}

// TODO: add emit types
const SegmentedControls = defineComponent<Props>(({ segments, defaultIndex = 0 }, { emit }) => {
  const activeIndex = ref(defaultIndex);
  const offsetWidth = ref(0);

  onMounted(() => {
    // create a ref for each segment so it styles can be accessed when calculating the width
    // TODO: improve this
    segments?.forEach((segment) => {
      if (!segment.ref) segment.ref = ref<HTMLLIElement>();
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
    emit('select', value);
  };

  return () => (
    <ul class="grid auto-cols-[1fr] grid-flow-col rounded-2xl bg-bodySecundary p-1.5">
      <span
        class="z-2 col-[1] row-[1] rounded-xl bg-primaryLighter transition-transform duration-200 will-change-transform"
        style={[`transform:translateX(${offsetWidth.value * activeIndex.value}px)`]}
      />
      {segments?.map((segment, i) => (
        <li
          ref={segment.ref}
          class="relative select-none rounded-lg px-4 py-1 text-white first-of-type:col-[1] first-of-type:row-[1]"
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
            for={segment.value}
            class={[
              'flex cursor-pointer items-center justify-center whitespace-nowrap font-semibold',
              i == activeIndex.value && 'text-primary'
            ]}
          >
            {segment.label}
          </label>
        </li>
      ))}
    </ul>
  );
});

//  TODO: look why whe can't directly use typescript generics as props without defining the props like this
SegmentedControls.props = ['segments', 'defaultIndex'];

export default SegmentedControls;
