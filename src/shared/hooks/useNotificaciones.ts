import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { notificacionesApi } from '@/shared/api/notificaciones.api';

const QUERY_KEY = ['notificaciones'];

export function useNotificaciones() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: notificacionesApi.getAll,
    staleTime: 30_000,
  });
}

export function useNoLeidas() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: notificacionesApi.getAll,
    select: (data) => data.noLeidas,
    staleTime: 30_000,
  });
}

export function useMarcarTodasLeidas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificacionesApi.marcarTodasLeidas,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useMarcarLeida() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificacionesApi.marcarLeida(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
