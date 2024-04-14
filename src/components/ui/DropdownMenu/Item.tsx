import { ElementRef, PropsWithChildren, forwardRef } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

type DropdownMenuItemProps =
  PropsWithChildren<DropdownMenuPrimitive.DropdownMenuItemProps>;

export const Item = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Item
      ref={forwardedRef}
      className="group leading-none px-4 py-3 rounded-md gap-2 flex items-center font-medium relative outline-none data-[disabled]:pointer-events-none data-[highlighted]:ring-2 data-[highlighted]:ring-neutral-500 data-[highlighted]:bg-background data-[highlighted]:cursor-pointer"
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
});
