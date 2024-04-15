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
        disabled
          ? 'pointer-events-none !bg-primary/20 text-black'
          : 'hover:bg-primary/20 active:bg-primary/5',
        'inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-primary/10 px-5 py-2 text-base font-bold text-primary shadow-sm transition-colors',
        props.className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
