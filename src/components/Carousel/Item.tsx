import type { LiHTMLAttributes, PropsWithChildren } from 'react';
import { useRef, useEffect, useId } from 'react';
import { ActionType } from './CarouselRoot';
import { useCarouselContext } from './context';

export interface ItemProps extends LiHTMLAttributes<HTMLLIElement> {}

export const Item = ({ children, ...props }: PropsWithChildren<ItemProps>) => {
  const id = useId();
  const internalRef = useRef<HTMLLIElement | null>(null);

  const [, dispatch] = useCarouselContext();

  useEffect(() => {
    dispatch({ type: ActionType.Register, id, domRef: internalRef });

    return () => dispatch({ type: ActionType.Unregister, id });
  }, []);

  return (
    <li id={id} ref={internalRef} {...props}>
      {children}
    </li>
  );
};
