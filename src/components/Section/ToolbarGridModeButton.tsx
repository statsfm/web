import clsx from 'clsx';
import { MdGridOff, MdGridOn } from 'react-icons/md';
import { ActionType } from '../Carousel';
import { useCarouselContext } from '../Carousel/context';

export const SectionToolbarGridmode = () => {
  const [state, dispatch] = useCarouselContext();

  return (
    <button
      aria-label={'grid mode'}
      className={clsx(
        'rounded-full bg-foreground p-2 transition-all',

        'focus-within:ring-2 focus:outline-none focus:ring focus:ring-neutral-500'
      )}
      onClick={() => {
        dispatch({ value: !state.gridMode, type: ActionType.SetGridMode });
      }}
    >
      {state.gridMode ? (
        <MdGridOff className="text-white opacity-80" />
      ) : (
        <MdGridOn className="text-white opacity-80" />
      )}
    </button>
  );
};
