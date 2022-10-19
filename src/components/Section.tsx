import { Keys } from '@/types/keyboard';
import clsx from 'clsx';
import { useContext, useRef } from 'react';
import type {
  HTMLAttributes,
  KeyboardEventHandler,
  ReactNode,
  FC,
  RefObject,
} from 'react';
import { ActionType } from './Carousel';
import { CarouselContext } from './Carousel/context';

interface SectionRenderPropArg {
  headerRef: RefObject<HTMLElement>;
}

interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  title?: string;
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
export const Section: FC<Props> = ({
  title,
  description,
  toolbar,
  sticky,
  children,
  headerStyle,
  ...props
}) => {
  const context = useContext(CarouselContext);
  const headerRef = useRef<HTMLDivElement>(null);

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
        ref={headerRef}
        className={clsx(
          headerStyle,
          sticky === undefined || sticky === true ? 'sticky top-0' : '',
          'z-30 flex items-center justify-between bg-background pt-10 pb-3'
        )}
      >
        <div className="w-full overflow-hidden truncate">
          <h2>{title}</h2>
          <p className="my-0 max-w-[60%] truncate">{description}</p>
        </div>

        <div className="flex shrink-0 gap-2">{toolbar}</div>
      </header>

      <main {...props}>
        {typeof children === 'function' ? children({ headerRef }) : children}
      </main>
    </section>
  );
};
