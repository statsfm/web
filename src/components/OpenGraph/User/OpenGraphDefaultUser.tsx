/* eslint-disable jsx-a11y/alt-text */
import { Logo } from '@/components/Logo';
import { PlusBadgePrefilled } from '@/components/User/PlusBadge';
import { splitStringAtLength } from '@/utils/string';
import type { UserPublic } from '@statsfm/statsfm.js';
import type { JSXElementConstructor, ReactElement } from 'react';

export function OpenGraphDefaultUser(
  user: UserPublic,
  userImageBase64: string,
): ReactElement<JSXElementConstructor<unknown>> {
  const customId = user.customId ?? user.id;

  return (
    <div tw="flex flex-col flex-1 w-[1200px] h-full bg-[#18181c]">
      <div tw="flex flex-row m-auto pl-32 pr-32">
        <div tw="flex">
          <img
            tw="rounded-full"
            height="400px"
            width="400px"
            src={userImageBase64}
          />
          {user.isPlus && (
            <div tw="absolute right-0 bottom-2 flex">
              <PlusBadgePrefilled />
            </div>
          )}
        </div>
        <div tw="flex flex-col text-white ml-10 w-full">
          {/* this is the only way to make the text bold */}
          <h1
            style={{ fontFamily: 'Sans Bold' }}
            tw="text-6xl text-[#1ed760] mt-10"
          >
            {user?.displayName}
          </h1>
          {/* pre-line is necessary for linebreaks to actually work.. */}
          <h1 style={{ whiteSpace: 'pre-wrap', fontFamily: 'Sans Medium' }}>
            {splitStringAtLength(user?.profile?.bio, 40, 4).join('\n')}
          </h1>
        </div>
      </div>
      {/* margin madness... i hate satori */}
      <div tw="absolute bottom-0 flex items-center text-white ml-5">
        <Logo tw="h-8 w-8 mr-3" />
        <div tw="flex items-end">
          <h2 tw="text-[#A3A3A3] mb-5" style={{ fontFamily: 'Sans Medium' }}>
            stats.fm
            {customId !== '' ? (
              <>
                /<span tw="text-white">{customId}</span>
              </>
            ) : (
              ''
            )}
          </h2>
        </div>
      </div>
    </div>
  );
}
