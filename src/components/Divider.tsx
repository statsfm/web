import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLHRElement> {
  invert?: boolean;
}

export const Divider = ({ invert = false, className, ...props }: Props) => (
  <hr
    className={clsx(
      'my-2',
      invert ? 'border-background' : 'border-foreground',
      className
    )}
    {...props}
  />
);
