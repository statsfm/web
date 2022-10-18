import type { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { redirectUrl } = req.cookies;

  // remove the extra httpOnly cookie which is no longer in use
  res.setHeader('Set-Cookie', [
    'identityToken=; Path=/; Domain=.stats.fm; HttpOnly=true; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'identityToken=; Path=/; Domain=.stats.fm; HttpOnly=false; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'redirectUrl=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ]);

  if (redirectUrl) return res.redirect(redirectUrl);
  return res.redirect('/');
};

export default handler;
