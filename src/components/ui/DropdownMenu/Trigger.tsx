import { ElementRef, PropsWithChildren, forwardRef } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

type DropdownMenuTriggerProps =
  PropsWithChildren<DropdownMenuPrimitive.DropdownMenuTriggerProps>;

export const Trigger = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  DropdownMenuTriggerProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Trigger ref={forwardedRef} {...props}>
      {children}
    </DropdownMenuPrimitive.Trigger>
  );
});
