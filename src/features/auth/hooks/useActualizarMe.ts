import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { meApi } from '../api/me.api';
import { useAuthStore } from '../store/auth.store';

export function useActualizarMe() {
  const queryClient = useQueryClient();
  const setPerfil = useAuthStore((s) => s.setPerfil);

  return useMutation({
    mutationFn: (data: { nombre?: string; telefono?: string }) => meApi.actualizar(data),
    onSuccess: (res) => {
      setPerfil({
        nombre: res.data.nombre,
        telefono: res.data.telefono,
        avatarUrl: res.data.avatarUrl,
      });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['repartidor', 'perfil'] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? 'No se pudo actualizar el perfil.';
      Alert.alert('Error', msg);
    },
  });
}
