import type { ElementRef, PropsWithChildren } from 'react';
import { forwardRef } from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { Button } from '@/components/Button';

type AlertDialogProps =
  PropsWithChildren<AlertDialogPrimitive.AlertDialogProps>;

export const Root = ({ children, ...props }: AlertDialogProps) => {
  return (
    <AlertDialogPrimitive.Root {...props}>{children}</AlertDialogPrimitive.Root>
  );
};

type AlertDialogTriggerProps =
  PropsWithChildren<AlertDialogPrimitive.AlertDialogTriggerProps>;

export const Trigger = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Trigger>,
  AlertDialogTriggerProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <AlertDialogPrimitive.Trigger ref={forwardedRef} {...props}>
      {children}
    </AlertDialogPrimitive.Trigger>
  );
});
Trigger.displayName = 'Trigger';

type AlertDialogPortalProps =
  PropsWithChildren<AlertDialogPrimitive.AlertDialogPortalProps>;

export const Portal = ({ children, ...props }: AlertDialogPortalProps) => {
  return (
    <AlertDialogPrimitive.Portal {...props}>
      {children}
    </AlertDialogPrimitive.Portal>
  );
};

type AlertDialogContentProps =
  PropsWithChildren<AlertDialogPrimitive.AlertDialogContentProps>;

export const Content = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <AlertDialogPrimitive.Content
      ref={forwardedRef}
      className="fixed left-1/2 top-1/2 max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-foreground p-4 shadow-2xl"
      {...props}
    >
      {children}
    </AlertDialogPrimitive.Content>
  );
});
Content.displayName = 'Content';

type AlertDialogOverlayProps =
  PropsWithChildren<AlertDialogPrimitive.AlertDialogOverlayProps>;

export const Overlay = ({ children, ...props }: AlertDialogOverlayProps) => {
  return (
    <AlertDialogPrimitive.Overlay
      {...props}
      className="fixed inset-0 bg-black/40"
    >
      {children}
    </AlertDialogPrimitive.Overlay>
  );
};

type AlertDialogTitleProps =
  PropsWithChildren<AlertDialogPrimitive.AlertDialogTitleProps>;

export const Title = ({ children, ...props }: AlertDialogTitleProps) => {
  return (
    <AlertDialogPrimitive.Title {...props}>
      {children}
    </AlertDialogPrimitive.Title>
  );
};

type AlertDialogDescriptionProps =
  PropsWithChildren<AlertDialogPrimitive.AlertDialogDescriptionProps>;

export const Description = ({
  children,
  ...props
}: AlertDialogDescriptionProps) => {
  return (
    <AlertDialogPrimitive.Description {...props}>
      {children}
    </AlertDialogPrimitive.Description>
  );
};

type AlertDialogCancelProps = AlertDialogPrimitive.AlertDialogCancelProps;

export const Cancel = ({ ...props }: AlertDialogCancelProps) => {
  return (
    <AlertDialogPrimitive.Cancel {...props}>
      {/* TODO: add secundary/text variant to button */}
      <Button className="bg-transparent text-white hover:bg-transparent active:bg-transparent">
        Cancel
      </Button>
    </AlertDialogPrimitive.Cancel>
  );
};

type AlertDialogActionProps =
  PropsWithChildren<AlertDialogPrimitive.AlertDialogActionProps>;

export const Action = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Action>,
  AlertDialogActionProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <AlertDialogPrimitive.Action ref={forwardedRef} {...props}>
      {children}
    </AlertDialogPrimitive.Action>
  );
});
Action.displayName = 'Action';

export const AlertDialog = Object.assign(Root, {
  Trigger,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Cancel,
  Action,
});
