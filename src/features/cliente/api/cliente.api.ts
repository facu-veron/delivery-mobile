import { apiClient } from '@/shared/api/client';
import { Comercio, ComercioDetalle } from '@/shared/types/comercio.types';
import { Pedido } from '@/shared/types/pedido.types';

export interface CrearPedidoLibreDto {
  localNombre: string;
  localDireccion: string;
  clienteDireccion: string;
  productoDescripcion: string;
  precioEstimado?: number;
  instruccionSinStock?: string;
}

export interface CrearPedidoCatalogoDto {
  comercioId: string;
  clienteDireccion: string;
  items: { productoId: string; cantidad: number }[];
}

export const clienteApi = {
  getComercios: async (): Promise<Comercio[]> => {
    const { data } = await apiClient.get<Comercio[]>('/comercios');
    return data;
  },

  getComercioDetalle: async (id: string): Promise<ComercioDetalle> => {
    const { data } = await apiClient.get<ComercioDetalle>(`/comercios/${id}`);
    return data;
  },

  getPedidosActivos: async (): Promise<Pedido[]> => {
    const { data } = await apiClient.get<Pedido[]>('/pedidos/mis-pedidos/activos');
    return data;
  },

  getPedidoDetalle: async (id: string): Promise<Pedido> => {
    const { data } = await apiClient.get<Pedido>(`/pedidos/${id}`);
    return data;
  },

  crearPedidoLibre: async (dto: CrearPedidoLibreDto): Promise<Pedido> => {
    const { data } = await apiClient.post<Pedido>('/pedidos/libre', dto);
    return data;
  },

  crearPedidoCatalogo: async (dto: CrearPedidoCatalogoDto): Promise<Pedido> => {
    const { data } = await apiClient.post<Pedido>('/pedidos/catalogo', dto);
    return data;
  },

  getHistorial: async (): Promise<Pedido[]> => {
    const { data } = await apiClient.get<Pedido[]>('/pedidos/mis-pedidos/historial');
    return data;
  },
};
