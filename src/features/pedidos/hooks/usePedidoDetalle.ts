import { useQuery } from '@tanstack/react-query';

import { pedidosApi } from '../api/pedidos.api';
import { esPedidoTerminado } from '../utils/transiciones-estado';

export function usePedidoDetalle(id: string) {
  return useQuery({
    queryKey: ['pedido', id],
    queryFn: () => pedidosApi.getDetalle(id),
    select: (res) => res.data,
    // Polling: se detiene automáticamente cuando el pedido termina
    refetchInterval: (query) => {
      const estado = query.state.data?.estado;
      if (!estado || esPedidoTerminado(estado)) return false;
      return 5_000;
    },
  });
}
