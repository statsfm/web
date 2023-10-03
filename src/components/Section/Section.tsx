import { Keys } from '@/types/keyboard';
import clsx from 'clsx';
import { forwardRef, Fragment, useContext, useRef } from 'react';
import type {
  HTMLAttributes,
  KeyboardEventHandler,
  ReactNode,
  RefObject,
} from 'react';
import type { UserPrivacySettings } from '@statsfm/statsfm.js';
import { MdVisibilityOff } from 'react-icons/md';
import { Popover, Transition } from '@headlessui/react';
import Link from 'next/link';
import { offset, useFloating } from '@floating-ui/react-dom';
import { ActionType, CarouselContext } from '@/components/Carousel';
import { usePrivacyScope, useScopeContext } from '@/components/PrivacyScope';

const ToolbarPrivacySettingsInfoPopover = ({
  scope,
}: {
  scope?: keyof UserPrivacySettings;
}) => {
  const scopeContext = useScopeContext();
  const scopeValid = usePrivacyScope(scope!, false);

  const { x, y, reference, floating, strategy } = useFloating({
    middleware: [offset(8)],
    placement: 'bottom-end',
  });

  if (
    !scopeValid &&
    (scopeContext?.as?.id || null) === scopeContext?.target.id &&
    scope !== undefined
  ) {
    return (
      <Popover>
        <Popover.Button
          ref={reference}
          className="rounded-full bg-foreground p-2 transition-all focus-within:ring-2 focus:outline-none focus:ring focus:ring-neutral-500 active:scale-95"
        >
          <MdVisibilityOff className="fill-white" />
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Popover.Panel
            ref={floating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
            }}
            className="z-40 w-80"
          >
            <div className="rounded-xl bg-foreground p-4 font-medium">
              This section is currently{' '}
              <span className="text-white underline">only visible by you</span>.
              You can change this by setting the privacy toggle in the{' '}
              <Link href="/settings/privacy" className="text-primary">
                settings
              </Link>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    );
  }

  return <></>;
};

interface SectionRenderPropArg {
  headerRef: RefObject<HTMLElement>;
}

interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  title?: string;
  description?: string;
  toolbar?: JSX.Element;
  sticky?: boolean;
  scope?: keyof UserPrivacySettings;
  headerStyle?: string;
  children:
    | ((args: SectionRenderPropArg) => ReactNode | ReactNode[])
    | ReactNode
    | ReactNode[];
}

// eslint-disable-next-line react/display-name
export const Section = forwardRef<HTMLElement, Props>(
  (
    {
      title,
      description,
      toolbar,
      sticky,
      scope,
      children,
      headerStyle,
      ...props
    },
    ref
  ) => {
    const context = useContext(CarouselContext);
    const headerRef = useRef<HTMLDivElement>(null);

    // TODO: move event handler
    const handleKeyDown: KeyboardEventHandler = (e) => {
      if (context) {
        const [state, dispatch] = context;

        switch (e.key) {
          case Keys.ArrowLeft:
            if (!state.isPreviousDisabled)
              dispatch({ type: ActionType.Previous });
            break;
          case Keys.ArrowRight:
            if (!state.isNextDisabled) dispatch({ type: ActionType.Next });
            break;
          default:
        }
      }
    };

    return (
      <section onKeyDown={handleKeyDown} ref={ref}>
        <header
          ref={headerRef}
          className={clsx(
            headerStyle,
            sticky === undefined || sticky === true ? 'sticky top-0' : '',
            'z-30 flex items-center justify-between bg-background pt-10 pb-3'
          )}
        >
          <div className="w-full overflow-hidden truncate">
            <h2>{title}</h2>
            <p className="my-0 max-w-[60%] truncate">{description}</p>
          </div>

          <div className="flex shrink-0 gap-2">
            <ToolbarPrivacySettingsInfoPopover scope={scope} />
            {toolbar}
          </div>
        </header>

        <main {...props}>
          {typeof children === 'function' ? children({ headerRef }) : children}
        </main>
      </section>
    );
  }
);
