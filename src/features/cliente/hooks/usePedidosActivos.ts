import { useQuery } from '@tanstack/react-query';

import { clienteApi } from '../api/cliente.api';

export function usePedidosActivos() {
  return useQuery({
    queryKey: ['pedidos', 'activos', 'cliente'],
    queryFn: clienteApi.getPedidosActivos,
    refetchInterval: 10_000,
  });
}
