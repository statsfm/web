import { ElementRef, PropsWithChildren, forwardRef } from 'react';
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
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-foreground rounded-xl p-4 shadow-2xl max-w-lg"
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  );
});

type DialogOverlayProps = PropsWithChildren<DialogPrimitive.DialogOverlayProps>;

export const Overlay = ({ children, ...props }: DialogOverlayProps) => {
  return (
    <DialogPrimitive.Overlay {...props} className="fixed inset-0 bg-black/40">
      {children}
    </DialogPrimitive.Overlay>
  );
};

type DialogTitleProps = PropsWithChildren<DialogPrimitive.DialogTitleProps>;

export const Title = ({ children, ...props }: DialogTitleProps) => {
  return <DialogPrimitive.Title {...props}>{children}</DialogPrimitive.Title>;
};

type DialogDescriptionProps =
  PropsWithChildren<DialogPrimitive.DialogDescriptionProps>;

export const Description = ({ children, ...props }: DialogDescriptionProps) => {
  return (
    <DialogPrimitive.Description {...props}>
      {children}
    </DialogPrimitive.Description>
  );
};

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

export const Dialog = Object.assign(Root, {
  Trigger,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Close,
});
