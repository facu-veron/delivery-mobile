import { useLocalSearchParams } from 'expo-router';
import { Home, MapPin, User } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccionesPedido } from '@/features/pedidos/components/AccionesPedido';
import { EstadoBadge } from '@/features/pedidos/components/EstadoBadge';
import { usePedidoDetalle } from '@/features/pedidos/hooks/usePedidoDetalle';
import { Card } from '@/shared/components/Card';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { formatARS, formatDateTime } from '@/shared/lib/formatters';
import { TipoPedido } from '@/shared/types/pedido.types';

function Fila({ label, value }: { label: string; value: string }) {
  return (
    <View className="py-2 border-b border-border dark:border-border-dark last:border-0">
      <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">{label}</Text>
      <Text className="text-sm font-medium text-foreground dark:text-foreground-dark mt-0.5">{value}</Text>
    </View>
  );
}

function FilaConIcono({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="py-2 border-b border-border dark:border-border-dark last:border-0">
      <View className="flex-row items-center gap-1.5">
        {icon}
        <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">{label}</Text>
      </View>
      <Text className="text-sm font-medium text-foreground dark:text-foreground-dark mt-0.5 ml-5">
        {value}
      </Text>
    </View>
  );
}

export default function PedidoDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: pedido, isLoading, isError } = usePedidoDetalle(id);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !pedido) return <ErrorMessage message="No se pudo cargar el pedido." />;

  const esLibre = pedido.tipo === TipoPedido.LIBRE;
  const titulo = esLibre
    ? pedido.localNombre ?? 'Pedido libre'
    : pedido.comercio?.nombre ?? 'Pedido catálogo';

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScreenHeader
        title={titulo}
        right={<EstadoBadge estado={pedido.estado} />}
      />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {/* Direcciones */}
        <Card>
          <Text className="text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wider mb-2">
            Direcciones
          </Text>
          <FilaConIcono
            icon={<MapPin size={13} color="#6A6052" strokeWidth={2} />}
            label="Retirar en"
            value={pedido.localDireccion}
          />
          <FilaConIcono
            icon={<Home size={13} color="#6A6052" strokeWidth={2} />}
            label="Entregar en"
            value={pedido.clienteDireccion}
          />
          <FilaConIcono
            icon={<User size={13} color="#6A6052" strokeWidth={2} />}
            label="Cliente"
            value={`${pedido.cliente.nombre} · ${pedido.cliente.telefono}`}
          />
        </Card>

        {/* Detalle del pedido */}
        <Card>
          <Text className="text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wider mb-2">
            {esLibre ? 'Producto' : 'Items del pedido'}
          </Text>

          {esLibre ? (
            <>
              <Fila label="Descripción" value={pedido.productoDescripcion ?? '—'} />
              {pedido.instruccionSinStock && (
                <Fila label="Si no hay stock" value={pedido.instruccionSinStock} />
              )}
              {pedido.precioEstimado != null && (
                <Fila label="Precio estimado por cliente" value={formatARS(pedido.precioEstimado)} />
              )}
              {pedido.precioReal != null && (
                <Fila label="Precio real confirmado" value={formatARS(pedido.precioReal)} />
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
          <Text className="text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wider mb-2">
            Resumen de montos
          </Text>
          <Fila label="Costo de envío" value={formatARS(pedido.costoEnvio)} />
          <View className="flex-row justify-between py-2 mt-1">
            <Text className="text-base font-bold text-foreground dark:text-foreground-dark">
              Total a cobrar al cliente
            </Text>
            <Text className="text-base font-bold text-primary">
              {formatARS(pedido.montoTotal)}
            </Text>
          </View>
        </Card>

        {/* Acciones según estado */}
        <AccionesPedido pedido={pedido} />

        <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground text-center">
          Pedido #{pedido.id.slice(-6).toUpperCase()} · {formatDateTime(pedido.createdAt)}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
