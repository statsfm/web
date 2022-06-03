import { Ref, ref, watch } from 'vue';

export const useLessMore = <T>(list: T[], limit: number) => {
  const showMore = ref(false);
  // https://github.com/vuejs/core/issues/2136
  const data = ref<T[]>(list.slice(0, limit)) as Ref<T[]>;

  const less = () => {
    showMore.value = false;
  };

  const more = () => {
    showMore.value = true;
  };

  const toggle = () => {
    showMore.value = !showMore.value;
  };

  watch(showMore, (state) => (data.value = state ? list : list.slice(0, limit)));

  return {
    showMore,
    data,
    less,
    more,
    toggle
  };
};
