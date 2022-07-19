import clsx from 'clsx';
import type { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<Element> {}

export const Container: FC<Props> = (props) => (
  <div
    className={clsx(
      'mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8',
      props.className
    )}
  >
    {props.children}
  </div>
);
