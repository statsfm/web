import { decodeJwt } from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const middleware = (request: NextRequest) => {
  const identityToken = request.cookies.get('identityToken');

  const redirectUrl = new URL('/login', request.url);
  redirectUrl.searchParams.append('redirect', request.nextUrl.pathname);

  if (!identityToken) {
    return NextResponse.redirect(redirectUrl);
  }

  let exp;
  try {
    exp = decodeJwt(identityToken.value).exp;
  } catch (error) {
    return NextResponse.redirect(redirectUrl);
  }

  const unixEpoch = Math.floor(Date.now() / 1000);
  if (exp && unixEpoch > exp) {
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/import-apple-music', '/import', '/settings/:path*'],
};
