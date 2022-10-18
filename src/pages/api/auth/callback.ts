import type { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { identityToken, redirectUrl } = req.cookies;

  if (!identityToken) return res.redirect('/login?failed=1');

  res.setHeader('Set-Cookie', [
    'redirectUrl=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ]);

  if (redirectUrl) return res.redirect(redirectUrl);
  return res.redirect('/');
};

export default handler;
