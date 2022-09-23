import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { useNavigate, Direction } from './Carousel';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  next?: boolean;
}

export const SectionToolbarCarouselNavigationButton = ({
  next,
  ...props
}: Props) => {
  const [bindings, disabled] = useNavigate(
    next ? Direction.Next : Direction.Previous
  );

  return (
    <button
      className={clsx(
        'rounded-full bg-foreground p-2 transition-all',
        !disabled ? 'active:scale-95' : ''
      )}
      {...bindings}
      {...props}
    >
      {next ? (
        <MdNavigateNext className={!disabled ? 'fill-white' : ''} />
      ) : (
        <MdNavigateBefore className={!disabled ? 'fill-white' : ''} />
      )}
    </button>
  );
};
