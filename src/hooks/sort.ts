import { ref, Ref } from 'vue';

export interface SortOptions<T> {
  label: string;
  value: string;
  compare: (a: T, b: T) => number;
}

export type SortDirection = 'asc' | 'desc';

export const useSort = <T>(list: T[], options: SortOptions<T>[]) => {
  // const sortDirection = ref<SortDirection>('asc');
  const data = ref(list) as Ref<T[]>;

  const setSortKey = (key: string) => {
    data.value = [...list].sort(options.find((option) => option.value == key)?.compare);
  };

  // const handleSortDirectionToggle = () => {
  //   sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  //   if (sortDirection.value === 'desc') data.value = data.value.reverse();
  // };

  return {
    data,
    // sortDirection,
    setSortKey
    // handleSortDirectionToggle
  };
};
