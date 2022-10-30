import type { OlHTMLAttributes, PropsWithChildren } from 'react';
import { createContext } from 'react';
import { useCarouselContext } from './context';

export const RegisterContext = createContext<{ register: boolean }>({
  register: false,
});

export interface ItemsProps extends OlHTMLAttributes<HTMLUListElement> {}

export const Items = ({ children }: PropsWithChildren<ItemsProps>) => {
  const [state] = useCarouselContext();

  return (
    <div className="overflow-hidden">
      <ul
        className="flex w-full flex-col"
        style={{ gap: `${state.gap}px` }}
        ref={state.itemsRef}
      >
        <ul
          className="z-[21] grid w-max grid-flow-col justify-start bg-background transition-transform duration-300 ease-in-out"
          style={{
            gap: `${state.gap}px`,
            gridTemplateRows: `repeat(${state.rows}, minmax(0, 1fr))`,
            transform: `translateX(${state.transformX}px)`,
          }}
        >
          <RegisterContext.Provider value={{ register: true }}>
            {children}
          </RegisterContext.Provider>
        </ul>
        {state.gridMode && (
          <div
            style={{
              height: `${state.gridHeight}px`,
              transform: `translateY(-${state.transformY}px)`,
            }}
            className="relative w-full transition-transform"
          >
            <div className="absolute z-20 h-full w-full transition-transform duration-300 ease-in-out">
              <ul
                className="bottom-0 z-20 flex w-full flex-wrap justify-start transition-transform duration-300 ease-in-out"
                style={{
                  gap: `${state.gap}px`,
                }}
              >
                <RegisterContext.Provider value={{ register: false }}>
                  {children}
                </RegisterContext.Provider>
              </ul>
            </div>
          </div>
        )}
      </ul>
    </div>
  );
};
