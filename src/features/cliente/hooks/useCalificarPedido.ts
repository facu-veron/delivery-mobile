import { useMutation, useQueryClient } from '@tanstack/react-query';

import { clienteApi } from '../api/cliente.api';

export function useCalificarPedido(pedidoId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { puntaje: number; comentario?: string }) =>
      clienteApi.calificarPedido(pedidoId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pedidos', 'cliente', pedidoId] });
    },
  });
}
