import { useRouter } from 'expo-router';
import { ChevronRight, ShoppingBag, Store } from 'lucide-react-native';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { ComercioCard } from '@/features/cliente/components/ComercioCard';
import { useComercios } from '@/features/cliente/hooks/useComercios';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Avatar } from '@/shared/components/Avatar';
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
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#EEC234" />
        }
        ListHeaderComponent={
          <View className="px-4 pt-4 pb-3 gap-4">
            {/* Saludo */}
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">
                  Bienvenido de vuelta
                </Text>
                <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark tracking-tight">
                  Hola, {firstName}
                </Text>
              </View>
              <Avatar nombre={nombre} size={44} />
            </View>

            {/* Pedido libre CTA */}
            <Pressable
              onPress={() => router.push('/(cliente)/pedido-libre/nuevo' as any)}
              className="bg-accent rounded-2xl p-4 flex-row items-center gap-3 active:opacity-90 shadow-sm shadow-foreground/10"
            >
              <View className="w-11 h-11 rounded-xl bg-white/15 items-center justify-center">
                <ShoppingBag size={22} color="#FEFEFE" strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-accent-foreground">
                  Pedido libre
                </Text>
                <Text className="text-xs text-accent-foreground/85 mt-0.5">
                  Pedí de cualquier lugar — nosotros lo buscamos
                </Text>
              </View>
              <ChevronRight size={20} color="#FEFEFE" strokeWidth={2.25} />
            </Pressable>

            <Text className="text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wider mt-1">
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
          <EmptyState
            icon={Store}
            title="No hay comercios disponibles"
            description="Volvé en un rato — estamos sumando nuevos lugares todo el tiempo."
          />
        }
      />
    </SafeAreaView>
  );
}
