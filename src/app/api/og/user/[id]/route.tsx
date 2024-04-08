import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { getApiInstance } from '@/utils/ssrUtils';
import type { ReactElement, JSXElementConstructor } from 'react';
import type { UserPublic } from '@statsfm/statsfm.js';
import type Api from '@statsfm/statsfm.js';
import { OpenGraphDefaultUser } from '@/components/OpenGraph/User/OpenGraphDefaultUser';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

type OGUserHandler = (
  api: Api,
  user: UserPublic,
) => ReactElement<JSXElementConstructor<any>>;

const VARIANTS: Record<string, OGUserHandler> = {
  default: OpenGraphDefaultUser,
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; variants: string | undefined } },
) {
  const api = getApiInstance();
  const user = await api.users.get(params.id).catch(() => {});
  if (!user) {
    return new Response(null, { status: 404 });
  }
  const fontData = await readFile('src/pages/fonts/StatsfmSans-Regular.ttf');
  // eslint-disable-next-line prettier/prettier
  const mediumFontData = await readFile('src/pages/fonts/StatsfmSans-Medium.ttf');
  const boldFontData = await readFile('src/pages/fonts/StatsfmSans-Bold.ttf');

  const { variants } = req.nextUrl.searchParams as unknown as {
    variants: string | undefined;
  };

  return new ImageResponse(VARIANTS[variants ?? 'default']!(api, user), {
    // debug: true,
    width: 1200,
    fonts: [
      {
        name: 'Sans',
        data: fontData,
        style: 'normal',
        weight: 400,
      },
      {
        name: 'Sans Medium',
        data: mediumFontData,
        style: 'normal',
        weight: 500,
      },
      {
        name: 'Sans Bold',
        data: boldFontData,
        style: 'normal',
        weight: 700,
      },
    ],
  });
}
