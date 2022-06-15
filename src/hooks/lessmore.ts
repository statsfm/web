import { ref, Ref, watch } from 'vue';

// hooks
import { useToggle } from './toggle';

export const useLessMore = <T>(list: Ref<T[]>, limit: number) => {
  const { state: showMore, on: more, off: less, toggle } = useToggle();
  // https://github.com/vuejs/core/issues/2136
  const data = ref<T[]>(list.value.slice(0, limit)) as Ref<T[]>;

  // TODO: clean up
  watch(list, (list) => {
    data.value = showMore.value ? list : list.slice(0, limit);
  });

  watch(showMore, (state) => {
    data.value = state ? list.value : list.value.slice(0, limit);
  });

  return {
    showMore,
    data,
    less,
    more,
    toggle
  };
};
