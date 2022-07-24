import clsx from 'clsx';
import type {
  HTMLAttributes,
  PropsWithChildren,
  WheelEventHandler,
} from 'react';
import { useRef } from 'react';

interface Props extends HTMLAttributes<HTMLUListElement> {}

const ChipGroup = ({ children, ...props }: PropsWithChildren<Props>) => {
  const ref = useRef<HTMLUListElement>(null);

  const handleWheelScroll: WheelEventHandler = (e) => {
    if (ref.current) ref.current.scrollLeft += e.deltaY || e.deltaX; // deltaX for trackpads
  };

  return (
    <ul
      className={clsx(
        'flex flex-nowrap gap-2 overflow-x-auto',
        props.className
      )}
      onWheel={handleWheelScroll}
      ref={ref}
      {...props}
    >
      {children}
    </ul>
  );
};

export default ChipGroup;
