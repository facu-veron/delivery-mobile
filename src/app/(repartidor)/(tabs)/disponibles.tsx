import { useRouter } from 'expo-router';
import { Inbox, Power } from 'lucide-react-native';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PedidoCard } from '@/features/pedidos/components/PedidoCard';
import { usePedidosDisponibles } from '@/features/pedidos/hooks/usePedidosDisponibles';
import { useTomarPedido } from '@/features/pedidos/hooks/useTomarPedido';
import { usePerfil } from '@/features/repartidor/hooks/usePerfil';
import { useDisponibilidadStore } from '@/features/repartidor/store/disponibilidad.store';
import { Button } from '@/shared/components/Button';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { EstadoAprobacion } from '@/shared/types/pedido.types';

export default function DisponiblesScreen() {
  const router = useRouter();
  const { data: perfil, isLoading: loadingPerfil } = usePerfil();
  const disponible = useDisponibilidadStore((s) => s.disponible);
  const { data: pedidos, isLoading, isError, refetch, isRefetching } = usePedidosDisponibles();
  const { mutate: tomar, isPending: tomando } = useTomarPedido();

  if (loadingPerfil) return <LoadingSpinner />;

  const aprobacion = perfil?.aprobacion ?? EstadoAprobacion.PENDIENTE;
  const noAprobado = aprobacion !== EstadoAprobacion.APROBADO;

  // Estado 1: cuenta no aprobada
  if (noAprobado) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
        <View className="px-4 pt-4 pb-3">
          <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark tracking-tight">
            Pedidos disponibles
          </Text>
        </View>
        <EmptyState
          icon={Inbox}
          title="Tu cuenta no está activa"
          description="Completá la carga de documentos para que el equipo pueda aprobar tu cuenta y empieces a recibir pedidos."
          action={
            <Button onPress={() => router.push('/(repartidor)/documentos' as any)}>
              Ver documentos
            </Button>
          }
        />
      </SafeAreaView>
    );
  }

  // Estado 2: aprobado pero offline
  if (!disponible) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
        <View className="px-4 pt-4 pb-3">
          <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark tracking-tight">
            Pedidos disponibles
          </Text>
        </View>
        <EmptyState
          icon={Power}
          title="Estás offline"
          description="Activá tu disponibilidad desde tu perfil para empezar a recibir pedidos."
          action={
            <Button onPress={() => router.push('/(repartidor)/(tabs)/perfil' as any)}>
              Ir a mi perfil
            </Button>
          }
        />
      </SafeAreaView>
    );
  }

  // Estado 3: activo, lista normal
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <View className="px-4 pt-4 pb-3">
        <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark tracking-tight">
          Pedidos disponibles
        </Text>
        <View className="flex-row items-center gap-1.5 mt-0.5">
          <View className="w-2 h-2 rounded-full bg-success" />
          <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground">
            Estás online — tocá un pedido para tomarlo
          </Text>
        </View>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorMessage message="No se pudieron cargar los pedidos." />
      ) : (
        <FlatList
          data={pedidos ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#EEC234" />
          }
          renderItem={({ item }) => (
            <PedidoCard
              pedido={item}
              onPress={() => {
                if (tomando) return;
                tomar(item.id);
              }}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon={Inbox}
              title="No hay pedidos en este momento"
              description="Te avisamos por notificación apenas aparezca uno nuevo."
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
