import { useQuery } from '@tanstack/react-query';

import { clienteApi } from '../api/cliente.api';

export function useComercio(id: string) {
  return useQuery({
    queryKey: ['comercios', id],
    queryFn: () => clienteApi.getComercioDetalle(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}
