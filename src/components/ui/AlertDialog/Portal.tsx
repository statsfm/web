import { PropsWithChildren } from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

type AlertDialogPortalProps =
  PropsWithChildren<AlertDialogPrimitive.AlertDialogPortalProps>;

export const Portal = ({ children, ...props }: AlertDialogPortalProps) => {
  return (
    <AlertDialogPrimitive.Portal {...props}>
      {children}
    </AlertDialogPrimitive.Portal>
  );
};
