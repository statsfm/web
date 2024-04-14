import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { Button } from '@/components/Button';

type AlertDialogCancelProps = AlertDialogPrimitive.AlertDialogCancelProps;

export const Cancel = ({ children, ...props }: AlertDialogCancelProps) => {
  return (
    <AlertDialogPrimitive.Cancel {...props}>
      {/* TODO: add secundary/text variant to button */}
      <Button className="bg-transparent hover:bg-transparent active:bg-transparent text-white">
        Cancel
      </Button>
    </AlertDialogPrimitive.Cancel>
  );
};
