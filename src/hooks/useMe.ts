import { getMe } from '@/services/api/auth';
import { User } from '@/services/api/types/auth.types';
import { useQuery } from '@tanstack/react-query';

export const useMe = () => {
  return useQuery<User>({
    queryKey: ['me'],
    queryFn: getMe,
  });
};
