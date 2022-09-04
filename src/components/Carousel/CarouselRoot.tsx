import type {
  HTMLAttributes,
  MutableRefObject,
  PropsWithChildren,
  Reducer,
} from 'react';
import React, { useEffect, createRef, useReducer } from 'react';
import { CarouselContext } from './context';

export enum Direction {
  Next = -1,
  Previous = 1,
}

type CarouselStateItemDomRef = MutableRefObject<HTMLLIElement | null>;

type CarouselStateItem = {
  id: string;
  domRef: CarouselStateItemDomRef;
};

export interface StateDefinition {
  itemsRef: MutableRefObject<HTMLUListElement | null>;
  items: CarouselStateItem[];

  isNextDisabled: boolean;
  isPreviousDisabled: boolean;

  current: number;
  transform: number;
  slide: number;
  width: number;
  rows: number;
  gap: number;
}

export enum ActionType {
  Previous,
  Next,
  Register,
  Unregister,
  SetWidth,
  SetRows,
  SetGap,
}

export type Action =
  | { type: ActionType.Previous }
  | { type: ActionType.Next }
  | { type: ActionType.Register; id: string; domRef: CarouselStateItemDomRef }
  | { type: ActionType.Unregister; id: string }
  | { type: ActionType.SetWidth; value: number }
  | { type: ActionType.SetRows; value: number }
  | { type: ActionType.SetGap; value: number };

const reducer = (state: StateDefinition, action: Action) => {
  switch (action.type) {
    case ActionType.Previous:
    case ActionType.Next: {
      const direction =
        action.type === ActionType.Next ? Direction.Next : Direction.Previous;

      const slideTo = Math.min(
        Math.max(0, state.current - direction * state.slide),
        state.items.length
      );

      const slideAmount = -1 * direction;
      const newTransform =
        state.transform +
        Math.abs(slideAmount) *
          direction *
          (state.width + state.gap) *
          state.slide;

      return {
        ...state,
        current: slideTo,
        transform: newTransform,
        isPreviousDisabled: slideTo < state.slide,
        isNextDisabled: slideTo >= state.items.length - state.slide,
      };
    }
    case ActionType.Register: {
      return {
        ...state,
        items: [...state.items, { id: action.id, domRef: action.domRef }],
        isNextDisabled: false,
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
    case ActionType.SetWidth:
      return { ...state, width: action.value };
    case ActionType.SetRows:
      return { ...state, rows: action.value };
    case ActionType.SetGap:
      return { ...state, gap: action.value };
    default:
      return state;
  }
};

export interface CarouselRootProps extends HTMLAttributes<HTMLUListElement> {
  rows?: number;
  gap?: number;
  // the items to slide on navigation click
  slide: number;
}

export const CarouselRoot = ({
  rows = 1,
  gap = 16,
  children,
  ...props
}: PropsWithChildren<CarouselRootProps>) => {
  const [state, dispatch] = useReducer<Reducer<StateDefinition, Action>>(
    reducer,
    {
      itemsRef: createRef(),
      items: [],

      isPreviousDisabled: true,
      isNextDisabled: true,

      current: 0,
      transform: 0,
      slide: props.slide,
      width: 0,
      rows,
      gap,
    }
  );

  useEffect(() => {
    if (state.width === 0)
      dispatch({
        type: ActionType.SetWidth,
        value: state.items[0]?.domRef.current?.clientWidth ?? 0,
      });
  }, [state.items]);

  return (
    <CarouselContext.Provider value={[state, dispatch]}>
      {children}
    </CarouselContext.Provider>
  );
};
