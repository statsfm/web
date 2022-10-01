import { Keys } from '@/types/keyboard';
import clsx from 'clsx';
import { forwardRef, useContext } from 'react';
import type {
  ForwardedRef,
  HTMLAttributes,
  KeyboardEventHandler,
  ReactNode,
} from 'react';
import { ActionType } from './Carousel';
import { CarouselContext } from './Carousel/context';

interface SectionRenderPropArg {
  ref: ForwardedRef<HTMLElement>;
}

interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  title: string;
  description?: string;
  toolbar?: JSX.Element;
  sticky?: boolean;
  headerStyle?: string;
  children:
    | ((args: SectionRenderPropArg) => ReactNode | ReactNode[])
    | ReactNode
    | ReactNode[];
}

// eslint-disable-next-line react/display-name
export const Section = forwardRef<HTMLElement, Props>(
  (
    { title, description, toolbar, sticky, children, headerStyle, ...props },
    ref
  ) => {
    const context = useContext(CarouselContext);

    // TODO: move event handler
    const handleKeyDown: KeyboardEventHandler = (e) => {
      if (context) {
        const [state, dispatch] = context;

        switch (e.key) {
          case Keys.ArrowLeft:
            if (!state.isPreviousDisabled)
              dispatch({ type: ActionType.Previous });
            break;
          case Keys.ArrowRight:
            if (!state.isNextDisabled) dispatch({ type: ActionType.Next });
            break;
          default:
        }
      }
    };

    return (
      <section onKeyDown={handleKeyDown}>
        <header
          ref={ref}
          className={clsx(
            headerStyle,
            sticky === undefined || sticky === true ? 'sticky top-0' : '',
            'z-30 flex items-center justify-between bg-background pt-10 pb-3'
          )}
        >
          <div>
            <h2>{title}</h2>
            <p className="my-0">{description}</p>
          </div>

          <div className="flex gap-2">{toolbar}</div>
        </header>

        <main {...props}>
          {typeof children === 'function' ? children({ ref }) : children}
        </main>
      </section>
    );
  }
);
