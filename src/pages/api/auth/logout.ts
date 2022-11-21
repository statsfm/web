import type { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { redirectUrl } = req.cookies;

  // remove the extra httpOnly cookie which is no longer in use
  const cookies = [
    'identityToken=; Path=/; Domain=.stats.fm; HttpOnly=true; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'identityToken=; Path=/; Domain=.stats.fm; HttpOnly=false; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'redirectUrl=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ];

  if (process.env.NODE_ENV === 'development') {
    const { host } = req.headers;
    const domain = host?.split(':')[0];
    cookies.push(
      `identityToken=; Path=/; Domain=${domain}; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
    );
  }

  res.setHeader('Set-Cookie', cookies);

  if (redirectUrl) return res.redirect(redirectUrl);
  return res.redirect('/');
};

export default handler;
