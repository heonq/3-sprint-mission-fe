import Footer from '@/components/layout/Footer';
import GNB from '@/components/layout/GNB/GNB';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { cookies } from 'next/headers';

const refreshToken = async () => {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refreshToken');
  console.log('refresh', refreshToken);

  if (!refreshToken) window.location.href = '/sign-in';

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

  console.log('refresh success');

  if (!response.ok) window.location.href = '/sign-in';

  const setCookieHeader = response.headers.get('set-cookie');
  if (setCookieHeader) {
    cookies().set('set-cookie', setCookieHeader);
  }

  return response;
};

const getProfile = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');
  console.log('getProfile', accessToken);

  if (!accessToken) {
    await refreshToken();
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookies().toString(),
    },
  });
  const result = await response.json();

  return result;
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['me'],
    queryFn: getProfile,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GNB />
      <main className='flex-1 w-full flex flex-col items-center'>
        {children}
      </main>
      <Footer />
    </HydrationBoundary>
  );
}
