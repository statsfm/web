import type { PropsWithChildren } from 'react';
import { MdInfoOutline, MdMoreHoriz } from 'react-icons/md';
import { Menu } from '@/components/Menu';

interface Props {
  description?: string;
  link?: string;
}

export const SectionToolbarInfoMenu = ({
  description,
  link,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <Menu>
      <Menu.Button
        aria-label="More options"
        className="rounded-full bg-foreground p-2 focus-within:ring-2 focus:outline-none focus:ring focus:ring-neutral-500 active:scale-95"
      >
        <MdMoreHoriz className="text-white" />
      </Menu.Button>
      <Menu.Items className="w-96">
        {children}

        {/* extract info menu item to seperate component */}
        {description && link && (
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
        )}
      </Menu.Items>
    </Menu>
  );
};
