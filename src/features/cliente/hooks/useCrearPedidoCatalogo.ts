import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { CrearPedidoCatalogoDto, clienteApi } from '../api/cliente.api';

export function useCrearPedidoCatalogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CrearPedidoCatalogoDto) => clienteApi.crearPedidoCatalogo(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos', 'activos', 'cliente'] });
    },
    onError: () => {
      Alert.alert('Error', 'No se pudo realizar el pedido. Intentá de nuevo.');
    },
  });
}
