export enum RolUsuario {
  CLIENTE = 'CLIENTE',
  REPARTIDOR = 'REPARTIDOR',
}

export enum TipoPedido {
  LIBRE = 'LIBRE',
  CATALOGO = 'CATALOGO',
}

export enum EstadoPedido {
  BUSCANDO_REPARTIDOR = 'BUSCANDO_REPARTIDOR',
  ASIGNADO = 'ASIGNADO',
  PRECIO_PENDIENTE = 'PRECIO_PENDIENTE',
  PRECIO_CONFIRMADO = 'PRECIO_CONFIRMADO',
  LISTO_PARA_RETIRAR = 'LISTO_PARA_RETIRAR',
  EN_CAMINO = 'EN_CAMINO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
  CANCELADO_PRECIO = 'CANCELADO_PRECIO',
}

export enum EstadoDocumento {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
}

export enum EstadoRepartidor {
  DISPONIBLE = 'DISPONIBLE',
  NO_DISPONIBLE = 'NO_DISPONIBLE',
  EN_PEDIDO = 'EN_PEDIDO',
}

export enum EstadoAprobacion {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
}

// ─── API response shapes ────────────────────────────────────────────────────

export interface PedidoItem {
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface Pedido {
  id: string;
  tipo: TipoPedido;
  estado: EstadoPedido;
  // LIBRE
  localNombre?: string;
  localDireccion: string;
  productoDescripcion?: string;
  instruccionSinStock?: string;
  precioEstimado?: number;
  precioReal?: number;
  // CATALOGO
  comercio?: { id: string; nombre: string; direccion: string };
  items?: PedidoItem[];
  // Shared
  costoEnvio: number;
  montoTotal: number;
  clienteDireccion: string;
  cliente: { nombre: string; telefono: string };
  repartidorId?: string;
  createdAt: string;
  busquedaExpiraEn?: string;
}

export interface Repartidor {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  vehiculo: string;
  zona: string;
  disponible: boolean;
  aprobacion: EstadoAprobacion;
}
