import clsx from 'clsx';
import type { FC } from 'react';
import { MdGridOff, MdGridOn } from 'react-icons/md';
import { ActionType } from '../Carousel';
import { useCarouselContext } from '../Carousel/context';

type Props = {
  callback?: (gridMode: boolean) => boolean;
};

export const SectionToolbarGridMode: FC<Props> = (props) => {
  const [state, dispatch] = useCarouselContext();

  const clickHandler = () => {
    if (state.gridMode && window.scrollY > state.itemsRef.current!.offsetTop) {
      window.scrollTo({
        top: (state.itemsRef.current?.offsetTop ?? 0) - 120,
        behavior: 'smooth',
      });
    }

    let callbackValue = null;
    if (props.callback) {
      callbackValue = props.callback(state.gridMode);
    }

    dispatch({
      type: ActionType.SetGridMode,
      value: callbackValue !== null ? callbackValue : !state.gridMode,
    });
  };

  if (state.items.length > 0) {
    return (
      <button
        aria-label={'grid mode'}
        className={clsx(
          'rounded-full bg-foreground p-2 transition-all',

          'focus-within:ring-2 focus:outline-none focus:ring focus:ring-neutral-500'
        )}
        onClick={clickHandler}
      >
        {state.gridMode ? (
          <MdGridOff className="text-white opacity-80" />
        ) : (
          <MdGridOn className="text-white opacity-80" />
        )}
      </button>
    );
  }

  return <></>;
};
