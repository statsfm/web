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
import { MdMoreVert } from 'react-icons/md';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { Button } from '../Button';

export const ImportItem: FC<
  UserImport & { deleteItem: (id: number) => Promise<void> }
> = ({ name, status, count, createdAt, id, deleteItem, service }) => {
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
      <div className="flex flex-none items-center gap-x-4">
        {/* TODO: replace with confirm dialog */}
        <Button
          onClick={() => deleteItem(id)}
          className="hidden bg-red-500 text-white hover:bg-red-700 sm:block"
        >
          Delete
        </Button>
        <div className="sm:hidden">
          <DropdownMenu>
            <DropdownMenu.Trigger className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
              <span className="sr-only">Open options</span>
              <MdMoreVert className="size-5" aria-hidden="true" />
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Item>
                  <a onClick={() => deleteItem(id)}>Delete import</a>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu>
        </div>
      </div>
    </li>
  );
};
