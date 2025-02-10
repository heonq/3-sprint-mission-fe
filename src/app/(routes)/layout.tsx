import Footer from '@/components/layout/Footer';
import GNB from '@/components/layout/GNB/GNB';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { cookies, headers } from 'next/headers';

const getProfile = async () => {
  const headersList = headers();
  console.log('headers list', headersList.get('cookie'));
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookies().toString(),
    },
  });
  const result = await response.json();

  console.log('result', result);

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
