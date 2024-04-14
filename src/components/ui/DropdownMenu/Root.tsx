import { PropsWithChildren } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

type DropdownMenuRootProps =
  PropsWithChildren<DropdownMenuPrimitive.DropdownMenuProps>;

export const Root = ({ children, ...props }: DropdownMenuRootProps) => {
  return (
    <DropdownMenuPrimitive.Root {...props}>
      {children}
    </DropdownMenuPrimitive.Root>
  );
};
