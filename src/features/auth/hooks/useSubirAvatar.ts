import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { meApi } from '../api/me.api';
import { useAuthStore } from '../store/auth.store';

export function useSubirAvatar() {
  const queryClient = useQueryClient();
  const setPerfil = useAuthStore((s) => s.setPerfil);

  return useMutation({
    mutationFn: (formData: FormData) => meApi.subirAvatar(formData),
    onSuccess: (res) => {
      setPerfil({ avatarUrl: res.data.avatarUrl });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['repartidor', 'perfil'] });
    },
    onError: () => {
      Alert.alert('Error', 'No se pudo subir la foto. Probá de nuevo.');
    },
  });
}
