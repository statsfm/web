import { useState, type FC } from 'react';
import { MdPerson, MdPersonOff } from 'react-icons/md';

type Props = {
  callback: (state: boolean) => any;
};

export const SectionToolbarUserMode: FC<Props> = (props) => {
  const [state, setState] = useState(false);
  const clickHandler = () => {
    props.callback(!state);
    setState(!state);
  };

  return (
    <button
      aria-label={'friend mode'}
      title={!state ? 'Click to show your top' : 'Click to see global top'}
      className="rounded-full bg-foreground p-2 transition-all focus-within:ring-2 focus:outline-none focus:ring focus:ring-neutral-500"
      onClick={clickHandler}
    >
      {state ? (
        <MdPerson className="text-white opacity-80" />
      ) : (
        <MdPersonOff className="text-white opacity-80" />
      )}
    </button>
  );
};
