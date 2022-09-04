import { ActionType, Direction } from './CarouselRoot';
import { useCarouselContext } from './context';

type UseNavigateBindings = { onClick: () => void; disabled: boolean };
type UseNavigateReturnType = [UseNavigateBindings, boolean];

export const useNavigate = (direction: Direction): UseNavigateReturnType => {
  const [state, dispatch] = useCarouselContext();

  const disabled =
    direction === Direction.Next
      ? state.isNextDisabled
      : state.isPreviousDisabled;

  return [
    {
      onClick: () =>
        direction === Direction.Next
          ? dispatch({ type: ActionType.Next })
          : dispatch({ type: ActionType.Previous }),
      disabled,
    },
    disabled,
  ];
};
