import clsx from 'clsx';
import type { HTMLAttributes, PropsWithChildren, ElementType } from 'react';
import { forwardRef } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

// eslint-disable-next-line react/display-name
export const Container = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  ({ as: Component = 'div', className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={clsx(
          'mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8',
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
