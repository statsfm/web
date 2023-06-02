import type { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  let protocol = req.headers['x-forwarded-proto'] ?? 'https';
  if (process.env.NODE_ENV === 'development') protocol = 'http';

  const { host } = req.headers;
  const origin = `${protocol}://${host}`;

  // remove the extra httpOnly cookie which is no longer in use
  const cookies = [
    'identityToken=; Path=/; Domain=.stats.fm; HttpOnly=false; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'identityToken=; Path=/; Domain=.stats.fm; HttpOnly=true; Expires=Thu, 01 Jan 1970 00:00:00 GMT', // legacy cookie
  ];

  if (process.env.NODE_ENV === 'development') {
    const { host } = req.headers;
    const domain = host?.split(':')[0];
    cookies.push(
      `identityToken=; Path=/; Domain=${domain}; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
    );
  }

  res.setHeader('Set-Cookie', cookies);

  const scope = [
    // Images
    'ugc-image-upload',
    // Spotify Connect
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    // Playback
    'streaming',
    'app-remote-control',
    // Users
    'user-read-email',
    'user-read-private',
    // 'user-read-birthdate',
    // Playlists
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    // Library
    'user-library-modify',
    'user-library-read',
    // Listening History
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    // Follow
    'user-follow-read',
    'user-follow-modify',
  ].join('%20');

  const redirectUrl = `https://api.stats.fm/api/v1/auth/redirect/spotify?scope=${scope}&redirect_uri=${origin}/api/auth/callback`;
  return res.redirect(redirectUrl);
};

export default handler;
