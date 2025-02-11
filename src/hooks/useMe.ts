import { getMe, refreshToken } from '@/services/api/auth';
import { User } from '@/services/api/types/auth.types';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';

export const useMe = () => {
  const pathname = usePathname();
  const allowedPaths = ['/', '/items', '/community'];
  const router = useRouter();

  return useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => {
      const userData = await getMe();
      if (userData === null)
        try {
          await refreshToken();
          const userData = await getMe();
          return userData;
        } catch {
          if (allowedPaths.includes(pathname)) return;
          return router.push('/sign-in');
        }
      return userData;
    },
  });
};
