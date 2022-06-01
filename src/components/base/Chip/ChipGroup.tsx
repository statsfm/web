import { defineComponent, ref } from 'vue';

export default defineComponent((props, { slots }) => {
  const chipGroupRef = ref<HTMLUListElement>();

  const handleWheelScroll = (e: WheelEvent) => {
    if (chipGroupRef.value) chipGroupRef.value.scrollLeft += e.deltaY || e.deltaX; // deltaX for trackpads
  };

  return () => (
    <ul
      class="flex flex-nowrap gap-2 overflow-x-auto"
      onWheel={handleWheelScroll}
      ref={chipGroupRef}
    >
      {slots.default && slots.default()}
    </ul>
  );
});
