import { CommentListParams } from '@/lib/types/params.types';
import { createArticleComments } from '@/services/api/article';
import { createProductComments } from '@/services/api/product';
import {
  CommentRequest,
  CommentResponse,
} from '@/services/api/types/comment.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useMessageModal } from '../modals/useMessageModal';

const mutationFn = {
  product: createProductComments,
  article: createArticleComments,
};

export const useCreateCommentMutation = ({
  variant,
  id,
}: CommentListParams) => {
  const queryClient = useQueryClient();
  const { setMessage } = useMessageModal();

  return useMutation<
    CommentResponse,
    AxiosError<{ message: string }>,
    CommentRequest
  >({
    mutationFn: mutationFn[variant],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', variant, id] });
    },
    onError: (error) => {
      if (error.status === 401)
        return setMessage('로그인이 필요한 기능입니다.');
      setMessage(error.message);
    },
  });
};
