import { SignInResponse } from '@/services/api/types/auth.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useModal } from './modals/useModal';

export const useAuthMutation = <T extends object>(
  authFn: (data: T) => Promise<SignInResponse>,
) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openConfirmModal, openMessageModal } = useModal();

  return useMutation<SignInResponse, AxiosError<{ message: string }>, T>({
    mutationFn: authFn,
    onSuccess: (response, variable) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      queryClient.setQueriesData({ queryKey: ['me'] }, response.user);
      if ('passwordConfirmation' in variable)
        return openConfirmModal('가입 완료되었습니다', () =>
          router.push('/items'),
        );
      router.push('/items');
    },
    onError: (error) => {
      openMessageModal(error?.response?.data.message || '오류가 발생했습니다.');
    },
  });
};
