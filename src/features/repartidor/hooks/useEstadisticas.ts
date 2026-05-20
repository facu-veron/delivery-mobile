import { useQuery } from '@tanstack/react-query';

import { repartidorApi } from '../api/repartidor.api';

export function useEstadisticas() {
  return useQuery({
    queryKey: ['repartidor', 'estadisticas'],
    queryFn: () => repartidorApi.getEstadisticas(),
    select: (res) => res.data,
    staleTime: 60_000,
  });
}

export function useGanancias(params?: { desde?: string; hasta?: string }) {
  return useQuery({
    queryKey: ['repartidor', 'ganancias', params?.desde, params?.hasta],
    queryFn: () => repartidorApi.getGanancias(params),
    select: (res) => res.data,
    staleTime: 30_000,
  });
}
