import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import { useId, useEffect, useRef } from 'react';
import { useSegmentedControlsContext } from './context';

interface Props {
  value: string;
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLLIElement>, keyof Props>;
export type SegmentProps = Props & NativeAttrs;

const Segment = ({
  value,
  children,
  ...props
}: PropsWithChildren<SegmentProps>) => {
  const { register, unregister, highlight, set, active } =
    useSegmentedControlsContext();

  const id = useId();
  const internalRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    register({ id, value, ref: internalRef });

    return () => {
      unregister(id);
    };
  }, []);

  const bindings = highlight(id);

  const handleChange = () => {
    set(id);
  };

  return (
    <li
      id={id}
      ref={internalRef}
      {...bindings}
      className={clsx(
        'relative flex cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-lg px-4 py-1 font-semibold first-of-type:col-[1] first-of-type:row-[1]',
        active === id ? 'text-primary' : 'text-white'
      )}
      onClick={handleChange}
      {...props}
    >
      {children}
    </li>
  );
};

export default Segment;
