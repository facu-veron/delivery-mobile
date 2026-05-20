import { useRouter } from 'expo-router';
import { Bike, Home, MapPin, User } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccionesPedido } from '@/features/pedidos/components/AccionesPedido';
import { EstadoBadge } from '@/features/pedidos/components/EstadoBadge';
import { usePedidoActivo } from '@/features/repartidor/hooks/usePedidoActivo';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { formatARS } from '@/shared/lib/formatters';
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

export default function ActivoScreen() {
  const router = useRouter();
  const { data: pedido, isLoading } = usePedidoActivo();

  if (isLoading) return <LoadingSpinner />;

  if (!pedido) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
        <View className="px-4 pt-4">
          <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark tracking-tight">
            En curso
          </Text>
        </View>
        <EmptyState
          icon={Bike}
          title="No tenés un pedido activo"
          description="Cuando tomes un pedido vas a poder gestionarlo desde acá."
          action={
            <Button
              variant="primary"
              size="md"
              onPress={() => router.push('/(repartidor)/(tabs)/disponibles' as any)}
            >
              Ver pedidos disponibles
            </Button>
          }
        />
      </SafeAreaView>
    );
  }

  const esLibre = pedido.tipo === TipoPedido.LIBRE;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark tracking-tight">
          En curso
        </Text>
        <EstadoBadge estado={pedido.estado} />
      </View>

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

        {/* Producto */}
        <Card>
          <Text className="text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wider mb-2">
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
          <Text className="text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wider mb-2">
            Montos
          </Text>
          <Fila label="Costo de envío (tu ganancia)" value={formatARS(pedido.costoEnvio)} />
          <View className="flex-row justify-between py-2 mt-1">
            <Text className="text-base font-bold text-foreground dark:text-foreground-dark">
              Total a cobrar al cliente
            </Text>
            <Text className="text-base font-bold text-primary">
              {formatARS(pedido.montoTotal)}
            </Text>
          </View>
        </Card>

        <AccionesPedido pedido={pedido} />
      </ScrollView>
    </SafeAreaView>
  );
}
