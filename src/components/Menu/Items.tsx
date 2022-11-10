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
import { useMenuContext } from './context';
import { ActionType, Focus, MenuState } from './MenuRoot';

export interface ItemsProps extends HTMLAttributes<HTMLUListElement> {
  placement?: Placement;
}

export const Items = ({
  placement = 'bottom-end',
  className,
  children,
  ...props
}: PropsWithChildren<ItemsProps>) => {
  const id = useId();
  const [state, dispatch] = useMenuContext();

  const { x, y, reference, floating, strategy } = useFloating({
    middleware: [offset(8)],
    placement,
  });

  const offScreenRef = useOffscreen(() => {
    dispatch({ type: ActionType.CloseMenu });
  });

  useLayoutEffect(() => {
    reference(state.buttonRef.current);
    floating(state.itemsRef.current);
  }, [state.itemsRef, state.buttonRef]);

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
    <>
      {state.menuState === MenuState.Open && (
        <ul
          id={id}
          // TODO: this funky react business needs to go but this does the job for now.
          ref={(el) => {
            floating(el);
            offScreenRef(el);
            state.itemsRef.current = el;
          }}
          className={clsx(
            'absolute z-20 max-h-96 min-w-max rounded-xl bg-foreground py-2 shadow-xl overflow-y-hidden',
            className
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
    </>
  );
};
