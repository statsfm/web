import clsx from 'clsx';
import type { HTMLAttributes, PropsWithChildren } from 'react';

interface Props extends HTMLAttributes<HTMLLIElement> {}

const Chip = ({ children, ...props }: PropsWithChildren<Props>) => (
  <li
    {...props}
    className={clsx(
      props.className,
      'h-max w-max whitespace-nowrap rounded-full bg-foreground px-4 py-2 font-medium text-white',
    )}
  >
    {children}
  </li>
);

export default Chip;
