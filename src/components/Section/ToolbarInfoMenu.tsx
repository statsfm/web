import type { PropsWithChildren } from 'react';
import { MdInfoOutline, MdMoreHoriz } from 'react-icons/md';
import { DropdownMenu } from '@/components/ui/DropdownMenu';

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
    <DropdownMenu>
      <DropdownMenu.Trigger
        aria-label="More options"
        // TODO: refactor out focus rings to separate class
        className="rounded-full bg-foreground p-2 outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-background active:scale-95"
      >
        <MdMoreHoriz className="text-white" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" className="max-w-96">
          {children}

          {/* extract info menu item to seperate component */}
          {description && link && (
            <DropdownMenu.Item>
              <a
                className="flex gap-2 [&>svg]:shrink-0"
                target="blank"
                href={link}
              >
                <MdInfoOutline className="text-white" />
                {description}
              </a>
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
};
