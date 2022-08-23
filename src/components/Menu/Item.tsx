import type {
  FocusEventHandler,
  HTMLAttributes,
  MouseEventHandler,
  PropsWithChildren,
} from 'react';
import { useRef, useEffect, useId } from 'react';
import { useMenuContext } from './context';
import type { MenuItemDataRef } from './MenuRoot';
import { ActivationTrigger, ActionType, Focus } from './MenuRoot';

export interface ItemProps
  extends Omit<HTMLAttributes<HTMLLIElement>, 'onClick'> {
  disabled?: boolean;

  onClick: (value: string) => void;
}

export const Item = ({
  disabled = false,
  onClick,
  children,
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
    bag.current.value = internalRef.current?.textContent?.toLowerCase();
  }, [bag, internalRef]);

  useEffect(() => {
    dispatch({ type: ActionType.Register, id, dataRef: bag });

    return () => dispatch({ type: ActionType.Unregister, id });
  }, [bag, id]);

  const handleClick: MouseEventHandler = (e) => {
    if (disabled) e.preventDefault();
    onClick(bag.current.value ?? '');
    dispatch({ type: ActionType.Focus, focus: Focus.Specific, id });
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
      className="cursor-pointer select-none px-4 py-2 font-semibold text-white focus:bg-background/80 focus:outline-none"
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
      {children}
    </li>
  );
};
