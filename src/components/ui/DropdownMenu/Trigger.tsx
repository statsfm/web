import { PropsWithChildren } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

type DropdownMenuTriggerProps =
  PropsWithChildren<DropdownMenuPrimitive.DropdownMenuTriggerProps>;

export const Trigger = ({ children, ...props }: DropdownMenuTriggerProps) => {
  return (
    <DropdownMenuPrimitive.Trigger {...props}>
      {children}
    </DropdownMenuPrimitive.Trigger>
  );
};
