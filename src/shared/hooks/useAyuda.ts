import { useMutation, useQuery } from '@tanstack/react-query';

import { ayudaApi, ContactoDto } from '@/shared/api/ayuda.api';

export function useFaqs() {
  return useQuery({
    queryKey: ['ayuda', 'faqs'],
    queryFn: ayudaApi.getFaqs,
    staleTime: 10 * 60_000,
  });
}

export function useEnviarContacto() {
  return useMutation({
    mutationFn: (dto: ContactoDto) => ayudaApi.enviarContacto(dto),
  });
}
