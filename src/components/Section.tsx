import { Keys } from '@/types/keyboard';
import clsx from 'clsx';
import type {
  HTMLAttributes,
  KeyboardEventHandler,
  PropsWithChildren,
} from 'react';
import { useContext } from 'react';
import { ActionType } from './Carousel';
import { CarouselContext } from './Carousel/context';

interface Props extends HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  toolbar?: JSX.Element;
  sticky?: boolean;
}

export const Section = ({
  title,
  description,
  toolbar,
  sticky,
  children,
  ...props
}: PropsWithChildren<Props>) => {
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
        className={clsx(
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

      <main {...props}>{children}</main>
    </section>
  );
};
