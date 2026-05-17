import { useRouter } from 'expo-router';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisponibilidadSwitch } from '@/features/repartidor/components/DisponibilidadSwitch';
import { usePerfil } from '@/features/repartidor/hooks/usePerfil';
import { PedidoCard } from '@/features/pedidos/components/PedidoCard';
import { usePedidosDisponibles } from '@/features/pedidos/hooks/usePedidosDisponibles';
import { useTomarPedido } from '@/features/pedidos/hooks/useTomarPedido';
import { EstadoAprobacion, type Pedido } from '@/shared/types/pedido.types';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function DisponiblesScreen() {
  const router = useRouter();
  const { data: perfil, isLoading: loadingPerfil } = usePerfil();
  const { data: pedidos, isLoading, isError, refetch, isRefetching } = usePedidosDisponibles();
  const { mutate: tomar, isPending: tomando } = useTomarPedido();

  if (loadingPerfil) return <LoadingSpinner />;

  const aprobacion = perfil?.aprobacion ?? EstadoAprobacion.PENDIENTE;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <View className="px-4 pt-4 pb-2 gap-3">
        <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
          Pedidos disponibles
        </Text>
        <DisponibilidadSwitch aprobacion={aprobacion} />
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorMessage message="No se pudieron cargar los pedidos." />
      ) : (
        <FlatList
          data={pedidos ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
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
            <View className="flex-1 items-center justify-center py-20 gap-3">
              <Text className="text-4xl">📭</Text>
              <Text className="text-base text-muted-foreground dark:text-muted-dark-foreground text-center">
                No hay pedidos disponibles en este momento.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
