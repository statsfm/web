import { useEffect, useState } from 'react';
import { useToggle } from './use-toggle';

export const useLessOrAll = <T>(list: T[], limit: number) => {
  const { state: showAll, on: more, off: less, toggle } = useToggle();
  const [data, setData] = useState<T[]>(list.slice(0, limit));

  useEffect(() => {
    setData(showAll ? list : list.slice(0, limit));
  }, [list, showAll]);

  return {
    showAll,
    data,
    less,
    more,
    toggle,
  };
};
