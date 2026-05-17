import { useQuery } from '@tanstack/react-query';

import { clienteApi } from '../api/cliente.api';

export function useComercios() {
  return useQuery({
    queryKey: ['comercios'],
    queryFn: clienteApi.getComercios,
    staleTime: 60_000,
  });
}
