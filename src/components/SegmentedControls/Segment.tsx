import clsx from 'clsx';
import type { MouseEvent, PropsWithChildren } from 'react';
import { useId, useEffect, useRef } from 'react';
import { useSegmentedControlsContext } from './context';

interface Props {
  value: string;
  disabled?: boolean;
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLLIElement>, keyof Props>;
export type SegmentProps = Props & NativeAttrs;

const Segment = ({
  value,
  disabled = false,
  children,
  ...props
}: PropsWithChildren<SegmentProps>) => {
  const { register, unregister, highlight, set, active } =
    useSegmentedControlsContext();

  const id = useId();
  const internalRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    register({ id, value, ref: internalRef, disabled });

    return () => {
      unregister(id);
    };
  }, []);

  const bindings = highlight(id);

  const handleChange = (e: MouseEvent) => {
    if (e.type === 'click' && disabled) return;
    set(id);
  };

  return (
    <li
      id={id}
      ref={internalRef}
      {...bindings}
      className={clsx(
        'relative flex cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-lg px-4 py-1 font-semibold transition duration-200 first-of-type:col-[1] first-of-type:row-[1] hover:text-primary',
        active === id ? 'text-primary' : 'text-white',
        disabled && 'text-gray-400 cursor-not-allowed hover:text-gray-400'
      )}
      onClick={handleChange}
      {...props}
    >
      {children}
    </li>
  );
};

export default Segment;
