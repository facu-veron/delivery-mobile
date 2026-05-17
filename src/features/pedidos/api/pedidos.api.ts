import { apiClient } from '@/shared/api/client';
import type { Pedido } from '@/shared/types/pedido.types';

export const pedidosApi = {
  getDetalle: (id: string) =>
    apiClient.get<Pedido>(`/api/pedidos/${id}`),

  tomar: (id: string) =>
    apiClient.patch(`/api/pedidos/${id}/tomar`),

  confirmarPrecio: (id: string, precioReal: number) =>
    apiClient.patch(`/api/pedidos/${id}/confirmar-precio`, { precioReal }),

  marcarEnCamino: (id: string) =>
    apiClient.patch(`/api/pedidos/${id}/en-camino`),

  entregar: (id: string) =>
    apiClient.patch(`/api/pedidos/${id}/entregar`),

  avisarCliente: (id: string) =>
    apiClient.post(`/api/pedidos/${id}/avisar-cliente`),
};
