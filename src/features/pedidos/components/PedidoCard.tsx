import { Pressable, Text, View } from 'react-native';

import { Card } from '@/shared/components/Card';
import { formatARS, formatTimeRemaining } from '@/shared/lib/formatters';
import { EstadoPedido, TipoPedido, type Pedido } from '@/shared/types/pedido.types';
import { EstadoBadge } from './EstadoBadge';

interface PedidoCardProps {
  pedido: Pedido;
  onPress: () => void;
}

export function PedidoCard({ pedido, onPress }: PedidoCardProps) {
  const localNombre =
    pedido.tipo === TipoPedido.CATALOGO
      ? pedido.comercio?.nombre ?? 'Comercio'
      : pedido.localNombre ?? 'Local';

  const descripcion =
    pedido.tipo === TipoPedido.CATALOGO
      ? `${pedido.items?.length ?? 0} items`
      : pedido.productoDescripcion ?? '';

  return (
    <Pressable onPress={onPress} className="active:opacity-75">
      <Card className="gap-3">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-base font-bold text-foreground dark:text-foreground-dark">
              {localNombre}
            </Text>
            <View className="bg-secondary dark:bg-secondary-dark rounded-full px-2 py-0.5">
              <Text className="text-xs text-secondary-foreground dark:text-secondary-dark-foreground font-medium">
                {pedido.tipo === TipoPedido.LIBRE ? 'LIBRE' : 'CATÁLOGO'}
              </Text>
            </View>
          </View>
          <EstadoBadge estado={pedido.estado} />
        </View>

        {/* Direcciones */}
        <View className="gap-1">
          <View className="flex-row items-start gap-2">
            <Text className="text-muted-foreground dark:text-muted-dark-foreground text-xs w-5">📍</Text>
            <Text className="text-sm text-foreground dark:text-foreground-dark flex-1" numberOfLines={1}>
              {pedido.localDireccion}
            </Text>
          </View>
          <View className="flex-row items-start gap-2">
            <Text className="text-muted-foreground dark:text-muted-dark-foreground text-xs w-5">🏠</Text>
            <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground flex-1" numberOfLines={1}>
              {pedido.clienteDireccion}
            </Text>
          </View>
        </View>

        {descripcion ? (
          <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground" numberOfLines={2}>
            {descripcion}
          </Text>
        ) : null}

        {/* Footer: montos + tiempo */}
        <View className="flex-row items-center justify-between pt-1 border-t border-border dark:border-border-dark">
          <View>
            <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">
              Total a cobrar
            </Text>
            <Text className="text-base font-bold text-foreground dark:text-foreground-dark">
              {formatARS(pedido.montoTotal)}
            </Text>
          </View>

          {pedido.estado === EstadoPedido.BUSCANDO_REPARTIDOR && pedido.busquedaExpiraEn && (
            <View className="bg-warning-light dark:bg-warning-dark-light rounded-lg px-3 py-1">
              <Text className="text-xs font-semibold text-warning dark:text-warning-dark">
                ⏱ {formatTimeRemaining(pedido.busquedaExpiraEn)}
              </Text>
            </View>
          )}
        </View>
      </Card>
    </Pressable>
  );
}
