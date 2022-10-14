import type { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { redirectUrl } = req.cookies;

  res.setHeader('Set-Cookie', [
    'identityToken=; Path=/; Domain=.stats.fm; HttpOnly=false; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ]);

  res.setHeader('Set-Cookie', [
    'identityToken=; Path=/; Domain=.stats.fm; HttpOnly=true; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ]);

  if (!redirectUrl) {
    return res.redirect('/');
  }

  res.setHeader('Set-Cookie', [
    'redirectUrl=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ]);

  return res.redirect(redirectUrl);
};

export default handler;
