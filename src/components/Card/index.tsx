import clsx from 'clsx';
import type { FC, PropsWithChildren } from 'react';

export const Card: FC<PropsWithChildren<{ className?: string }>> = (props) => {
  return (
    <div
      className={clsx('w-full rounded-2xl bg-foreground p-5', props.className)}
    >
      {props.children}
    </div>
  );
};
