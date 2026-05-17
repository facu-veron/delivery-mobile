import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import SuperTokens from 'supertokens-react-native';

import { RolUsuario } from '@/shared/types/pedido.types';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import type { LoginInput } from '../schemas/login.schema';

export function useLogin() {
  const router = useRouter();
  const { setSession } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: async () => {
      const payload = await SuperTokens.getAccessTokenPayloadSecurely();
      setSession({
        usuarioId: payload.usuarioId ?? '',
        rol: payload.rol as RolUsuario,
        perfilId: payload.perfilId ?? '',
        nombre: payload.nombre ?? '',
      });
      if (payload.rol === RolUsuario.CLIENTE) {
        router.replace('/(cliente)');
      } else {
        router.replace('/(repartidor)');
      }
    },
  });
}
