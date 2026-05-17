import { apiClient } from '@/shared/api/client';
import type { Repartidor } from '@/shared/types/pedido.types';

export const repartidorApi = {
  getPerfil: () =>
    apiClient.get<Repartidor>('/api/repartidor/perfil'),

  cambiarDisponibilidad: (disponible: boolean) =>
    apiClient.patch('/api/repartidor/disponibilidad', { disponible }),

  actualizarPushToken: (token: string) =>
    apiClient.patch('/api/repartidor/push-token', { token }),

  getPedidosDisponibles: () =>
    apiClient.get<import('@/shared/types/pedido.types').Pedido[]>('/api/repartidor/pedidos-disponibles'),
};
