import { useQuery } from '@tanstack/react-query';

import { clienteApi } from '../api/cliente.api';

export function useHistorialCliente() {
  return useQuery({
    queryKey: ['cliente', 'historial'],
    queryFn: clienteApi.getHistorial,
    staleTime: 30_000,
  });
}
