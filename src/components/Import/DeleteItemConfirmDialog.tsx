import { AlertDialog } from '@/components/ui/AlertDialog';
import { MdDeleteOutline } from 'react-icons/md';
import { Button } from '../Button';

type DeleteItemConfirmDialogProps = {
  onDeleteImportItem: () => void;
  streamCount: number;
};

export const DeleteItemConfirmDialog = ({
  onDeleteImportItem,
  streamCount,
}: DeleteItemConfirmDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialog.Trigger>
        <MdDeleteOutline />
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay />
        <AlertDialog.Content>
          <AlertDialog.Title>Are you sure?</AlertDialog.Title>
          <AlertDialog.Description>
            You are about to delete {streamCount.toLocaleString()} streams. This
            action cannot be undone
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel />
            <AlertDialog.Action>
              <Button
                className="bg-red-500 text-white hover:bg-red-700"
                onClick={onDeleteImportItem}
              >
                Confirm
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};
