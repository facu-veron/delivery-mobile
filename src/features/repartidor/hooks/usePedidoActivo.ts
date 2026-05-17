import { useQuery } from '@tanstack/react-query';

import { esPedidoTerminado } from '@/features/pedidos/utils/transiciones-estado';

import { repartidorApi } from '../api/repartidor.api';

export function usePedidoActivo() {
  return useQuery({
    queryKey: ['repartidor', 'pedido-activo'],
    queryFn: () => repartidorApi.getPedidoActivo().then((r) => r.data),
    refetchInterval: (query) => {
      const pedido = query.state.data;
      if (!pedido || esPedidoTerminado(pedido.estado)) return 10_000;
      return 5_000;
    },
  });
}
