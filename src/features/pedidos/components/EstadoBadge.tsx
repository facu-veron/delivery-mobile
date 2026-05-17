import { EstadoPedido } from '@/shared/types/pedido.types';
import { Badge } from '@/shared/components/Badge';

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'secondary';

const variantMap: Record<EstadoPedido, BadgeVariant> = {
  [EstadoPedido.BUSCANDO_REPARTIDOR]: 'warning',
  [EstadoPedido.ASIGNADO]:            'default',
  [EstadoPedido.PRECIO_PENDIENTE]:    'warning',
  [EstadoPedido.PRECIO_CONFIRMADO]:   'secondary',
  [EstadoPedido.LISTO_PARA_RETIRAR]:  'secondary',
  [EstadoPedido.EN_CAMINO]:           'secondary',
  [EstadoPedido.ENTREGADO]:           'success',
  [EstadoPedido.CANCELADO]:           'destructive',
  [EstadoPedido.CANCELADO_PRECIO]:    'destructive',
};

const labelMap: Record<EstadoPedido, string> = {
  [EstadoPedido.BUSCANDO_REPARTIDOR]: 'Buscando repartidor',
  [EstadoPedido.ASIGNADO]:            'Asignado',
  [EstadoPedido.PRECIO_PENDIENTE]:    'Precio pendiente',
  [EstadoPedido.PRECIO_CONFIRMADO]:   'Precio confirmado',
  [EstadoPedido.LISTO_PARA_RETIRAR]:  'Listo para retirar',
  [EstadoPedido.EN_CAMINO]:           'En camino',
  [EstadoPedido.ENTREGADO]:           'Entregado',
  [EstadoPedido.CANCELADO]:           'Cancelado',
  [EstadoPedido.CANCELADO_PRECIO]:    'Cancelado por precio',
};

interface EstadoBadgeProps {
  estado: EstadoPedido;
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  return <Badge variant={variantMap[estado]}>{labelMap[estado]}</Badge>;
}
