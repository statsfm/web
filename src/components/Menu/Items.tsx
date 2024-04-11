import type {
  HTMLAttributes,
  KeyboardEventHandler,
  PropsWithChildren,
} from 'react';
import { useLayoutEffect, useId } from 'react';
import { Keys } from '@/types/keyboard';
import type { Placement } from '@floating-ui/react-dom';
import { offset, useFloating } from '@floating-ui/react-dom';
import { useOffscreen } from '@/hooks/use-offscreen';
import clsx from 'clsx';
import { Transition } from '@headlessui/react';
import { useMenuContext } from './context';
import { ActionType, Focus, MenuState } from './MenuRoot';

export interface ItemsProps extends HTMLAttributes<HTMLUListElement> {
  placement?: Placement;
  open?: boolean;
}

export const Items = ({
  placement = 'bottom-end',
  className,
  children,
  ...props
}: PropsWithChildren<ItemsProps>) => {
  const id = useId();
  const [state, dispatch] = useMenuContext();

  const { x, y, refs, strategy } = useFloating({
    middleware: [offset(8)],
    placement,
  });

  const offScreenRef = useOffscreen(() => {
    dispatch({ type: ActionType.CloseMenu });
  });

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
      refs.setReference(state.buttonRef.current);
      refs.setFloating(state.itemsRef.current);
    }, [state.itemsRef, state.buttonRef]);
  }

  const useKeyDown: KeyboardEventHandler = (e) => {
    // eslint-disable-next-line default-case
    switch (e.key) {
      // https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-12

      case Keys.Enter:
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: ActionType.CloseMenu });

        if (state.activeItemIndex !== null) {
          state.items[
            state.activeItemIndex
          ]?.dataRef.current.domRef.current?.click();
        }

        // TODO: replace with some disposable or nextTick function to wait for the DOM flush
        setTimeout(() => {
          state.buttonRef.current?.focus();
        }, 100);
        break;

      case Keys.ArrowDown:
      case Keys.Tab:
        e.preventDefault();
        e.stopPropagation();

        dispatch({ type: ActionType.Focus, focus: Focus.Next });
        break;

      case Keys.ArrowUp:
        e.preventDefault();
        e.stopPropagation();

        dispatch({ type: ActionType.Focus, focus: Focus.Previous });
        break;

      case Keys.Home:
      case Keys.PageUp:
        e.preventDefault();
        e.stopPropagation();

        dispatch({ type: ActionType.Focus, focus: Focus.First });
        break;

      case Keys.End:
      case Keys.PageDown:
        e.preventDefault();
        e.stopPropagation();

        dispatch({ type: ActionType.Focus, focus: Focus.Last });
        break;

      case Keys.Escape:
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: ActionType.CloseMenu });

        setTimeout(() => {
          state.buttonRef.current?.focus({ preventScroll: true });
        }, 100);
        break;
    }
  };

  return (
    <Transition
      as="div"
      show={state.menuState === MenuState.Open}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      {state.menuState === MenuState.Open && (
        <ul
          id={id}
          // TODO: this funky react business needs to go but this does the job for now.
          ref={(el) => {
            refs.setFloating(el);
            offScreenRef(el);
            state.itemsRef.current = el;
          }}
          className={clsx(
            'absolute z-20 max-h-96 min-w-max overflow-y-hidden rounded-xl bg-foreground py-2 shadow-xl',
            className,
          )}
          aria-activedescendant={
            state.activeItemIndex === null
              ? undefined
              : state.items[state.activeItemIndex]?.id
          }
          aria-labelledby={state.buttonRef.current?.id}
          role="menu"
          tabIndex={-1}
          onKeyDown={useKeyDown}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
          {...props}
        >
          {children}
        </ul>
      )}
    </Transition>
  );
};
