import { decodeJwt } from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const middleware = (request: NextRequest) => {
  const identityToken = request.cookies.get('identityToken');

  if (!identityToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  let exp;
  try {
    exp = decodeJwt(identityToken).exp;
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const unixEpoch = Math.floor(Date.now() / 1000);
  if (exp && unixEpoch > exp) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/import', '/settings/:path*'],
};
