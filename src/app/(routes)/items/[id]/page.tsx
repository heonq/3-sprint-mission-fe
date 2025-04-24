import ReturnButton from '@/components/common/returnButton/returnButton';
import ProductInformationSection from '@/components/items/itemPage/productInformationSection';
import { ParamsProps } from '@/lib/types/props.types';
import CommentListClient from '@/components/common/comment/commentListClient';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { cookies } from 'next/headers';

const getProductDetail = async (id: string) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
    {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      credentials: 'include',
      next: { revalidate: 60 },
    },
  );
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

export default async function ProductPage({ params }: ParamsProps) {
  const queryClient = new QueryClient();
  queryClient.prefetchQuery({
    queryKey: ['product', params.id],
    queryFn: async () => await getProductDetail(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='w-full md:w-full xl:w-[1200px] p-4 md:p-6 xl:p-0 xl:py-6 flex flex-col'>
        <ProductInformationSection id={params.id} />
        <CommentListClient
          id={params.id}
          variant='product'
        />
        <ReturnButton destination='/items' />
      </div>
    </HydrationBoundary>
  );
}
