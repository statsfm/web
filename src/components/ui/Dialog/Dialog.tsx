import type { ElementRef, PropsWithChildren } from 'react';
import { forwardRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

type DialogProps = PropsWithChildren<DialogPrimitive.DialogProps>;

export const Root = ({ children, ...props }: DialogProps) => {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
};

type DialogTriggerProps = PropsWithChildren<DialogPrimitive.DialogTriggerProps>;

export const Trigger = forwardRef<
  ElementRef<typeof DialogPrimitive.Trigger>,
  DialogTriggerProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <DialogPrimitive.Trigger ref={forwardedRef} {...props}>
      {children}
    </DialogPrimitive.Trigger>
  );
});
Trigger.displayName = 'Trigger';

type DialogPortalProps = PropsWithChildren<DialogPrimitive.DialogPortalProps>;

export const Portal = ({ children, ...props }: DialogPortalProps) => {
  return <DialogPrimitive.Portal {...props}>{children}</DialogPrimitive.Portal>;
};

type DialogContentProps = PropsWithChildren<DialogPrimitive.DialogContentProps>;

export const Content = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <DialogPrimitive.Content
      ref={forwardedRef}
      className="fixed left-1/2 top-1/2 max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-foreground p-4 shadow-2xl"
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  );
});
Content.displayName = 'Content';

type DialogOverlayProps = PropsWithChildren<DialogPrimitive.DialogOverlayProps>;

export const Overlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <DialogPrimitive.Overlay
      ref={forwardedRef}
      {...props}
      className="fixed inset-0 bg-black/40"
    >
      {children}
    </DialogPrimitive.Overlay>
  );
});
Overlay.displayName = 'Overlay';

type DialogTitleProps = PropsWithChildren<DialogPrimitive.DialogTitleProps>;

export const Title = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <DialogPrimitive.Title ref={forwardedRef} {...props}>
      {children}
    </DialogPrimitive.Title>
  );
});
Title.displayName = 'Title';

type DialogDescriptionProps =
  PropsWithChildren<DialogPrimitive.DialogDescriptionProps>;

export const Description = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <DialogPrimitive.Description ref={forwardedRef} {...props}>
      {children}
    </DialogPrimitive.Description>
  );
});
Description.displayName = 'Descripton';

type DialogCloseProps = DialogPrimitive.DialogCloseProps;

export const Close = forwardRef<
  ElementRef<typeof DialogPrimitive.Close>,
  DialogCloseProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <DialogPrimitive.Close ref={forwardedRef} {...props}>
      {children}
    </DialogPrimitive.Close>
  );
});
Close.displayName = 'Close';

export const Dialog = Object.assign(Root, {
  Trigger,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Close,
});
