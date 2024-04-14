import { PropsWithChildren } from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

type AlertDialogTitleProps =
  PropsWithChildren<AlertDialogPrimitive.AlertDialogTitleProps>;

export const Title = ({ children, ...props }: AlertDialogTitleProps) => {
  return (
    <AlertDialogPrimitive.Title {...props}>
      {children}
    </AlertDialogPrimitive.Title>
  );
};
