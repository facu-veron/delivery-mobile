import { useMutation, useQueryClient } from '@tanstack/react-query';

import { pedidosApi } from '../api/pedidos.api';

export function useConfirmarPrecio(pedidoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (precioReal: number) => pedidosApi.confirmarPrecio(pedidoId, precioReal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedido', pedidoId] });
    },
  });
}
