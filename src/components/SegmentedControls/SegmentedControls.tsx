import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import type { Segment, SegmentedControlsContextProps } from './context';
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
        setActiveHighlight(index);
      },
      onMouseLeave: () => {
        calculateActiveSegmentOffsetWidth();
        setActiveHighlight(activeIndex);
      },
    };
  };

  const set = (id: string) => {
    const index = getIndexById(id);
    setActiveIndex(index);

    const segment = segments[index];
    onChange(segment!.value);
  };

  useEffect(() => {
    const id = segments[activeHighlight]?.id;
    setActive(id ?? segments[defaultIndex]?.id);
  }, [activeHighlight]);

  const exposed: SegmentedControlsContextProps = {
    register,
    unregister,
    highlight,
    set,
    active,
  };

  return (
    <SegmentedControlsContext.Provider value={exposed}>
      <ul
        className={clsx(
          'grid h-max auto-cols-[1fr] grid-flow-col rounded-2xl bg-foreground p-1.5',
          props.className
        )}
      >
        <span
          className="col-[1] row-[1] rounded-xl bg-primary/10 transition-all duration-200 will-change-transform"
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
