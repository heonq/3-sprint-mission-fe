import ArticleListHeader from '@/components/community/articleListHeader/articleListHeader';
import BestArticleListClient from '@/components/community/bestArticle/bestArticleListClient';
import NormalArticleListClient from '@/components/community/normalArticle/normalArticleListClient';
import SearchSection from '@/components/community/searchSection/searchSection';
import { GetArticleListParams } from '@/services/api/types/article.types';

export default function Page({
  searchParams,
}: {
  searchParams: GetArticleListParams;
}) {
  return (
    <div className='w-full md:w-full xl:w-[1200px] p-4 md:p-6 xl:p-0 xl:py-6 flex flex-col'>
      <BestArticleListClient />
      <ArticleListHeader />
      <SearchSection />
      <NormalArticleListClient searchParams={searchParams} />
    </div>
  );
}
