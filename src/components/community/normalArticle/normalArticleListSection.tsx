import { SearchParams } from '@/lib/types/searchParams';
import { getArticleList } from '@/services/api/article';
import NormalArticleCard from './normalArticleCard';

export default async function NormalArticleListSection({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { data: articles } = await getArticleList({
    skip: Number(searchParams.skip) || 0,
    take: Number(searchParams.take) || 10,
    word: searchParams.word,
    orderBy: searchParams.orderBy || 'recent',
  });

  return (
    <>
      {articles.map((article) => (
        <NormalArticleCard
          key={article.id}
          nickname='총명한 판다'
          content={article.content}
          likes={99}
          createdAt={article.createdAt}
        />
      ))}
    </>
  );
}
