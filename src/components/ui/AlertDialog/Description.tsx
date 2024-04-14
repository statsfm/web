import { PropsWithChildren } from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

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
