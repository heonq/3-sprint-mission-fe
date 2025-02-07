import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { JWTExpired } from 'jose/errors';

const PUBLIC_PATHS = ['/sign-in', '/sign-up', '/items', '/community', '/'];
const AUTH_PATHS = ['/sign-in', '/sign-up'];
const ENCODED_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

const checkLoggedInMiddleware = async (request: NextRequest) => {
  const accessToken = request.cookies.get('accessToken')?.value;
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => request.nextUrl.pathname === path,
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  if (!accessToken) {
    const loginUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(accessToken, ENCODED_SECRET);
    return NextResponse.next();
  } catch (error) {
    if (!(error instanceof JWTExpired)) {
      const loginUrl = new URL('/sign-in', request.url);
      return NextResponse.redirect(loginUrl);
    }

    const refreshToken = request.cookies.get('refreshToken');
    if (!refreshToken) {
      const loginUrl = new URL('/sign-in', request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
        {
          method: 'POST',
          headers: {
            Cookie: `refreshToken=${refreshToken.value}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const nextResponse = NextResponse.next();
      response.headers.getSetCookie().forEach((cookie) => {
        nextResponse.headers.append('Set-Cookie', cookie);
      });

      return nextResponse;
    } catch {
      const loginUrl = new URL('/sign-in', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }
  }
};

const alreadyLoggedInMiddleware = async (request: NextRequest) => {
  const token = request.cookies.get('accessToken')?.value;
  const isAuthPath = AUTH_PATHS.some(
    (path) => request.nextUrl.pathname === path,
  );

  if (!isAuthPath || !token) {
    return NextResponse.next();
  }

  try {
    await jwtVerify(token, ENCODED_SECRET);
    return NextResponse.redirect(new URL('/items', request.url));
  } catch {
    return NextResponse.next();
  }
};

export default async function middleware(request: NextRequest) {
  const checkLoggedInResult = await checkLoggedInMiddleware(request);
  if (checkLoggedInResult.status !== 200) {
    return checkLoggedInResult;
  }

  return alreadyLoggedInMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
