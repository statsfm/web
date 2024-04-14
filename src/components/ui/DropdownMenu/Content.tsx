import { PropsWithChildren } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

type DropdownMenuContentProps =
  PropsWithChildren<DropdownMenuPrimitive.DropdownMenuContentProps>;

export const Content = ({
  children,
  sideOffset = 10,
  ...props
}: DropdownMenuContentProps) => {
  return (
    <DropdownMenuPrimitive.Content
      className="min-w-56 rounded-xl bg-foreground py-2 shadow-xl z-50"
      sideOffset={sideOffset}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Content>
  );
};
