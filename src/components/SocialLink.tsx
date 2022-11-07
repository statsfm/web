import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { AppleMusicIcon, SpotifyIcon } from './Icons';

type Props = {
  path?: string;
};

export const SpotifyLink: FC<Props> = ({ path }) => {
  return (
    <a
      href={`https://open.spotify.com${path}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <SpotifyIcon className="h-7 w-7 !fill-icon transition-colors hover:!fill-[#1DB954]" />
    </a>
  );
};

export const AppleMusicLink: FC<Props> = () => {
  const [, setHover] = useState<boolean>(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => setHover(false);

  useEffect(() => {
    if (linkRef.current) {
      linkRef.current.addEventListener('mouseenter', handleMouseEnter);
      linkRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      linkRef.current?.removeEventListener('mouseenter', handleMouseEnter);
      linkRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [linkRef.current]);

  return (
    <a
      ref={linkRef}
      // href={`https://open.spotify.com${path}`}
      // target="_blank"
      // rel="noopener noreferrer"
      aria-disabled
      className="cursor-not-allowed"
    >
      {/* TODO: switch this hover prop when apple music is alive */}
      <AppleMusicIcon className="h-[25px] w-[25px]" hover={false} />
    </a>
  );
};
