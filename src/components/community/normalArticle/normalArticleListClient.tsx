'use client';

import NormalArticleCard from './normalArticleCard';
import { useNormalArticleListQuery } from '@/hooks/articles/useNormalArticleListQuery';
import { NormalArticleListProps } from '@/lib/types/props.types';
import NormalArticleCardSkeleton from './normalArticleSkeleton';

export default function NormalArticleListClient({
  searchParams,
  initialData,
}: NormalArticleListProps) {
  const { data, isLoading } = useNormalArticleListQuery({
    searchParams,
    initialData,
  });

  if (isLoading)
    return Array.from({ length: 10 }, () => 0).map((el, index) => (
      <NormalArticleCardSkeleton key={el + index} />
    ));

  return (
    <>
      {data.list.map((article) => (
        <NormalArticleCard
          key={article.id}
          nickname={article.writer.nickname}
          title={article.title}
          likeCount={article.likeCount}
          createdAt={article.createdAt}
          articleId={article.id.toString()}
        />
      ))}
    </>
  );
}
