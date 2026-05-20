import { useRouter } from 'expo-router';
import { History, Home } from 'lucide-react-native';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHistorialCliente } from '@/features/cliente/hooks/useHistorialCliente';
import { EstadoBadge } from '@/features/pedidos/components/EstadoBadge';
import { EmptyState } from '@/shared/components/EmptyState';
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
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#EEC234" />
        }
        ListHeaderComponent={
          <View className="px-4 pt-4 pb-3">
            <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark tracking-tight">
              Historial
            </Text>
            {pedidos && pedidos.length > 0 ? (
              <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground mt-0.5">
                {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''} finalizado{pedidos.length !== 1 ? 's' : ''}
              </Text>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/(cliente)/pedido/${item.id}` as any)}
            className="mx-4 mb-3 bg-card dark:bg-card-dark rounded-xl p-4 border border-border dark:border-border-dark active:opacity-80 shadow-sm shadow-foreground/5"
          >
            <View className="flex-row items-start justify-between mb-1.5 gap-2">
              <Text className="text-sm font-semibold text-foreground dark:text-card-dark-foreground flex-1">
                {item.tipo === TipoPedido.LIBRE
                  ? item.localNombre ?? 'Pedido libre'
                  : item.comercio?.nombre ?? 'Pedido'}
              </Text>
              <EstadoBadge estado={item.estado} />
            </View>
            <View className="flex-row items-center gap-1.5">
              <Home size={12} color="#6A6052" strokeWidth={2} />
              <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground flex-1" numberOfLines={1}>
                {item.clienteDireccion}
              </Text>
            </View>
            <View className="flex-row justify-between items-center mt-2.5 pt-2.5 border-t border-border dark:border-border-dark">
              <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">
                {formatDateTime(item.createdAt)}
              </Text>
              <Text className="text-sm font-bold text-foreground dark:text-foreground-dark">
                {formatARS(item.montoTotal)}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <EmptyState
            icon={History}
            title="Todavía no tenés pedidos"
            description="Acá vas a ver el historial de tus pedidos finalizados."
          />
        }
      />
    </SafeAreaView>
  );
}
