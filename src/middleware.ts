import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
// import { JWTExpired } from 'jose/errors';

const PUBLIC_PATHS = ['/sign-in', '/sign-up', '/items', '/community', '/'];
const AUTH_PATHS = ['/sign-in', '/sign-up'];

// const refreshAccessToken = async (refreshToken: string) => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
//     {
//       method: 'POST',
//       headers: {
//         Cookie: `refreshToken=${refreshToken}`,
//       },
//       credentials: 'include',
//     },
//   );

//   if (!response.ok) {
//     throw new Error('Token refresh failed');
//   }

//   const nextResponse = NextResponse.next();
//   const cookies = response.headers.getSetCookie();

//   cookies.forEach((cookie) => {
//     nextResponse.headers.append('Set-Cookie', cookie);
//   });

//   return nextResponse;
// };

// const redirectToLogin = (request: NextRequest) => {
//   const loginUrl = new URL('/sign-in', request.url);
//   const response = NextResponse.redirect(loginUrl);
//   response.cookies.delete('accessToken');
//   response.cookies.delete('refreshToken');
//   return response;
// };

// const checkLoggedInMiddleware = async (request: NextRequest) => {
//   const accessToken = request.cookies.get('accessToken')?.value;
//   const refreshToken = request.cookies.get('refreshToken')?.value;

//   console.log('Middleware - Cookies', {
//     accessToken,
//     refreshToken,
//     allCookies: request.cookies.getAll(),
//   });
//   console.log('Middleware - Path:', request.nextUrl.pathname);

//   const isPublicPath = PUBLIC_PATHS.some(
//     (path) => request.nextUrl.pathname === path,
//   );

//   if (isPublicPath) {
//     return NextResponse.next();
//   }

//   if (!refreshToken) {
//     // return NextResponse.next();
//     const loginUrl = new URL('/sign-in', request.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   if (!accessToken) {
//     // return NextResponse.next();
//     try {
//       return await refreshAccessToken(refreshToken);
//     } catch {
//       return redirectToLogin(request);
//     }
//   }

//   try {
//     await jwtVerify(accessToken, ENCODED_SECRET);
//     return NextResponse.next();
//   } catch (error) {
//     if (!(error instanceof JWTExpired)) {
//       const loginUrl = new URL('/sign-in', request.url);
//       return NextResponse.redirect(loginUrl);
//     }

//     try {
//       return await refreshAccessToken(refreshToken);
//     } catch {
//       return redirectToLogin(request);
//     }
//   }
// };

// const alreadyLoggedInMiddleware = async (request: NextRequest) => {
//   const token = request.cookies.get('accessToken')?.value;
//   const isAuthPath = AUTH_PATHS.some(
//     (path) => request.nextUrl.pathname === path,
//   );

//   if (!isAuthPath || !token) {
//     return NextResponse.next();
//   }

//   try {
//     const base64Payload = token.split('.')[1];
//     const decodedPayload = JSON.parse(
//       Buffer.from(base64Payload, 'base64').toString('utf-8'),
//     );
//     console.log('Decoded Payload:', decodedPayload);
//     console.log(ENCODED_SECRET);

//     const { payload } = await jwtVerify(token, ENCODED_SECRET, {
//       algorithms: ['HS256'],
//     });
//     console.log('payload', payload);
//     console.log('accesstoeken exist');
//     return NextResponse.redirect(new URL('/items', request.url));
//   } catch (e) {
//     console.log('err', e);
//     return NextResponse.next();
//   }
// };

export default async function middleware(request: NextRequest) {
  const ENCODED_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
  console.log('secret', process.env.JWT_SECRET);
  console.log('encoded secret', ENCODED_SECRET);

  const isAuthPath = AUTH_PATHS.some(
    (path) => request.nextUrl.pathname === path,
  );
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => request.nextUrl.pathname === path,
  );

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!accessToken && refreshToken) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
        {
          method: 'POST',
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const refreshedCookies = response.headers.get('set-cookie');
      if (!refreshedCookies) {
        throw new Error('No cookies returned from refresh token endpoint');
      }

      const nextResponse = NextResponse.next();

      refreshedCookies.split(',').forEach((cookie) => {
        nextResponse.headers.append('Set-Cookie', cookie);
      });

      return nextResponse;
    } catch (error) {
      console.error('Error refreshing token:', error);
      const loginUrl = new URL('/sign-in', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (!accessToken && !refreshToken) {
    if (isAuthPath || isPublicPath) {
      return NextResponse.next();
    }

    const loginUrl = new URL('/sign-in', request.url);
    if (!isPublicPath) return NextResponse.redirect(loginUrl);
  }

  if (accessToken && refreshToken) {
    try {
      const verified = await jwtVerify(accessToken, ENCODED_SECRET);
      console.log(verified);
    } catch (err) {
      console.log('err', err);
      const loginUrl = new URL('/sign-in', request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (isAuthPath) {
      const loginUrl = new URL('/items', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // return alreadyLoggedInMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
