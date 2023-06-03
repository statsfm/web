import { useState, type FC } from 'react';
import { MdGroup, MdGroupOff } from 'react-icons/md';

type Props = {
  callback: (state: boolean) => any;
};

export const SectionToolbarFriendMode: FC<Props> = (props) => {
  const [friendMode, setFriendMode] = useState(false);
  const clickHandler = () => {
    props.callback(!friendMode);
    setFriendMode(!friendMode);
  };

  return (
    <button
      aria-label={'friend mode'}
      title={
        !friendMode ? 'Click to only show friends' : 'Click to show all users'
      }
      className="rounded-full bg-foreground p-2 transition-all focus-within:ring-2 focus:outline-none focus:ring focus:ring-neutral-500"
      onClick={clickHandler}
    >
      {friendMode ? (
        <MdGroup className="text-white opacity-80" />
      ) : (
        <MdGroupOff className="text-white opacity-80" />
      )}
    </button>
  );
};
