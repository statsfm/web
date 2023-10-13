import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { Segment } from './context';
import { SegmentedControlsContext } from './context';

interface Props {
  defaultIndex?: number;
  onChange: (value: string) => void;
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLUListElement>, keyof Props>;
export type SegmentedControlsProps = Props & NativeAttrs;

// TODO: add emit types
const SegmentedControls = ({
  defaultIndex = 0,
  onChange,
  children,
  ...props
}: PropsWithChildren<SegmentedControlsProps>) => {
  const [activeHighlight, setActiveHighlight] = useState(defaultIndex);
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [active, setActive] = useState<string>();

  const [offsetWidth, setOffsetWidth] = useState(0);
  const [segments, setSegments] = useState<Segment[]>([]);

  const calculateActiveSegmentOffsetWidth = () => {
    const activeSegmentRef = segments[activeHighlight]?.ref;

    if (activeSegmentRef?.current)
      setOffsetWidth(activeSegmentRef.current.offsetWidth);
  };

  useEffect(() => {
    // recalculate the pill width on resize
    window.addEventListener('resize', calculateActiveSegmentOffsetWidth);

    return () => {
      // remove the resize event listener on component unmount
      window.removeEventListener('resize', calculateActiveSegmentOffsetWidth);
    };
  }, []);

  const getIndexById = (id: string) =>
    segments.findIndex((segment) => segment.id === id);

  const getIdByIndex = (index: number) => segments[index]?.id ?? null;

  const register = (segment: Segment) => {
    setSegments((prevSegments) => [...prevSegments, segment]);
  };

  const unregister = (id: string) => {
    setSegments(segments.filter((segment) => segment.id !== id));
  };

  const highlight = (id: string) => {
    const index = getIndexById(id);

    return {
      onMouseOver: () => {
        calculateActiveSegmentOffsetWidth();
        setActive(id);
        setActiveHighlight(index);
      },
      onMouseLeave: () => {
        calculateActiveSegmentOffsetWidth();
        setActive(getIdByIndex(activeIndex) ?? '');
        setActiveHighlight(activeIndex);
      },
    };
  };

  const set = (id: string, initial = false) => {
    const index = getIndexById(id);
    setActiveIndex(index);
    setActive(id);

    if (!initial) {
      const segment = segments[index];
      onChange(segment!.value);
    }
  };

  // improve performance
  let firstSegmentMounted = false;
  useEffect(() => {
    if (segments.length > 0) firstSegmentMounted = true;

    calculateActiveSegmentOffsetWidth();

    if (firstSegmentMounted) {
      set(segments[0]?.id ?? '', true);
    }

    if (segments.find((segment) => segment.defaultSelected)) {
      const defaultSelectedSegment = segments.find(
        (segment) => segment.defaultSelected
      );
      set(defaultSelectedSegment!.id, true);
    }
  }, [segments]);

  const values = useMemo(
    () => ({
      register,
      unregister,
      highlight,
      set,
      active,
    }),
    [active, highlight, register, set, unregister]
  );

  return (
    <SegmentedControlsContext.Provider value={values}>
      <ul
        className={clsx(
          'grid h-max auto-cols-[1fr] grid-flow-col rounded-2xl bg-foreground p-1.5',
          props.className
        )}
      >
        <span
          className={clsx(
            'col-[1] row-[1] rounded-xl bg-primary/10 transition-all duration-200 will-change-transform',
            segments[activeHighlight]?.disabled && 'bg-background'
          )}
          style={{
            transform: `translateX(${offsetWidth * activeHighlight}px)`,
            width: `${offsetWidth}px`,
          }}
        />
        {children}
      </ul>
    </SegmentedControlsContext.Provider>
  );
};

export default SegmentedControls;
