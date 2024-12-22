import { createArticle } from '@/services/api/article';
import {
  CreateArticleRequest,
  GetArticleResponse,
} from '@/services/api/types/article.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useMessageModal } from '../modals/useMessageModal';

export const useCreateArticleMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setMessage } = useMessageModal();

  return useMutation<
    GetArticleResponse,
    AxiosError<{ message: string }>,
    CreateArticleRequest
  >({
    mutationFn: (articleRequest: CreateArticleRequest) =>
      createArticle(articleRequest),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ['normalArticles', 'bestArticles'],
      });
      queryClient.setQueryData(['article', result.id.toString()], result);
      router.push(`/community/${result.id}`);
    },
    onError: (error) => {
      setMessage(
        error?.response?.data.message ||
          `에러가 발생했습니다. ${error.message}`,
      );
    },
  });
};
