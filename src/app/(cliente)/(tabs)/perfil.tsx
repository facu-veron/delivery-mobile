import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLogout } from '@/features/auth/hooks/useLogout';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-2 border-b border-border dark:border-border-dark">
      <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground">{label}</Text>
      <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">{value}</Text>
    </View>
  );
}

export default function ClientePerfilScreen() {
  const { nombre } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
          Mi perfil
        </Text>

        <Card>
          <Text className="text-sm font-semibold text-muted-foreground dark:text-muted-dark-foreground mb-2 uppercase tracking-wide">
            Datos personales
          </Text>
          <InfoRow label="Nombre" value={nombre} />
        </Card>

        <Button variant="destructive" onPress={() => logout()} loading={isPending}>
          Cerrar sesión
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
