import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { useNavigate, Direction } from '../Carousel';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  next?: boolean;
  callback?: () => void;
}

export const SectionToolbarCarouselNavigation = ({
  next,
  callback,
  ...props
}: Props) => {
  const [bindings, disabled] = useNavigate(
    next ? Direction.Next : Direction.Previous
  );

  return (
    <button
      aria-label={next ? 'Go to next slide' : 'Go to previous slide'}
      className={clsx(
        'rounded-full bg-foreground p-2 transition-all',
        // moved from the global css file
        'focus-within:ring-2 focus:outline-none focus:ring focus:ring-neutral-500',
        !disabled ? 'active:scale-95' : ''
      )}
      disabled={bindings.disabled}
      onClick={() => {
        if (callback) callback();
        bindings.onClick();
      }}
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
