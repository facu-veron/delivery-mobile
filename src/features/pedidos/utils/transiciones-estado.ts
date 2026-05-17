import { EstadoPedido, TipoPedido } from '@/shared/types/pedido.types';

export type AccionPedido =
  | 'confirmar-precio'
  | 'en-camino'
  | 'entregar'
  | 'avisar-cliente';

export function getAccionesDisponibles(
  estado: EstadoPedido,
  tipo: TipoPedido,
): AccionPedido[] {
  switch (estado) {
    case EstadoPedido.ASIGNADO:
      return tipo === TipoPedido.LIBRE ? ['confirmar-precio'] : ['en-camino'];
    case EstadoPedido.PRECIO_CONFIRMADO:
    case EstadoPedido.LISTO_PARA_RETIRAR:
      return ['en-camino'];
    case EstadoPedido.EN_CAMINO:
      return ['entregar', 'avisar-cliente'];
    default:
      return [];
  }
}

export function esPedidoTerminado(estado: EstadoPedido): boolean {
  return [
    EstadoPedido.ENTREGADO,
    EstadoPedido.CANCELADO,
    EstadoPedido.CANCELADO_PRECIO,
  ].includes(estado);
}
