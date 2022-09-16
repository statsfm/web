import type { HTMLAttributes, PropsWithChildren } from 'react';
import clsx from 'clsx';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

const Button = ({ disabled, children, ...props }: PropsWithChildren<Props>) => {
  return (
    <button
      {...props}
      onClick={props.onClick}
      className={clsx(
        props.className,
        disabled ? 'bg-primary/20' : 'hover:bg-primary/20 active:bg-primary/5',
        'inline-flex items-center justify-center whitespace-nowrap rounded-2xl bg-primary/10 py-3 px-5 text-base font-bold text-primary shadow-sm transition-colors'
      )}
    >
      {children}
    </button>
  );
};

export default Button;
