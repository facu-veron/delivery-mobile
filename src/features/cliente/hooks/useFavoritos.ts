import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { clienteApi } from '../api/cliente.api';

const QUERY_KEY = ['cliente', 'favoritos'];

export function useFavoritos() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: clienteApi.getFavoritos,
    staleTime: 60_000,
  });
}

export function useToggleFavorito() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ comercioId, isFavorito }: { comercioId: string; isFavorito: boolean }) =>
      isFavorito
        ? clienteApi.quitarFavorito(comercioId)
        : clienteApi.agregarFavorito(comercioId),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
