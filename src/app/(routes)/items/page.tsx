import BestProductListSection from '@/components/items/bestProductList/bestProductListSection';
import NormalProductListClient from '@/components/items/normalProductList/normalProductListClient';
import ProductListHeader from '@/components/items/productListHeader/productListHeader';
import { GetProductListParams } from '@/services/api/types/product.types';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

const getProducts = async (searchParams: GetProductListParams) => {
  const filteredParams = Object.fromEntries(
    Object.entries(searchParams)
      .filter(([key, value]) => key && value !== undefined)
      .map(([key, value]) => {
        if (key === 'page' || key === 'pageSize') {
          return [key, Number(value)];
        }
        return [key, value];
      }),
  );
  const params = new URLSearchParams();
  Object.entries(filteredParams).forEach(([key, value]) => {
    params.append(key, String(value));
  });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?${params}`,
  );
  const data = await response.json();

  return data;
};

export default async function Page({
  searchParams,
}: {
  searchParams: GetProductListParams;
}) {
  const queryClient = new QueryClient();
  const products = await getProducts(searchParams);
  queryClient.prefetchQuery({
    queryKey: [
      'products',
      searchParams.page,
      searchParams.pageSize,
      searchParams.orderBy,
      searchParams.keyword,
    ],
    queryFn: () => getProducts(searchParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='w-full md:w-full xl:w-[1200px] p-4 md:p-6 xl:p-0 xl:py-6 flex flex-col'>
        <BestProductListSection />
        <ProductListHeader searchParams={searchParams} />
        <NormalProductListClient searchParams={searchParams} />
      </div>
    </HydrationBoundary>
  );
}
