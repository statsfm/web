import clsx from 'clsx';
import type { HTMLAttributes, PropsWithChildren } from 'react';

interface Props extends HTMLAttributes<HTMLUListElement> {}

const ChipGroup = ({ children, ...props }: PropsWithChildren<Props>) => {
  return (
    <ul
      {...props}
      className={clsx('flex gap-2 overflow-y-auto', props.className)}
    >
      {children}
    </ul>
  );
};

export default ChipGroup;
