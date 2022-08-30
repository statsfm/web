import type {
  HTMLAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  PropsWithChildren,
} from 'react';
import { useId } from 'react';
import { Keys } from '@/types/keyboard';
import { useMenuContext } from './context';
import { ActionType, Focus, MenuState } from './MenuRoot';

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {}

export const Button = ({
  children,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  const [state, dispatch] = useMenuContext();

  const reactId = useId();
  const id = state.buttonId ?? reactId;

  const handleKeyDown: KeyboardEventHandler = (e) => {
    // eslint-disable-next-line default-case
    switch (e.key) {
      case Keys.Space:
      case Keys.Enter:
      case Keys.ArrowDown:
        e.preventDefault();
        e.stopPropagation();

        dispatch({ type: ActionType.OpenMenu });

        setTimeout(() => {
          dispatch({ type: ActionType.Focus, focus: Focus.First });
        }, 100);
        break;

      case Keys.ArrowUp:
        e.preventDefault();
        e.stopPropagation();

        dispatch({ type: ActionType.OpenMenu });

        setTimeout(() => {
          dispatch({ type: ActionType.Focus, focus: Focus.Last });
        }, 100);
        break;
    }
  };

  const handleClick: MouseEventHandler = (e) => {
    if (state.menuState === MenuState.Open) {
      dispatch({ type: ActionType.CloseMenu });
      state.buttonRef.current?.focus();
    } else {
      e.preventDefault();
      dispatch({ type: ActionType.OpenMenu });
    }
  };

  return (
    <button
      id={id}
      ref={state.buttonRef}
      className="flex h-max gap-2 py-2 font-semibold text-white"
      aria-haspopup={true}
      aria-controls={state.itemsRef.current?.id}
      aria-expanded={state.menuState === MenuState.Open}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};
