import clsx from 'clsx';
import type { FC, PropsWithChildren } from 'react';
import { Button } from '../Button';

export const FriendsButtonFrame: FC<
  PropsWithChildren<{ red?: boolean; handler: () => void }>
> = ({ red, children, handler }) => (
  <Button
    className={clsx(
      red ? 'text-red-500' : '',
      'mx-0 w-min !bg-transparent !p-0 transition-opacity hover:opacity-80',
    )}
    onClick={handler}
  >
    {children}
  </Button>
);
