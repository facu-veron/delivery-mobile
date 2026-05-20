import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import type { TipoDocumento } from '@/shared/types/pedido.types';
import { repartidorApi } from '../api/repartidor.api';

export function useSubirDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tipo, formData }: { tipo: TipoDocumento; formData: FormData }) =>
      repartidorApi.subirDocumento(tipo, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repartidor', 'documentos'] });
    },
    onError: () => {
      Alert.alert('Error', 'No se pudo subir el documento. Intentá de nuevo.');
    },
  });
}
