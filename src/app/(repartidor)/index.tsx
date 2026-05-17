import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { Button } from '@/shared/components/Button';

export default function RepartidorHome() {
  const { nombre } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark items-center justify-center px-6 gap-4">
      <Text className="text-4xl">🛵</Text>
      <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark text-center">
        ¡Hola, {nombre || 'repartidor'}!
      </Text>
      <Text className="text-muted-foreground dark:text-muted-dark-foreground text-center">
        Fase 3 en construcción — aquí irá el panel del repartidor.
      </Text>
      <Button variant="ghost" onPress={() => logout()} loading={isPending} className="mt-4">
        Cerrar sesión
      </Button>
    </SafeAreaView>
  );
}
