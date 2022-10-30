import { Transition } from '@headlessui/react';
import type { PropsWithChildren } from 'react';
import { MdInfoOutline, MdMoreHoriz } from 'react-icons/md';
import { Menu } from '../Menu';

interface Props {
  description: string;
  link: string;
}

export const SectionToolbarInfoMenu = ({
  description,
  link,
}: PropsWithChildren<Props>) => {
  return (
    <Menu>
      {({ open }) => (
        <>
          <Menu.Button
            aria-label="More options"
            className="rounded-full bg-foreground p-2 focus-within:ring-2 focus:outline-none focus:ring focus:ring-neutral-500 active:scale-95"
          >
            <MdMoreHoriz className="text-white" />
          </Menu.Button>
          {/* TODO: move transition to component itself */}
          <Transition
            as="div"
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="w-96">
              <Menu.Item>
                <a
                  className="flex gap-2 [&>svg]:shrink-0"
                  target="blank"
                  href={link}
                >
                  <MdInfoOutline className="text-white" />
                  {description}
                </a>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};
