import clsx from 'clsx';
import type { FC, PropsWithChildren } from 'react';

export const Overlay: FC<
  PropsWithChildren<{ visible: boolean; className?: string }>
> = ({ children, visible, className }) => {
  return (
    <div
      className={clsx(
        className,
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
        'absolute top-0 z-30 size-full bg-background/60 transition-opacity',
      )}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center">
        <span className="text-lg text-white">{children}</span>
      </div>
    </div>
  );
};
