import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ComercioCard } from '@/features/cliente/components/ComercioCard';
import { useFavoritos, useToggleFavorito } from '@/features/cliente/hooks/useFavoritos';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { Comercio } from '@/shared/types/comercio.types';

export default function FavoritosScreen() {
  const router = useRouter();
  const { data: favoritos, isLoading } = useFavoritos();
  const { mutate: toggle } = useToggleFavorito();

  if (isLoading) return <LoadingSpinner />;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScreenHeader title="Favoritos" />

      <FlatList<Comercio>
        data={favoritos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <ComercioCard
            comercio={item}
            isFavorito
            onPress={() => router.push(`/(cliente)/comercio/${item.id}` as any)}
            onToggleFavorito={() => toggle({ comercioId: item.id, isFavorito: true })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon={Heart}
            title="Sin favoritos"
            description="Tocá el corazón en un comercio para guardarlo acá."
          />
        }
      />
    </SafeAreaView>
  );
}
