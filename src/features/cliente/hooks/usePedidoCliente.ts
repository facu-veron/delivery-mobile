import { useQuery } from '@tanstack/react-query';

import { esPedidoTerminado } from '@/features/pedidos/utils/transiciones-estado';

import { clienteApi } from '../api/cliente.api';

export function usePedidoCliente(id: string) {
  return useQuery({
    queryKey: ['pedidos', 'cliente', id],
    queryFn: () => clienteApi.getPedidoDetalle(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const estado = query.state.data?.estado;
      if (!estado || esPedidoTerminado(estado)) return false;
      return 5_000;
    },
  });
}
