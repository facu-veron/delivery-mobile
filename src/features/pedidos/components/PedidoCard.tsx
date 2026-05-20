import { Home, MapPin, Timer } from 'lucide-react-native';
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
    <Pressable onPress={onPress} className="active:opacity-80">
      <Card className="gap-3">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2 flex-1 mr-2">
            <Text className="text-base font-bold text-foreground dark:text-foreground-dark" numberOfLines={1}>
              {localNombre}
            </Text>
            <View className="bg-secondary dark:bg-secondary-dark rounded-full px-2 py-0.5">
              <Text className="text-[10px] text-secondary-foreground dark:text-secondary-dark-foreground font-bold tracking-wider">
                {pedido.tipo === TipoPedido.LIBRE ? 'LIBRE' : 'CATÁLOGO'}
              </Text>
            </View>
          </View>
          <EstadoBadge estado={pedido.estado} />
        </View>

        {/* Direcciones */}
        <View className="gap-1.5">
          <View className="flex-row items-center gap-2">
            <MapPin size={13} color="#6A6052" strokeWidth={2} />
            <Text className="text-sm text-foreground dark:text-foreground-dark flex-1" numberOfLines={1}>
              {pedido.localDireccion}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Home size={13} color="#6A6052" strokeWidth={2} />
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
        <View className="flex-row items-center justify-between pt-2 border-t border-border dark:border-border-dark">
          <View>
            <Text className="text-[11px] text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wide">
              Total a cobrar
            </Text>
            <Text className="text-base font-bold text-foreground dark:text-foreground-dark">
              {formatARS(pedido.montoTotal)}
            </Text>
          </View>

          {pedido.estado === EstadoPedido.BUSCANDO_REPARTIDOR && pedido.busquedaExpiraEn && (
            <View className="flex-row items-center gap-1.5 bg-warning-light dark:bg-warning-dark-light rounded-lg px-2.5 py-1">
              <Timer size={12} color="#DFB030" strokeWidth={2.25} />
              <Text className="text-xs font-semibold text-warning dark:text-warning-dark">
                {formatTimeRemaining(pedido.busquedaExpiraEn)}
              </Text>
            </View>
          )}
        </View>
      </Card>
    </Pressable>
  );
}
