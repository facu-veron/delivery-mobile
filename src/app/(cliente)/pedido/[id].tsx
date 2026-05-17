import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePedidoCliente } from '@/features/cliente/hooks/usePedidoCliente';
import { EstadoBadge } from '@/features/pedidos/components/EstadoBadge';
import { Card } from '@/shared/components/Card';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { formatARS, formatDateTime } from '@/shared/lib/formatters';
import { EstadoPedido, TipoPedido } from '@/shared/types/pedido.types';

const PASOS_ESTADO: Partial<Record<EstadoPedido, { label: string; descripcion: string }>> = {
  [EstadoPedido.BUSCANDO_REPARTIDOR]: {
    label: 'Buscando repartidor',
    descripcion: 'Estamos buscando a alguien que lleve tu pedido.',
  },
  [EstadoPedido.ASIGNADO]: {
    label: 'Repartidor asignado',
    descripcion: 'Un repartidor aceptó tu pedido y se dirige al local.',
  },
  [EstadoPedido.PRECIO_PENDIENTE]: {
    label: 'Esperando confirmación de precio',
    descripcion: 'El repartidor está por confirmar el precio real del producto.',
  },
  [EstadoPedido.PRECIO_CONFIRMADO]: {
    label: 'Precio confirmado',
    descripcion: 'El repartidor confirmó el precio y se dirige a retirar.',
  },
  [EstadoPedido.LISTO_PARA_RETIRAR]: {
    label: 'Listo para retirar',
    descripcion: 'Tu pedido está listo — el repartidor va a buscarlo.',
  },
  [EstadoPedido.EN_CAMINO]: {
    label: 'En camino',
    descripcion: '¡Tu pedido está en camino! Prepárate para recibirlo.',
  },
  [EstadoPedido.ENTREGADO]: {
    label: 'Entregado',
    descripcion: '¡Tu pedido fue entregado! Que lo disfrutes.',
  },
  [EstadoPedido.CANCELADO]: {
    label: 'Cancelado',
    descripcion: 'El pedido fue cancelado.',
  },
  [EstadoPedido.CANCELADO_PRECIO]: {
    label: 'Cancelado por precio',
    descripcion: 'El pedido fue cancelado porque el precio real superó el estimado.',
  },
};

function Fila({ label, value }: { label: string; value: string }) {
  return (
    <View className="py-2 border-b border-border dark:border-border-dark last:border-0">
      <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">{label}</Text>
      <Text className="text-sm font-medium text-foreground dark:text-foreground-dark mt-0.5">{value}</Text>
    </View>
  );
}

export default function PedidoClienteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: pedido, isLoading, isError } = usePedidoCliente(id);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !pedido) return <ErrorMessage message="No se pudo cargar el pedido." />;

  const paso = PASOS_ESTADO[pedido.estado];
  const esLibre = pedido.tipo === TipoPedido.LIBRE;
  const entregado = pedido.estado === EstadoPedido.ENTREGADO;
  const cancelado =
    pedido.estado === EstadoPedido.CANCELADO ||
    pedido.estado === EstadoPedido.CANCELADO_PRECIO;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <View className="flex-row items-center gap-3 px-4 pt-4 pb-2">
        <Pressable onPress={() => router.back()} className="p-2">
          <Text className="text-primary text-lg">←</Text>
        </Pressable>
        <Text className="flex-1 text-xl font-bold text-foreground dark:text-foreground-dark">
          {esLibre ? pedido.localNombre ?? 'Pedido libre' : pedido.comercio?.nombre ?? 'Tu pedido'}
        </Text>
        <EstadoBadge estado={pedido.estado} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {/* Estado actual */}
        {paso && (
          <View
            className={`rounded-xl p-4 ${
              entregado
                ? 'bg-success-light dark:bg-success-dark-light'
                : cancelado
                ? 'bg-destructive-light dark:bg-destructive-dark-light'
                : 'bg-warning-light dark:bg-warning-dark-light'
            }`}
          >
            <Text
              className={`text-sm font-bold mb-1 ${
                entregado
                  ? 'text-success dark:text-success-dark'
                  : cancelado
                  ? 'text-destructive dark:text-destructive-dark'
                  : 'text-warning dark:text-warning-dark'
              }`}
            >
              {paso.label}
            </Text>
            <Text
              className={`text-xs ${
                entregado
                  ? 'text-success dark:text-success-dark'
                  : cancelado
                  ? 'text-destructive dark:text-destructive-dark'
                  : 'text-warning-foreground dark:text-warning-dark-foreground'
              }`}
            >
              {paso.descripcion}
            </Text>
          </View>
        )}

        {/* Dirección */}
        <Card>
          <Text className="text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wide mb-2">
            Detalles
          </Text>
          <Fila label="📍 Retiran en" value={pedido.localDireccion} />
          <Fila label="🏠 Te entregan en" value={pedido.clienteDireccion} />
        </Card>

        {/* Contenido del pedido */}
        <Card>
          <Text className="text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wide mb-2">
            {esLibre ? 'Producto' : 'Items'}
          </Text>
          {esLibre ? (
            <>
              <Fila label="Descripción" value={pedido.productoDescripcion ?? '—'} />
              {pedido.instruccionSinStock && (
                <Fila label="Si no hay stock" value={pedido.instruccionSinStock} />
              )}
              {pedido.precioEstimado != null && (
                <Fila label="Precio estimado" value={formatARS(pedido.precioEstimado)} />
              )}
              {pedido.precioReal != null && (
                <Fila label="Precio real" value={formatARS(pedido.precioReal)} />
              )}
            </>
          ) : (
            pedido.items?.map((item, i) => (
              <Fila
                key={i}
                label={`${item.cantidad}x ${item.nombre}`}
                value={formatARS(item.precio * item.cantidad)}
              />
            ))
          )}
        </Card>

        {/* Montos */}
        <Card>
          <Text className="text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wide mb-2">
            Resumen
          </Text>
          <Fila label="Costo de envío" value={formatARS(pedido.costoEnvio)} />
          <View className="flex-row justify-between py-2 mt-1">
            <Text className="text-base font-bold text-foreground dark:text-foreground-dark">
              Total
            </Text>
            <Text className="text-base font-bold text-primary">
              {formatARS(pedido.montoTotal)}
            </Text>
          </View>
        </Card>

        <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground text-center">
          Pedido #{pedido.id.slice(-6).toUpperCase()} · {formatDateTime(pedido.createdAt)}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
