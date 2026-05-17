import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { pedidosApi } from '../api/pedidos.api';

export function useTomarPedido() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => pedidosApi.tomar(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos', 'disponibles'] });
      router.push(`/(repartidor)/pedido/${id}` as any);
    },
    onError: (error: any) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos', 'disponibles'] });
      if (error?.response?.status === 409) {
        Alert.alert('Pedido tomado', 'Otro repartidor tomó este pedido antes. La lista fue actualizada.');
      } else {
        Alert.alert('Error', 'No se pudo tomar el pedido. Intentá de nuevo.');
      }
    },
  });
}
