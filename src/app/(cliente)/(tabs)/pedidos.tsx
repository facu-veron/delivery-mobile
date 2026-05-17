import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePedidosActivos } from '@/features/cliente/hooks/usePedidosActivos';
import { EstadoBadge } from '@/features/pedidos/components/EstadoBadge';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { formatARS, formatDateTime } from '@/shared/lib/formatters';
import { Pedido, TipoPedido } from '@/shared/types/pedido.types';

export default function PedidosClienteScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: pedidos, isLoading, isError, refetch, isRefetching } = usePedidosActivos();

  // Push notification handler: AVISAR_CLIENTE
  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener((notification) => {
      const tipo = notification.request.content.data?.tipo;
      if (tipo === 'AVISAR_CLIENTE') {
        queryClient.invalidateQueries({ queryKey: ['pedidos', 'activos', 'cliente'] });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    });
    return () => sub.remove();
  }, [queryClient]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message="No se pudieron cargar los pedidos." />;

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
              Mis pedidos
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/(cliente)/pedido/${item.id}` as any)}
            className="mx-4 mb-3 bg-card dark:bg-card-dark rounded-xl p-4 border border-border dark:border-border-dark active:opacity-75"
          >
            <View className="flex-row items-start justify-between mb-2">
              <Text className="text-sm font-semibold text-foreground dark:text-card-dark-foreground flex-1 mr-2">
                {item.tipo === TipoPedido.LIBRE
                  ? item.localNombre ?? 'Pedido libre'
                  : item.comercio?.nombre ?? 'Pedido'}
              </Text>
              <EstadoBadge estado={item.estado} />
            </View>
            <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">
              Entrega en: {item.clienteDireccion}
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
          <View className="flex-1 items-center justify-center py-20 gap-3">
            <Text className="text-4xl">📦</Text>
            <Text className="text-muted-foreground dark:text-muted-dark-foreground text-center">
              No tenés pedidos activos.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
