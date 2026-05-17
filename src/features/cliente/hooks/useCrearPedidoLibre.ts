import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { CrearPedidoLibreDto, clienteApi } from '../api/cliente.api';

export function useCrearPedidoLibre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CrearPedidoLibreDto) => clienteApi.crearPedidoLibre(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos', 'activos', 'cliente'] });
    },
    onError: () => {
      Alert.alert('Error', 'No se pudo crear el pedido. Intentá de nuevo.');
    },
  });
}
