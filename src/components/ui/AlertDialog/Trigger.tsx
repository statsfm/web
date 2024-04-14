import { ElementRef, PropsWithChildren, forwardRef } from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

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
