import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import type { HTMLAttributes, PropsWithChildren } from 'react';
import { useEffect, useRef, useState } from 'react';

interface Props extends HTMLAttributes<HTMLOListElement> {
  rows: number;
  gap: number;
}

const Carousel = ({ rows, gap, children }: PropsWithChildren<Props>) => {
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLUListElement>(null);

  const handleScrollEvent = (e: Event) => {
    setScrollLeft((e.target as any).scrollLeft);
  };

  useEffect(() => {
    carouselRef.current?.addEventListener('scroll', handleScrollEvent);

    return () => {
      carouselRef.current?.removeEventListener('scroll', handleScrollEvent);
    };
  }, []);

  const handlePreviousClick = () => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    carouselRef.current?.scrollBy(-carouselRef.current?.clientWidth, 0);
  };

  const handleNextClick = () => {
    carouselRef.current?.scrollBy(carouselRef.current?.clientWidth, 0);
  };

  return (
    <div className="relative">
      {scrollLeft > 0 && (
        <div className="absolute top-0 left-0 z-20 hidden h-full items-center md:flex">
          <button
            className="relative -left-1/2 rounded-full bg-white p-4 shadow-md"
            onClick={handlePreviousClick}
          >
            <MdNavigateBefore className="text-background" />
          </button>
        </div>
      )}

      <ul
        className="no-scrollbar grid snap-x snap-mandatory grid-flow-col overflow-scroll scroll-smooth"
        style={{
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gap: `${gap}px`,
        }}
        ref={carouselRef}
      >
        {children}
      </ul>

      {/* TODO: fix types */}
      {scrollLeft < (carouselRef.current as any)?.scrollLeftMax && (
        <div className="absolute right-0 top-0 z-10 hidden h-full items-center md:flex">
          <button
            className="relative left-1/2 rounded-full bg-white p-3 shadow-md"
            onClick={handleNextClick}
          >
            <MdNavigateNext className="text-background" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Carousel;
