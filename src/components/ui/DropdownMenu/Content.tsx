import { ElementRef, PropsWithChildren, forwardRef } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

type DropdownMenuContentProps =
  PropsWithChildren<DropdownMenuPrimitive.DropdownMenuContentProps>;

export const Content = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ children, sideOffset = 10, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Content
      ref={forwardedRef}
      className="min-w-56 rounded-xl bg-foreground py-2 shadow-xl z-50"
      sideOffset={sideOffset}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Content>
  );
});
