import { getApiInstance } from '@/utils/ssrUtils';
import type { NextApiRequest, NextApiResponse } from 'next';

const env = process.env.NODE_ENV;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { redirectUrl } = req.cookies;
  let { identityToken } = req.cookies;

  if (!identityToken && env === 'production')
    return res.redirect('/login?failed=1');

  const cookies = [
    'redirectUrl=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ];

  if (env === 'development') {
    const { code } = req.query;
    const { host } = req.headers;

    const domain = host?.split(':')[0];

    cookies.push(
      `identityToken=${code}; Path=/; Domain=${domain}; Expires=Tue, 01 Jan 2030 00:00:00 GMT`
    );

    identityToken = code as string;
  }

  res.setHeader('Set-Cookie', cookies);
  if (!redirectUrl) return res.redirect('/');
  if (redirectUrl !== '/') return res.redirect(redirectUrl);

  const api = getApiInstance(identityToken);
  const { customId, id } = await api.me.get();
  return res.redirect(`/${customId ?? id}`);
};

export default handler;
