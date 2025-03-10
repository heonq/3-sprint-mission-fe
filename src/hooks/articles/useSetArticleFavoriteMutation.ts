import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GetArticleResponse } from '@/services/api/types/article.types';
import { AxiosError } from 'axios';
import { ArticleContextType } from './types';
import { setArticleFavorite } from '@/services/api/article';

export const useSetArticleFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    GetArticleResponse,
    AxiosError<{ message: string }>,
    string,
    ArticleContextType
  >({
    mutationFn: (id: string) => setArticleFavorite(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['article', id] });
      const previousArticle = queryClient.getQueryData<GetArticleResponse>([
        'article',
        id,
      ]);

      queryClient.setQueryData<GetArticleResponse>(['article', id], (prev) => {
        const newArticle = {
          ...prev,
          isLiked: true,
          likeCount: prev!.likeCount + 1,
        } as GetArticleResponse;
        return newArticle;
      });

      return { previousArticle };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
    onError: (_, id, context) => {
      queryClient.setQueryData(['article', id], context?.previousArticle);
    },
  });
};
