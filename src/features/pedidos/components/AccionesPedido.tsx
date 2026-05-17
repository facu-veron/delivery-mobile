import { Text, View } from 'react-native';

import { Button } from '@/shared/components/Button';
import { EstadoPedido, TipoPedido, type Pedido } from '@/shared/types/pedido.types';
import { useAvisarCliente } from '../hooks/useAvisarCliente';
import { useEntregarPedido } from '../hooks/useEntregarPedido';
import { useMarcarEnCamino } from '../hooks/useMarcarEnCamino';
import { getAccionesDisponibles } from '../utils/transiciones-estado';
import { ConfirmarPrecioForm } from './ConfirmarPrecioForm';

interface AccionesPedidoProps {
  pedido: Pedido;
}

export function AccionesPedido({ pedido }: AccionesPedidoProps) {
  const acciones = getAccionesDisponibles(pedido.estado, pedido.tipo);

  const enCamino = useMarcarEnCamino(pedido.id);
  const entregar = useEntregarPedido(pedido.id);
  const avisar   = useAvisarCliente(pedido.id);

  if (pedido.estado === EstadoPedido.PRECIO_PENDIENTE) {
    return (
      <View className="p-4 bg-warning-light dark:bg-warning-dark-light rounded-2xl">
        <Text className="text-sm text-warning dark:text-warning-dark text-center font-medium">
          Esperando confirmación del precio por parte del sistema...
        </Text>
      </View>
    );
  }

  if (acciones.length === 0) return null;

  return (
    <View className="gap-3">
      {acciones.includes('confirmar-precio') && (
        <ConfirmarPrecioForm
          pedidoId={pedido.id}
          precioEstimado={pedido.precioEstimado}
        />
      )}

      {acciones.includes('en-camino') && (
        <Button
          onPress={() => enCamino.mutate()}
          loading={enCamino.isPending}
        >
          Ya retiré del local
        </Button>
      )}

      {acciones.includes('entregar') && (
        <Button
          onPress={() => entregar.mutate()}
          loading={entregar.isPending}
        >
          Entregué el pedido
        </Button>
      )}

      {acciones.includes('avisar-cliente') && (
        <Button
          variant="secondary"
          onPress={() => avisar.mutate()}
          loading={avisar.isPending}
        >
          Avisar al cliente (estoy en la puerta)
        </Button>
      )}
    </View>
  );
}
