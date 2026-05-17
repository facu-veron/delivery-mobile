import { apiClient } from '@/shared/api/client';
import type { EstadoDocumento, Pedido, Repartidor } from '@/shared/types/pedido.types';

export interface DocumentoRepartidor {
  key: string;
  estado: EstadoDocumento;
  motivoRechazo?: string;
  url?: string;
}

export const repartidorApi = {
  getPerfil: () =>
    apiClient.get<Repartidor>('/api/repartidor/perfil'),

  cambiarDisponibilidad: (disponible: boolean) =>
    apiClient.patch('/api/repartidor/disponibilidad', { disponible }),

  actualizarPushToken: (token: string) =>
    apiClient.patch('/api/repartidor/push-token', { token }),

  getPedidosDisponibles: () =>
    apiClient.get<Pedido[]>('/api/repartidor/pedidos-disponibles'),

  getPedidoActivo: () =>
    apiClient.get<Pedido | null>('/api/repartidor/pedido-activo'),

  getHistorial: () =>
    apiClient.get<Pedido[]>('/api/repartidor/historial'),

  getDocumentos: () =>
    apiClient.get<DocumentoRepartidor[]>('/api/repartidor/documentos'),

  subirDocumento: (key: string, formData: FormData) =>
    apiClient.post(`/api/repartidor/documentos/${key}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
