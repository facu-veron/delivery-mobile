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

export enum TipoDocumento {
  FOTO_PERSONAL = 'FOTO_PERSONAL',
  DNI_FRENTE = 'DNI_FRENTE',
  DNI_DORSO = 'DNI_DORSO',
  ANTECEDENTES_PENALES = 'ANTECEDENTES_PENALES',
  ANTECEDENTES_JUDICIALES = 'ANTECEDENTES_JUDICIALES',
}

export enum DisponibilidadRepartidor {
  DISPONIBLE = 'DISPONIBLE',
  NO_DISPONIBLE = 'NO_DISPONIBLE',
  EN_PEDIDO = 'EN_PEDIDO',
}

/** @deprecated Usar DisponibilidadRepartidor — mantenido por compatibilidad histórica */
export const EstadoRepartidor = DisponibilidadRepartidor;
export type EstadoRepartidor = DisponibilidadRepartidor;

export enum EstadoAprobacion {
  PENDIENTE = 'PENDIENTE',
  PENDIENTE_REVISION = 'PENDIENTE_REVISION',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  SUSPENDIDO = 'SUSPENDIDO',
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
  calificado?: boolean;
}

export enum TipoNotificacion {
  NUEVO_PEDIDO = 'NUEVO_PEDIDO',
  AVISAR_CLIENTE = 'AVISAR_CLIENTE',
  DOCUMENTO_APROBADO = 'DOCUMENTO_APROBADO',
  DOCUMENTO_RECHAZADO = 'DOCUMENTO_RECHAZADO',
  PEDIDO_ENTREGADO = 'PEDIDO_ENTREGADO',
  PEDIDO_CANCELADO = 'PEDIDO_CANCELADO',
  SISTEMA = 'SISTEMA',
}

export interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  titulo: string;
  cuerpo: string;
  data: Record<string, string> | null;
  leida: boolean;
  creadoEn: string;
}

export interface CalificacionRecibida {
  id: string;
  puntaje: number;
  comentario: string | null;
  fecha: string;
  clienteNombre: string;
}

export interface CalificacionesRepartidorResponse {
  promedio: number;
  total: number;
  ultimas: CalificacionRecibida[];
}

export interface NotificacionesResponse {
  total: number;
  noLeidas: number;
  items: Notificacion[];
}

export interface DocumentoRepartidor {
  id?: string;
  tipo: TipoDocumento;
  estado: EstadoDocumento;
  motivoRechazo: string | null;
  archivoUrl?: string;
}

export interface Repartidor {
  id: string;
  nombre: string;
  telefono: string;
  vehiculo: string;
  patente?: string;
  avatarUrl: string | null;
  /** Estado de aprobación de la cuenta — PENDIENTE/APROBADO/RECHAZADO */
  estado: EstadoAprobacion;
  /** Disponibilidad actual del repartidor — DISPONIBLE/NO_DISPONIBLE/EN_PEDIDO */
  disponibilidad: DisponibilidadRepartidor;
  zonaId: string;
  zonaNombre?: string;
  calificacionProm: number;
  totalEntregas: number;
  documentos: DocumentoRepartidor[];
}

export interface MePerfil {
  nombre: string;
  telefono: string;
  avatarUrl: string | null;
  creadoEn?: string;
}

export interface MeResponse {
  usuarioId: string;
  rol: RolUsuario;
  perfilId: string;
  perfil: MePerfil & { id: string };
}

export interface PeriodoEstadisticas {
  entregas: number;
  ganancias: number;
}

export interface EstadisticasRepartidor {
  hoy: PeriodoEstadisticas;
  semana: PeriodoEstadisticas;
  mes: PeriodoEstadisticas;
  rating: {
    promedio: number;
    totalCalificaciones: number;
  };
}

export interface GananciaPedido {
  pedidoId: string;
  fecha: string;
  montoEnvio: number;
}

export interface GananciasResponse {
  total: number;
  pedidos: GananciaPedido[];
}

export interface DireccionCliente {
  id: string;
  clienteId: string;
  alias: string;
  calle: string;
  numero: string;
  barrio?: string;
  referencia?: string;
  latitud?: number;
  longitud?: number;
  esPrincipal: boolean;
}

export type CrearDireccionDto = Omit<DireccionCliente, 'id' | 'clienteId'>;
export type ActualizarDireccionDto = Partial<Omit<DireccionCliente, 'id' | 'clienteId'>>;
