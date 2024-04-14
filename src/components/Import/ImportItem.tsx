import { type FC } from 'react';
import { Platform } from '@/utils/statsfm';
import type { UserImport } from '@/utils/statsfm';
import clsx from 'clsx';
import {
  IMPORT_STATUS,
  IMPORT_STATUS_COLORS,
  getMonthName,
  getOrdinal,
} from '@/utils/imports';
import { DeleteItemConfirmDialog } from './DeleteItemConfirmDialog';

export const ImportItem: FC<
  UserImport & { deleteItem: (id: number) => Promise<void> }
> = ({ name, status, count, createdAt, id, deleteItem, service }) => {
  const handleDeleteImportItem = () => {
    deleteItem(id);
  };

  return (
    <li className="flex items-center justify-between gap-x-6 py-5">
      <div className="min-w-0">
        <div className="flex items-start gap-x-3">
          <p className="my-0 font-semibold leading-6 text-white">
            {name ?? 'No name present'}
          </p>
          <div
            className={clsx(
              'my-0 flex-none rounded-md bg-foreground px-2 py-1 text-xs font-medium',
              IMPORT_STATUS_COLORS[
                status.toString() as keyof typeof IMPORT_STATUS_COLORS
              ],
            )}
          >
            {IMPORT_STATUS[status.toString() as keyof typeof IMPORT_STATUS]}
          </div>
        </div>
        <div className="mt-1 flex items-center gap-x-2 text-sm leading-5 text-gray-500">
          <p className="whitespace-nowrap">
            Imported on the {createdAt.getDate()}
            {getOrdinal(createdAt.getDate())} of{' '}
            {getMonthName(createdAt.getMonth())} {createdAt.getFullYear()} at{' '}
            {createdAt.toLocaleTimeString(navigator.language, {
              timeStyle: 'short',
            })}
          </p>

          {(service === Platform.SPOTIFY ||
            (service === Platform.APPLEMUSIC && [1, 2].includes(status))) && (
            <>
              <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                <circle cx={1} cy={1} r={1} />
              </svg>
              <p className="truncate">{count.toLocaleString()} streams</p>
            </>
          )}
        </div>
      </div>

      <DeleteItemConfirmDialog
        onDeleteImportItem={handleDeleteImportItem}
        streamCount={count}
      />
    </li>
  );
};
