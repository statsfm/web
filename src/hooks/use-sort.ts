import { useEffect, useState } from 'react';

export interface SortOptions<T> {
  label: string;
  value: string;
  compare: (a: T, b: T) => number;
}

export type SortDirection = 'asc' | 'desc';

export const useSort = <T>(list: T[], options: SortOptions<T>[]) => {
  // const sortDirection = ref<SortDirection>('asc');
  const [sorted, setSorted] = useState<T[]>(list);

  const setSortKey = (key: string) => {
    setSorted(
      [...list].sort(options.find((option) => option.value === key)?.compare)
    );
  };

  // set the sorted by default to the list
  useEffect(() => {
    setSorted(list);
  }, [list]);

  // const handleSortDirectionToggle = () => {
  //   sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  //   if (sortDirection.value === 'desc') data.value = data.value.reverse();
  // };

  return {
    sorted,
    // sortDirection,
    setSortKey,
    // handleSortDirectionToggle
  };
};
