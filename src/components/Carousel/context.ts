import type { Dispatch } from 'react';
import { createContext, useContext } from 'react';
import type { StateDefinition, Action } from './CarouselRoot';

export const CarouselContext = createContext<
  [StateDefinition, Dispatch<Action>] | null
>(null);

export const useCarouselContext = () => {
  const context = useContext(CarouselContext);
  if (!context) throw new Error('missing parent <Carousel /> component.');
  return context;
};
