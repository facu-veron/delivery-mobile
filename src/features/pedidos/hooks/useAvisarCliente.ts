import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { pedidosApi } from '../api/pedidos.api';

export function useAvisarCliente(pedidoId: string) {
  return useMutation({
    mutationFn: () => pedidosApi.avisarCliente(pedidoId),
    onSuccess: () => {
      Alert.alert('Aviso enviado', 'El cliente recibió la notificación.');
    },
    onError: () => {
      Alert.alert('Error', 'No se pudo enviar el aviso. Intentá de nuevo.');
    },
  });
}
