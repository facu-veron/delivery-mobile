import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { repartidorApi } from '../api/repartidor.api';

export function useActualizarPerfilRepartidor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { nombre?: string; telefono?: string; vehiculo?: string }) =>
      repartidorApi.actualizarPerfil(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repartidor', 'perfil'] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? 'No se pudo actualizar el perfil.';
      Alert.alert('Error', msg);
    },
  });
}
