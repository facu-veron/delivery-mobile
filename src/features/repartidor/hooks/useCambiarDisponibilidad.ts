import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { repartidorApi } from '../api/repartidor.api';
import { useDisponibilidadStore } from '../store/disponibilidad.store';

export function useCambiarDisponibilidad() {
  const queryClient = useQueryClient();
  const { disponible, setDisponible } = useDisponibilidadStore();

  return useMutation({
    mutationFn: (value: boolean) => repartidorApi.cambiarDisponibilidad(value),
    onMutate: async (value) => {
      const prev = disponible;
      setDisponible(value); // optimistic
      return { prev };
    },
    onError: (error: any, _, ctx) => {
      if (ctx) setDisponible(ctx.prev); // rollback
      const msg = error?.response?.data?.message ?? 'No se pudo cambiar la disponibilidad.';
      Alert.alert('Error', msg);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['repartidor', 'perfil'] });
    },
  });
}
