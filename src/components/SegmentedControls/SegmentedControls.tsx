import clsx from 'clsx';
import type { HTMLAttributes, MutableRefObject } from 'react';
import { useEffect, useState } from 'react';

interface Segment {
  label: string;
  value: string;
  ref: MutableRefObject<HTMLLIElement | undefined>;
}

interface Props extends HTMLAttributes<HTMLElement> {
  segments: Segment[];
  defaultIndex?: number;

  onSegmentSelect: (payload: string) => void;
}

// TODO: add emit types
const SegmentedControls = ({
  segments,
  defaultIndex = 0,
  onSegmentSelect,
}: Props) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [offsetWidth, setOffsetWidth] = useState(0);

  const calculateActiveSegmentOffsetWidth = () => {
    const activeSegmentRef = segments[activeIndex]?.ref;

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

  const handleInputChange = (value: string, i: number) => {
    // recalculate the pill width on index change
    // TODO: look if necessary and listen for the segments prop to recalculate
    calculateActiveSegmentOffsetWidth();
    setActiveIndex(i);
    onSegmentSelect(value);
  };

  return (
    <ul className="grid h-max auto-cols-[1fr] grid-flow-col rounded-2xl bg-foreground p-1.5">
      <span
        className="col-[1] row-[1] rounded-xl bg-primary/10 transition-all duration-200 will-change-transform"
        style={{ transform: `translateX(${offsetWidth * activeIndex}px)` }}
      />

      {segments.map((segment, i) => (
        <li
          key={i}
          // TODO: fix type
          // @ts-ignore
          ref={segment.ref}
          className="relative select-none rounded-lg px-4 py-1 text-white first-of-type:col-[1] first-of-type:row-[1]"
        >
          <input
            className="peer sr-only"
            type="radio"
            id={segment.value}
            value={segment.value}
            onChange={() => handleInputChange(segment.value, i)}
            checked={i === activeIndex}
          />
          <label
            htmlFor={segment.value}
            className={clsx(
              'flex cursor-pointer items-center justify-center whitespace-nowrap font-semibold',
              i === activeIndex && 'text-primary'
            )}
          >
            {segment.label}
          </label>
        </li>
      ))}
    </ul>
  );
};

export default SegmentedControls;
