import { PropsWithChildren } from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

type AlertDialogProps =
  PropsWithChildren<AlertDialogPrimitive.AlertDialogProps>;

export const Root = ({ children, ...props }: AlertDialogProps) => {
  return (
    <AlertDialogPrimitive.Root {...props}>{children}</AlertDialogPrimitive.Root>
  );
};
