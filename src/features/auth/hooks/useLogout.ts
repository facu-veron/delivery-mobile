import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import SuperTokens from 'supertokens-react-native';

import { queryClient } from '@/shared/api/query-client';
import { useAuthStore } from '../store/auth.store';

export function useLogout() {
  const router = useRouter();
  const { clearSession } = useAuthStore();

  return useMutation({
    mutationFn: () => SuperTokens.signOut(),
    onSuccess: () => {
      clearSession();
      queryClient.clear();
      router.replace('/(auth)/login');
    },
  });
}
