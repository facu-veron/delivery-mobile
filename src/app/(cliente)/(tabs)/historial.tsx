import { useRouter } from 'expo-router';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHistorialCliente } from '@/features/cliente/hooks/useHistorialCliente';
import { EstadoBadge } from '@/features/pedidos/components/EstadoBadge';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { formatARS, formatDateTime } from '@/shared/lib/formatters';
import { Pedido, TipoPedido } from '@/shared/types/pedido.types';

export default function HistorialClienteScreen() {
  const router = useRouter();
  const { data: pedidos, isLoading, isError, refetch, isRefetching } = useHistorialCliente();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message="No se pudo cargar el historial." />;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <FlatList<Pedido>
        data={pedidos}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListHeaderComponent={
          <View className="px-4 pt-4 pb-3">
            <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
              Historial
            </Text>
            {pedidos && pedidos.length > 0 && (
              <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground mt-1">
                {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/(cliente)/pedido/${item.id}` as any)}
            className="mx-4 mb-3 bg-card dark:bg-card-dark rounded-xl p-4 border border-border dark:border-border-dark active:opacity-75"
          >
            <View className="flex-row items-start justify-between mb-1">
              <Text className="text-sm font-semibold text-foreground dark:text-card-dark-foreground flex-1 mr-2">
                {item.tipo === TipoPedido.LIBRE
                  ? item.localNombre ?? 'Pedido libre'
                  : item.comercio?.nombre ?? 'Pedido'}
              </Text>
              <EstadoBadge estado={item.estado} />
            </View>
            <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">
              🏠 {item.clienteDireccion}
            </Text>
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">
                {formatDateTime(item.createdAt)}
              </Text>
              <Text className="text-sm font-bold text-primary">
                {formatARS(item.montoTotal)}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-24 gap-3">
            <Text className="text-4xl">📋</Text>
            <Text className="text-base text-muted-foreground dark:text-muted-dark-foreground text-center">
              Todavía no tenés pedidos finalizados.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
