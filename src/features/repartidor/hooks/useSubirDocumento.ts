import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { repartidorApi } from '../api/repartidor.api';

export function useSubirDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, formData }: { key: string; formData: FormData }) =>
      repartidorApi.subirDocumento(key, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repartidor', 'documentos'] });
    },
    onError: () => {
      Alert.alert('Error', 'No se pudo subir el documento. Intentá de nuevo.');
    },
  });
}
