import type {
  HTMLAttributes,
  KeyboardEventHandler,
  PropsWithChildren,
} from 'react';
import { useId } from 'react';
import { Keys } from '@/types/keyboard';
import { useMenuContext } from './context';
import { ActionType, Focus, MenuState } from './MenuRoot';

export interface ItemsProps extends HTMLAttributes<HTMLUListElement> {}

export const Items = ({
  children,
  ...props
}: PropsWithChildren<ItemsProps>) => {
  const id = useId();
  const [state, dispatch] = useMenuContext();

  const useKeyDown: KeyboardEventHandler = (e) => {
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
      default:
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
          ref={state.itemsRef}
          className="absolute z-20 mt-2 rounded-xl bg-foreground py-3 shadow-xl"
          aria-activedescendant={
            state.activeItemIndex === null
              ? undefined
              : state.items[state.activeItemIndex]?.id
          }
          aria-labelledby={state.buttonRef.current?.id}
          role="menu"
          tabIndex={-1}
          onKeyDown={useKeyDown}
          {...props}
        >
          {children}
        </ul>
      )}
    </>
  );
};
