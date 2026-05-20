import { apiClient } from '@/shared/api/client';
import type {
  DocumentoRepartidor,
  EstadisticasRepartidor,
  GananciasResponse,
  Pedido,
  Repartidor,
  TipoDocumento,
} from '@/shared/types/pedido.types';

export type { DocumentoRepartidor } from '@/shared/types/pedido.types';

export const repartidorApi = {
  getPerfil: () =>
    apiClient.get<Repartidor>('/api/repartidor/perfil'),

  actualizarPerfil: (data: { nombre?: string; telefono?: string; vehiculo?: string }) =>
    apiClient.patch<Repartidor>('/api/repartidor/perfil', data),

  cambiarDisponibilidad: (disponible: boolean) =>
    apiClient.patch<{ disponible: boolean }>('/api/repartidor/disponibilidad', { disponible }),

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

  subirDocumento: (tipo: TipoDocumento, formData: FormData) =>
    apiClient.post(`/api/repartidor/documentos/${tipo}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getEstadisticas: () =>
    apiClient.get<EstadisticasRepartidor>('/api/repartidor/estadisticas'),

  getGanancias: (params?: { desde?: string; hasta?: string }) =>
    apiClient.get<GananciasResponse>('/api/repartidor/ganancias', { params }),
};
