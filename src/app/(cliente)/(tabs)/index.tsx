import { useRouter } from 'expo-router';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ComercioCard } from '@/features/cliente/components/ComercioCard';
import { useComercios } from '@/features/cliente/hooks/useComercios';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { Avatar } from '@/shared/components/Avatar';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Comercio } from '@/shared/types/comercio.types';

export default function ClienteHomeScreen() {
  const router = useRouter();
  const { nombre } = useAuthStore();
  const firstName = nombre.split(' ')[0];
  const { data: comercios, isLoading, isError, refetch, isRefetching } = useComercios();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message="No se pudieron cargar los comercios." />;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <FlatList<Comercio>
        data={comercios}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListHeaderComponent={
          <View className="px-4 pt-4 pb-3 gap-3">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground">
                  Bienvenido de vuelta
                </Text>
                <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
                  Hola, {firstName}
                </Text>
              </View>
              <Avatar nombre={nombre} size={44} />
            </View>
            {/* Pedido libre CTA */}
            <Pressable
              onPress={() => router.push('/(cliente)/pedido-libre/nuevo' as any)}
              className="bg-accent rounded-xl p-4 flex-row items-center gap-3 active:opacity-80"
            >
              <Text className="text-2xl">🛒</Text>
              <View className="flex-1">
                <Text className="text-sm font-bold text-accent-foreground">
                  Pedido libre
                </Text>
                <Text className="text-xs text-accent-foreground opacity-80">
                  Pedí de cualquier lugar — nosotros lo buscamos
                </Text>
              </View>
              <Text className="text-accent-foreground text-lg">→</Text>
            </Pressable>
            <Text className="text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wide">
              Comercios disponibles
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-4 mb-3">
            <ComercioCard
              comercio={item}
              onPress={() => router.push(`/(cliente)/comercio/${item.id}` as any)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20 gap-3">
            <Text className="text-4xl">🏪</Text>
            <Text className="text-muted-foreground dark:text-muted-dark-foreground text-center">
              No hay comercios disponibles por ahora.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
