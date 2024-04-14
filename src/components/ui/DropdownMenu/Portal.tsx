import { PropsWithChildren } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

type DropdownMenuPortalProps =
  PropsWithChildren<DropdownMenuPrimitive.DropdownMenuPortalProps>;

export const Portal = ({ children, ...props }: DropdownMenuPortalProps) => {
  return (
    <DropdownMenuPrimitive.Portal {...props}>
      {children}
    </DropdownMenuPrimitive.Portal>
  );
};
