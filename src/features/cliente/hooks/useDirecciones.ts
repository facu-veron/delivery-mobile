import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ActualizarDireccionDto, CrearDireccionDto } from '@/shared/types/pedido.types';

import { clienteApi } from '../api/cliente.api';

const QUERY_KEY = ['cliente', 'direcciones'];

export function useDirecciones() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: clienteApi.getDirecciones,
    staleTime: 60_000,
  });
}

export function useCrearDireccion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CrearDireccionDto) => clienteApi.crearDireccion(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useActualizarDireccion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: ActualizarDireccionDto }) =>
      clienteApi.actualizarDireccion(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useEliminarDireccion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clienteApi.eliminarDireccion(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
