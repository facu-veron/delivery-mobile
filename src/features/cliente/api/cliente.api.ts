import { apiClient } from '@/shared/api/client';
import { Comercio, ComercioDetalle } from '@/shared/types/comercio.types';
import {
  ActualizarDireccionDto,
  CrearDireccionDto,
  DireccionCliente,
  Pedido,
} from '@/shared/types/pedido.types';

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
    const { data } = await apiClient.get<Comercio[]>('/api/comercios');
    return data;
  },

  getComercioDetalle: async (id: string): Promise<ComercioDetalle> => {
    const { data } = await apiClient.get<ComercioDetalle>(`/api/comercios/${id}`);
    return data;
  },

  getPedidosActivos: async (): Promise<Pedido[]> => {
    const { data } = await apiClient.get<Pedido[]>('/api/pedidos/mis-pedidos/activos');
    return data;
  },

  getPedidoDetalle: async (id: string): Promise<Pedido> => {
    const { data } = await apiClient.get<Pedido>(`/api/pedidos/${id}`);
    return data;
  },

  crearPedidoLibre: async (dto: CrearPedidoLibreDto): Promise<Pedido> => {
    const { data } = await apiClient.post<Pedido>('/api/pedidos/libre', dto);
    return data;
  },

  crearPedidoCatalogo: async (dto: CrearPedidoCatalogoDto): Promise<Pedido> => {
    const { data } = await apiClient.post<Pedido>('/api/pedidos/catalogo', dto);
    return data;
  },

  getHistorial: async (): Promise<Pedido[]> => {
    const { data } = await apiClient.get<Pedido[]>('/api/pedidos/mis-pedidos/historial');
    return data;
  },

  // Direcciones
  getDirecciones: async (): Promise<DireccionCliente[]> => {
    const { data } = await apiClient.get<DireccionCliente[]>('/api/cliente/direcciones');
    return data;
  },

  crearDireccion: async (dto: CrearDireccionDto): Promise<DireccionCliente> => {
    const { data } = await apiClient.post<DireccionCliente>('/api/cliente/direcciones', dto);
    return data;
  },

  actualizarDireccion: async (id: string, dto: ActualizarDireccionDto): Promise<DireccionCliente> => {
    const { data } = await apiClient.patch<DireccionCliente>(`/api/cliente/direcciones/${id}`, dto);
    return data;
  },

  eliminarDireccion: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/cliente/direcciones/${id}`);
  },

  // Favoritos
  getFavoritos: async (): Promise<Comercio[]> => {
    const { data } = await apiClient.get<{ comercios: Comercio[] }>('/api/cliente/favoritos');
    return data.comercios;
  },

  agregarFavorito: async (comercioId: string): Promise<void> => {
    await apiClient.post(`/api/cliente/favoritos/${comercioId}`);
  },

  quitarFavorito: async (comercioId: string): Promise<void> => {
    await apiClient.delete(`/api/cliente/favoritos/${comercioId}`);
  },

  calificarPedido: async (
    pedidoId: string,
    dto: { puntaje: number; comentario?: string }
  ): Promise<void> => {
    await apiClient.post(`/api/pedidos/${pedidoId}/calificar`, dto);
  },
};
