import { PropsWithChildren } from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

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
