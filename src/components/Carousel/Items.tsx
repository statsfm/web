import type { OlHTMLAttributes, PropsWithChildren } from 'react';
import { useCarouselContext } from './context';

export interface ItemsProps extends OlHTMLAttributes<HTMLUListElement> {}

export const Items = ({ children }: PropsWithChildren<ItemsProps>) => {
  const [state] = useCarouselContext();

  return (
    <div className="overflow-hidden">
      <ul
        ref={state.itemsRef}
        className="grid grid-flow-col justify-start transition-transform duration-300 ease-in-out"
        style={{
          gridTemplateRows: `repeat(${state.rows}, minmax(0, 1fr))`,
          gap: `${state.gap}px`,
          transform: `translateX(${state.transform}px)`,
        }}
      >
        {children}
      </ul>
    </div>
  );
};
