import { Fragment, type FC } from 'react';
import type { UserImport } from '@statsfm/statsfm.js';
import clsx from 'clsx';
import {
  IMPORT_STATUS,
  IMPORT_STATUS_COLORS,
  getMonthName,
  getOrdinal,
} from '@/utils/imports';
import { Menu, Transition } from '@headlessui/react';
import { MdMoreVert } from 'react-icons/md';
import { Button } from '../Button';

export const ImportItem: FC<
  UserImport & { deleteItem: (id: number) => Promise<void> }
> = ({ name, status, count, createdAt, id, deleteItem }) => {
  return (
    <li className="flex items-center justify-between gap-x-6 py-5">
      <div className="min-w-0">
        <div className="flex items-start gap-x-3">
          <p className="my-0 font-semibold leading-6 text-white">
            {name ?? 'No name present'}
          </p>
          <div
            className={clsx(
              'my-0 flex-none rounded-md bg-foreground py-1 px-2 text-xs font-medium',
              IMPORT_STATUS_COLORS[
                status.toString() as keyof typeof IMPORT_STATUS_COLORS
              ]
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
          <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
            <circle cx={1} cy={1} r={1} />
          </svg>
          <p className="truncate">{count.toLocaleString()} streams</p>
        </div>
      </div>
      <div className="flex flex-none items-center gap-x-4">
        <Button
          onClick={() => deleteItem(id)}
          className="hidden bg-red-500 text-white hover:bg-red-700 sm:block"
        >
          Delete
        </Button>
        <Menu as="div" className="relative flex-none md:hidden">
          <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
            <span className="sr-only">Open options</span>
            <MdMoreVert className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <a
                    onClick={() => deleteItem(id)}
                    className={clsx(
                      active ? 'bg-gray-50' : '',
                      'block px-3 py-1 text-sm leading-6 text-gray-900'
                    )}
                  >
                    Delete import
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </li>
  );
};
