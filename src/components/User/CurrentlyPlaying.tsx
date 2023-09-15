import { useApi } from '@/hooks';
import type { CurrentlyPlayingTrack, UserPublic } from '@statsfm/statsfm.js';
import { useState, type FC, useEffect } from 'react';
import Link from 'next/link';
import { Image } from '../Image';
import { ArtistList } from '../Artist';

export const CurrentlyPlaying: FC<{ user: UserPublic }> = ({ user }) => {
  const [currentlyPlayingTrack, setCurrentlyPlayingTrack] =
    useState<CurrentlyPlayingTrack | null>(null);
  const api = useApi();

  useEffect(() => {
    if (!user) return;
    if (!user.privacySettings?.currentlyPlaying) return;
    api.users
      .currentlyStreaming(user.id)
      .catch(() => null)
      .then(setCurrentlyPlayingTrack);
  }, [user]);

  if (!user.privacySettings?.currentlyPlaying) return null;

  if (!currentlyPlayingTrack) return null;

  return (
    <section className="flex w-full flex-col gap-2 pb-10 md:flex-col">
      <h3>Currently playing</h3>
      <section className="flex flex-col items-center gap-2 md:flex-row">
        <Image
          src={currentlyPlayingTrack.track.albums[0]!.image}
          alt={`Album icon of the ${
            currentlyPlayingTrack.track.albums[0]!.name
          } album`}
          width={55}
          height={55}
        />
        <div className="flex grow flex-col justify-end">
          <h4>
            <Link href={`/track/${currentlyPlayingTrack.track.id}`}>
              {currentlyPlayingTrack.track.name}
            </Link>
          </h4>
          <span className="text-center text-lg md:text-left">
            <ArtistList artists={currentlyPlayingTrack.track.artists} />
          </span>
        </div>
      </section>
    </section>
  );
};
