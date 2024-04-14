import { ElementRef, PropsWithChildren, forwardRef } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';

type DropdownMenuRootProps =
  PropsWithChildren<DropdownMenuPrimitive.DropdownMenuProps>;

export const Root = ({ children, ...props }: DropdownMenuRootProps) => {
  return (
    <DropdownMenuPrimitive.Root {...props}>
      {children}
    </DropdownMenuPrimitive.Root>
  );
};

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

type DropdownMenuPortalProps =
  PropsWithChildren<DropdownMenuPrimitive.DropdownMenuPortalProps>;

export const Portal = ({ children, ...props }: DropdownMenuPortalProps) => {
  return (
    <DropdownMenuPrimitive.Portal {...props}>
      {children}
    </DropdownMenuPrimitive.Portal>
  );
};

type DropdownMenuContentProps =
  PropsWithChildren<DropdownMenuPrimitive.DropdownMenuContentProps>;

export const Content = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ children, sideOffset = 10, className, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Content
      ref={forwardedRef}
      className={clsx(
        className,
        'min-w-56 max-h-96 p-1 overflow-y-auto overflow-x-visible rounded-xl bg-foreground py-2 shadow-xl z-50',
      )}
      sideOffset={sideOffset}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Content>
  );
});

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

export const Separator = () => {
  return <hr className="mx-3 my-1 border-t-2 border-neutral-400/10" />;
};

export const DropdownMenu = Object.assign(Root, {
  Trigger,
  Portal,
  Content,
  Item,
  Separator,
});
