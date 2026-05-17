import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { pedidosApi } from '../api/pedidos.api';

export function useEntregarPedido(pedidoId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => pedidosApi.entregar(pedidoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedido', pedidoId] });
      queryClient.invalidateQueries({ queryKey: ['pedidos', 'disponibles'] });
      router.replace('/(repartidor)/(tabs)/disponibles' as any);
    },
  });
}
