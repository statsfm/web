import type {
  HTMLAttributes,
  MutableRefObject,
  PropsWithChildren,
  Reducer,
  TouchEventHandler,
} from 'react';
import React, { useState, useEffect, createRef, useReducer } from 'react';
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

  gridMode: boolean;
  gridHeight: number;

  itemWidth: number;
  itemHeight: number;
  fixedHeight: boolean;

  transformX: number;
  transformY: number;

  current: number;
  slide?: number;
  rows: number;
  gap: number;
}

export enum ActionType {
  Previous,
  Next,
  Register,
  Unregister,
  SetGridHeight,
  SetTransformY,
  SetItemWidth,
  SetItemHeight,
  SetRows,
  SetGap,
  SetGridMode,
}

export type Action =
  | { type: ActionType.Previous; amount?: number }
  | { type: ActionType.Next; amount?: number }
  | { type: ActionType.Register; id: string; domRef: CarouselStateItemDomRef }
  | { type: ActionType.Unregister; id: string }
  | { type: ActionType.SetItemWidth; value: number }
  | { type: ActionType.SetItemHeight; value: number }
  | { type: ActionType.SetRows; value: number }
  | { type: ActionType.SetGap; value: number }
  | { type: ActionType.SetGridMode; value: boolean }
  | { type: ActionType.SetGridHeight; value: number }
  | { type: ActionType.SetTransformY; value: number };

const reducer = (state: StateDefinition, action: Action) => {
  switch (action.type) {
    case ActionType.Previous:
    case ActionType.Next: {
      // main slidey bits
      const direction =
        action.type === ActionType.Next ? Direction.Next : Direction.Previous;
      const itemsWidth = state.itemsRef.current!.clientWidth;
      // TODO: only calculate in state.slide is not passed
      const numberOfItemsVisible = Math.floor(itemsWidth / state.itemWidth);
      const numberOfItemsToSlide =
        action.amount ?? state.slide ?? numberOfItemsVisible;

      const slideTo = Math.min(
        Math.max(0, state.current - direction * numberOfItemsToSlide),
        state.items.length
      );

      const slideAmount = -1 * direction;
      const numberOfSlides = state.items.length / state.rows;

      const transformX =
        state.transformX +
        Math.abs(slideAmount) *
          direction *
          (state.itemWidth + state.gap) *
          numberOfItemsToSlide;

      // grid stuff
      const amountOfTopRowsSeen = slideTo / numberOfItemsToSlide + 1;
      const transformY = amountOfTopRowsSeen * (state.itemHeight + state.gap);

      const rowsOfItems = Math.ceil(state.items.length / numberOfItemsToSlide);
      const gridHeight =
        (state.itemHeight + state.gap) * rowsOfItems - transformY;

      return {
        ...state,
        transformX,
        transformY,
        gridHeight,
        current: slideTo,
        isPreviousDisabled: slideTo - numberOfItemsToSlide < 0,
        isNextDisabled: slideTo + numberOfItemsToSlide >= numberOfSlides - 1,
      };
    }
    case ActionType.Register: {
      const itemsVisible =
        state.itemsRef.current!.clientWidth / state.itemWidth;

      return {
        ...state,
        items: [...state.items, { id: action.id, domRef: action.domRef }],
        isNextDisabled: state.items.length + 1 < itemsVisible,
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
    case ActionType.SetGridMode:
      return { ...state, gridMode: action.value };
    case ActionType.SetTransformY:
      return { ...state, transformY: action.value };
    case ActionType.SetGridHeight:
      return { ...state, gridHeight: action.value };
    case ActionType.SetItemWidth:
      return { ...state, itemWidth: action.value };
    case ActionType.SetItemHeight:
      return { ...state, itemHeight: action.value };
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
  slide?: number;
  gridMode?: boolean;
  itemHeight?: number;
}

export const CarouselRoot = ({
  rows = 1,
  gap = 16,
  gridMode = false,
  itemHeight,
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

      gridMode,
      gridHeight: 0,

      itemWidth: 0,
      itemHeight: itemHeight ?? 0,
      fixedHeight: itemHeight !== undefined,

      transformX: 0,
      transformY: 0,

      current: 0,
      slide: props.slide,
      rows,
      gap,
    }
  );

  useEffect(() => {
    const itemWidth = state.items[0]?.domRef.current?.clientWidth ?? 0;
    const newItemHeight =
      itemHeight ?? state.items[0]?.domRef.current?.clientHeight ?? 0;
    const transformY = newItemHeight + gap;

    const numberOfItemsVisible = Math.floor(
      (state.itemsRef.current?.clientWidth ?? 0) / itemWidth
    );

    const rowsOfItems = Math.ceil(state.items.length / numberOfItemsVisible);
    const gridHeight = (newItemHeight + state.gap) * rowsOfItems - transformY;

    dispatch({
      type: ActionType.SetGridHeight,
      value: gridHeight,
    });

    dispatch({
      type: ActionType.SetItemWidth,
      value: itemWidth,
    });

    dispatch({
      type: ActionType.SetTransformY,
      value: transformY,
    });

    if (!state.fixedHeight) {
      dispatch({
        type: ActionType.SetItemHeight,
        value: newItemHeight,
      });
    }
  }, [state.items]);

  const [swipe, setSwipe] = useState(0);

  const handleTouchStart: TouchEventHandler = (e) => {
    const touch = e.changedTouches[0];
    setSwipe(touch?.pageX ?? 0);
  };

  const handleTouchEnd: TouchEventHandler = (e) => {
    const touch = e.changedTouches[0];

    if (touch) {
      const deltaX = touch.pageX - swipe;
      const swipeDirection = deltaX > 0 ? Direction.Previous : Direction.Next;

      const disabled =
        swipeDirection === Direction.Next
          ? state.isNextDisabled
          : state.isPreviousDisabled;

      const swipeAmount = Math.abs(deltaX);
      const numberOfSlidesToSwipe = Math.floor(swipeAmount / state.itemWidth);

      if (!disabled)
        dispatch({
          type:
            swipeDirection === Direction.Next
              ? ActionType.Next
              : ActionType.Previous,
          amount: numberOfSlidesToSwipe === 0 ? 1 : numberOfSlidesToSwipe,
        });
    }
  };

  return (
    <CarouselContext.Provider value={[state, dispatch]}>
      <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
};
