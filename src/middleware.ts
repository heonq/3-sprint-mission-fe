import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
// import { cookies } from 'next/headers';
// import { JWTExpired } from 'jose/errors';
// import { cookies } from 'next/headers';

// const PUBLIC_PATHS = ['/sign-in', '/sign-up', '/items', '/community', '/'];
const AUTH_PATHS = ['/sign-in', '/sign-up'];
const ENCODED_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// // const refreshAccessToken = async () => {
// //   const response = await fetch(
// //     `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
// //     {
// //       method: 'POST',
// //       credentials: 'include',
// //     },
// //   );

// //   if (!response.ok) {
// //     throw new Error('Token refresh failed');
// //   }

// //   console.log(response);

// //   const nextResponse = NextResponse.next();
// //   const cookies = response.headers.getSetCookie();

// //   console.log(cookies);

// //   cookies.forEach((cookie) => {
// //     nextResponse.headers.append('Set-Cookie', cookie);
// //   });

// //   return nextResponse;
// // };

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
//   // const accessToken = request.cookies.get('accessToken')?.value;
//   // const refreshToken = request.cookies.get('refreshToken')?.value;

//   const isPublicPath = PUBLIC_PATHS.some(
//     (path) => request.nextUrl.pathname === path,
//   );

//   // if (isPublicPath) {
//   //   return NextResponse.next();
//   // }

//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
//     credentials: 'include',
//     headers: {
//       'Content-Type': 'application/json',
//       Cookie: cookies().toString(),
//     },
//   });
//   const profile = await response.json();

//   if (profile === null) {
//     // await refreshAccessToken();
//   }

//   return NextResponse.next();

//   // if (!refreshToken) {
//   // return NextResponse.next();
//   // const loginUrl = new URL('/sign-in', request.url);
//   // return NextResponse.redirect(loginUrl);
//   // }

//   // if (!accessToken) {
//   // return NextResponse.next();
//   // try {
//   //   return await refreshAccessToken(refreshToken);
//   // } catch {
//   //   return redirectToLogin(request);
//   // }
//   // }

//   // try {
//   //   await jwtVerify(accessToken, ENCODED_SECRET);
//   //   return NextResponse.next();
//   // } catch (error) {
//   //   if (!(error instanceof JWTExpired)) {
//   //     const loginUrl = new URL('/sign-in', request.url);
//   //     return NextResponse.redirect(loginUrl);
//   //   }

//   //   try {
//   //     return await refreshAccessToken(refreshToken);
//   //   } catch {
//   //     return redirectToLogin(request);
//   //   }
//   // }
// };

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

// const parseCookies = (cookieHeader: string | null) => {
//   if (!cookieHeader) return {};

//   return cookieHeader.split(';').reduce(
//     (cookies, cookie) => {
//       const [name, value] = cookie.trim().split('=');
//       return { ...cookies, [name]: value };
//     },
//     {} as Record<string, string>,
//   );
// };

// const testMiddleware = async (request: NextRequest) => {
//   const cookieHeader = request.headers.get('cookie');
//   const cookies = parseCookies(cookieHeader);
//   console.log(cookies);

//   return NextResponse.next();
// };

export default async function middleware(request: NextRequest) {
  // const checkLoggedInResult = await checkLoggedInMiddleware(request);
  // if (checkLoggedInResult.status !== 200) {
  //   return checkLoggedInResult;
  // }
  // await testMiddleware(request);

  return await alreadyLoggedInMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
