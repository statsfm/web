import clsx from 'clsx';
import type { HTMLAttributes, PropsWithChildren, ElementType } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export const Container = ({
  as: Component = 'div',
  className,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  return (
    <Component
      className={clsx(
        'mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
