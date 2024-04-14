import { ElementRef, PropsWithChildren, forwardRef } from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

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
