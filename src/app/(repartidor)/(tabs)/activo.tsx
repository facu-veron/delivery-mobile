import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { Button } from '@/shared/components/Button';

// El pedido activo se obtiene del perfil del repartidor o de una query dedicada.
// Por ahora, el flujo lleva al repartidor a pedido/[id] directamente desde la push
// o desde la lista. Esta tab funciona como acceso rápido.
export default function ActivoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
          En curso
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-6 gap-4">
        <Text className="text-4xl">🛵</Text>
        <Text className="text-base text-muted-foreground dark:text-muted-dark-foreground text-center">
          Cuando tomés un pedido, aparecerá acá con todas las acciones disponibles.
        </Text>
      </View>
    </SafeAreaView>
  );
}
