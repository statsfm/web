import clsx from 'clsx';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { MdChevronLeft } from 'react-icons/md';

export const ToolbarBackLink: FC<{ path: string }> = (path) => {
  const router = useRouter();
  const closeCallback = () => {
    router.push(path.path);
  };

  return (
    <div>
      <button
        aria-label="go back"
        className={clsx(
          'mr-4 rounded-full bg-foreground p-2 ring-neutral-500 transition-all',
          // moved from the global css file
          'focus-within:ring-2 focus:outline-none focus:ring-2 hover:ring-2',
        )}
        onClick={() => closeCallback()}
      >
        <MdChevronLeft className="fill-white" />
      </button>
    </div>
  );
};
