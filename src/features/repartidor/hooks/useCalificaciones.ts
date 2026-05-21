import { useQuery } from '@tanstack/react-query';

import { repartidorApi } from '../api/repartidor.api';

export function useCalificaciones() {
  return useQuery({
    queryKey: ['repartidor', 'calificaciones'],
    queryFn: () => repartidorApi.getCalificaciones().then((r) => r.data),
    staleTime: 60_000,
  });
}
