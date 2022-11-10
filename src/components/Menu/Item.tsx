import type {
  FocusEventHandler,
  HTMLAttributes,
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
} from 'react';
import { useRef, useEffect, useId } from 'react';
import clsx from 'clsx';
import { useMenuContext } from './context';
import type { MenuItemDataRef } from './MenuRoot';
import { ActivationTrigger, ActionType, Focus } from './MenuRoot';

export interface ItemProps
  extends Omit<HTMLAttributes<HTMLLIElement>, 'onClick'> {
  disabled?: boolean;
  icon?: ReactNode;
  value?: string;

  onClick?: (value: string) => void;
}

export const Item = ({
  disabled = false,
  icon,
  value,
  onClick,
  children,
  className,
  ...props
}: PropsWithChildren<ItemProps>) => {
  const id = useId();
  const internalRef = useRef<HTMLLIElement | null>(null);

  const [state, dispatch] = useMenuContext();
  const active =
    state.activeItemIndex !== null
      ? state.items[state.activeItemIndex]?.id === id
      : false;

  const bag = useRef<MenuItemDataRef['current']>({
    disabled,
    domRef: internalRef,
  });

  useEffect(() => {
    bag.current.disabled = disabled;
  }, [bag, disabled]);

  useEffect(() => {
    bag.current.value =
      value ?? internalRef.current?.textContent?.toLowerCase();
  }, [bag, internalRef]);

  useEffect(() => {
    dispatch({ type: ActionType.Register, id, dataRef: bag });

    return () => dispatch({ type: ActionType.Unregister, id });
  }, [bag, id]);

  const handleClick: MouseEventHandler = (e) => {
    if (disabled) e.preventDefault();
    if (onClick) onClick(bag.current.value ?? '');
    dispatch({ type: ActionType.CloseMenu });

    // TODO: replace with some disposable or nextTick function to wait for the DOM flush
    setTimeout(() => {
      state.buttonRef.current?.focus();
    }, 100);
  };

  const handleFocus: FocusEventHandler = () => {
    if (disabled) dispatch({ type: ActionType.Focus, focus: Focus.Nothing });
    dispatch({ type: ActionType.Focus, focus: Focus.Specific, id });
  };

  const handleMove: MouseEventHandler = () => {
    if (disabled) return;
    if (active) return;

    dispatch({
      type: ActionType.Focus,
      focus: Focus.Specific,
      id,
      trigger: ActivationTrigger.Pointer,
    });
  };

  const handleLeave: MouseEventHandler = () => {
    if (disabled) return;
    if (!active) return;
    dispatch({ type: ActionType.Focus, focus: Focus.Nothing });
  };

  return (
    <li
      id={id}
      ref={internalRef}
      className={clsx(
        'flex w-full max-w-md select-none flex-wrap gap-2 px-4 py-2 font-semibold focus:bg-background/80 focus:outline-none',
        // TOOD: change color
        disabled
          ? 'text-text-grey'
          : 'cursor-pointer text-white [&>svg]:fill-white',
        className
      )}
      role="menuitem"
      tabIndex={disabled === true ? undefined : -1}
      aria-disabled={disabled === true ? true : undefined}
      onClick={handleClick}
      onFocus={handleFocus}
      onPointerMove={handleMove}
      onMouseMove={handleMove}
      onPointerLeave={handleLeave}
      onMouseLeave={handleLeave}
      {...props}
    >
      {icon}
      {children}
    </li>
  );
};
