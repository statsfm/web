import type { HTMLAttributes, PropsWithChildren } from 'react';
import clsx from 'clsx';

interface Props extends HTMLAttributes<HTMLButtonElement> {}

const Button = ({ children, ...props }: PropsWithChildren<Props>) => {
  return (
    <button
      onClick={props.onClick}
      className={clsx(
        'inline-flex items-center justify-center whitespace-nowrap rounded-2xl bg-primary/10 py-3 px-5 text-base font-bold text-primary shadow-sm transition-colors hover:bg-primary/20 active:bg-primary/5',
        props.className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
