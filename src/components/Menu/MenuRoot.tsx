import { useOutsideClick } from '@/hooks';
import type {
  HTMLAttributes,
  MutableRefObject,
  PropsWithChildren,
  Reducer,
} from 'react';
import { createRef, useReducer } from 'react';
import { MenuContext } from './context';

export enum MenuState {
  Open,
  Closed,
}

export enum ActivationTrigger {
  Pointer,
  Other,
}

export enum Focus {
  First,
  Previous,
  Next,
  Last,
  Specific,
  Nothing,
}

export type MenuItemDataRef = MutableRefObject<{
  value?: string;
  domRef: MutableRefObject<HTMLElement | null>;
  disabled: boolean;
}>;

type MenuStateItem = { id: string; dataRef: MenuItemDataRef };

export interface StateDefinition {
  menuState: MenuState;
  buttonRef: MutableRefObject<HTMLButtonElement | null>;
  itemsRef: MutableRefObject<HTMLUListElement | null>;
  items: MenuStateItem[];
  activeItemIndex: number | null;
  activationTrigger: ActivationTrigger;
}

export enum ActionType {
  OpenMenu,
  CloseMenu,
  Focus,
  Register,
  Unregister,
}

export type Action =
  | { type: ActionType.CloseMenu }
  | { type: ActionType.OpenMenu }
  | {
      type: ActionType.Focus;
      focus: Focus.Specific;
      id: string;
      trigger?: ActivationTrigger;
    }
  | {
      type: ActionType.Focus;
      focus: Exclude<Focus, Focus.Specific>;
      trigger?: ActivationTrigger;
    }
  | { type: ActionType.Register; id: string; dataRef: MenuItemDataRef }
  | { type: ActionType.Unregister; id: string };

const reducer = (state: StateDefinition, action: Action) => {
  switch (action.type) {
    case ActionType.CloseMenu: {
      if (state.menuState === MenuState.Closed) return state;
      return { ...state, activeItemIndex: null, menuState: MenuState.Closed };
    }
    case ActionType.OpenMenu: {
      if (state.menuState === MenuState.Open) return state;
      return { ...state, menuState: MenuState.Open };
    }
    case ActionType.Focus: {
      const activeIndex = state.activeItemIndex ?? -1;
      // if (state.items <= 0) return null

      const resolveDisabled = (item: MenuStateItem) =>
        item.dataRef.current.disabled;

      const nextActiveIndex = (() => {
        switch (action.focus) {
          case Focus.First:
            // find the first item that's not disabled to focus
            return state.items.findIndex((item) => !resolveDisabled(item));

          case Focus.Previous: {
            const index = state.items
              .slice()
              .reverse()
              .findIndex((item, i, items) => {
                if (activeIndex !== -1 && items.length - i - 1 >= activeIndex)
                  return false;
                return !resolveDisabled(item);
              });

            if (index === -1) return index;
            return state.items.length - 1 - index;
          }

          case Focus.Next:
            return state.items.findIndex((item, i) => {
              if (i <= activeIndex) return false;
              return !resolveDisabled(item);
            });

          case Focus.Last: {
            const index = state.items
              .slice()
              .reverse()
              .findIndex((item) => !resolveDisabled(item));

            if (index === -1) return index;
            return state.items.length - 1 - index;
          }

          case Focus.Specific:
            return state.items.findIndex((item) => item.id === action.id);

          case Focus.Nothing:
            return null;

          default:
            throw new Error('lblbadlbjd');
        }
      })();

      const activeItemIndex =
        nextActiveIndex === -1 ? state.activeItemIndex : nextActiveIndex;

      if (activeItemIndex !== null)
        state.items[activeItemIndex]?.dataRef.current.domRef.current?.focus();

      return {
        ...state,
        activeItemIndex,
        activationTrigger: action.trigger ?? ActivationTrigger.Other,
      };
    }
    case ActionType.Register: {
      return {
        ...state,
        items: [...state.items, { id: action.id, dataRef: action.dataRef }],
      };
    }
    case ActionType.Unregister: {
      const adjustedItems = state.items;

      const index = state.items.findIndex((a) => a.id === action.id);
      if (index !== -1) adjustedItems.splice(index, 1);

      return {
        ...state,
        items: adjustedItems,
      };
    }
    default: {
      throw new Error('aaa');
    }
  }
};

export interface MenuRootProps extends HTMLAttributes<HTMLElement> {}

export const MenuRoot = ({
  children,
  ...props
}: PropsWithChildren<MenuRootProps>) => {
  const [state, dispatch] = useReducer<Reducer<StateDefinition, Action>>(
    reducer,
    {
      menuState: MenuState.Closed,
      buttonRef: createRef(),
      itemsRef: createRef(),
      items: [],
      activeItemIndex: null,
      activationTrigger: ActivationTrigger.Other,
    }
  );

  useOutsideClick(state.itemsRef, () => {
    dispatch({ type: ActionType.CloseMenu });
  });

  return (
    <MenuContext.Provider value={[state, dispatch]}>
      <div className="relative" {...props}>
        {children}
      </div>
    </MenuContext.Provider>
  );
};
