import { useMutation, useQueryClient } from '@tanstack/react-query';

import { pedidosApi } from '../api/pedidos.api';

export function useMarcarEnCamino(pedidoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => pedidosApi.marcarEnCamino(pedidoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedido', pedidoId] });
    },
  });
}
