import { useQuery } from '@tanstack/react-query';

import { repartidorApi } from '../api/repartidor.api';

export function useHistorialRepartidor() {
  return useQuery({
    queryKey: ['repartidor', 'historial'],
    queryFn: () => repartidorApi.getHistorial().then((r) => r.data),
    staleTime: 30_000,
  });
}
