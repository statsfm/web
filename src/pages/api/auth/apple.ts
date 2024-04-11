import { getOrigin } from '@/utils/ssrUtils';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  let origin = getOrigin(req);

  if (origin.includes('spotistats.app')) {
    origin = origin.replace('spotistats.app', 'stats.fm');
  }

  // remove the extra httpOnly cookie which is no longer in use
  const cookies = [
    'identityToken=; Path=/; Domain=.stats.fm; HttpOnly=false; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'identityToken=; Path=/; Domain=.stats.fm; HttpOnly=true; Expires=Thu, 01 Jan 1970 00:00:00 GMT', // legacy cookie
  ];

  if (process.env.NODE_ENV === 'development') {
    const { host } = req.headers;
    const domain = host?.split(':')[0];
    cookies.push(
      `identityToken=; Path=/; Domain=${domain}; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    );
  }

  res.setHeader('Set-Cookie', cookies);

  const redirectUrl = `${
    process.env.NEXT_PUBLIC_API_URL ?? 'https://api.stats.fm/api'
  }/v1/auth/APPLEMUSIC/redirect?redirect_uri=${origin}/api/auth/callback`;
  return res.redirect(redirectUrl);
};

export default handler;
