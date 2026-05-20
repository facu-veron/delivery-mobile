import { NotificacionesResponse } from '@/shared/types/pedido.types';

import { apiClient } from './client';

export const notificacionesApi = {
  getAll: async (): Promise<NotificacionesResponse> => {
    const { data } = await apiClient.get<NotificacionesResponse>('/api/notificaciones');
    return data;
  },

  marcarLeida: async (id: string): Promise<void> => {
    await apiClient.patch(`/api/notificaciones/${id}/leer`);
  },

  marcarTodasLeidas: async (): Promise<void> => {
    await apiClient.patch('/api/notificaciones/leer-todas');
  },
};
