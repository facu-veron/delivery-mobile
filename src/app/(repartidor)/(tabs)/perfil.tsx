import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLogout } from '@/features/auth/hooks/useLogout';
import { usePerfil } from '@/features/repartidor/hooks/usePerfil';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { EstadoAprobacion } from '@/shared/types/pedido.types';

const aprobacionVariant = {
  [EstadoAprobacion.APROBADO]:  'success',
  [EstadoAprobacion.PENDIENTE]: 'warning',
  [EstadoAprobacion.RECHAZADO]: 'destructive',
} as const;

const aprobacionLabel = {
  [EstadoAprobacion.APROBADO]:  'Cuenta aprobada',
  [EstadoAprobacion.PENDIENTE]: 'Aprobación pendiente',
  [EstadoAprobacion.RECHAZADO]: 'Cuenta rechazada',
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-2 border-b border-border dark:border-border-dark">
      <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground">{label}</Text>
      <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">{value}</Text>
    </View>
  );
}

export default function PerfilScreen() {
  const router = useRouter();
  const { data: perfil, isLoading } = usePerfil();
  const { mutate: logout, isPending } = useLogout();

  if (isLoading) return <LoadingSpinner />;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
          Mi perfil
        </Text>

        {/* Estado de cuenta */}
        {perfil && (
          <View className="items-start">
            <Badge variant={aprobacionVariant[perfil.aprobacion]}>
              {aprobacionLabel[perfil.aprobacion]}
            </Badge>
          </View>
        )}

        {/* Datos personales */}
        {perfil && (
          <Card>
            <Text className="text-sm font-semibold text-muted-foreground dark:text-muted-dark-foreground mb-2 uppercase tracking-wide">
              Datos personales
            </Text>
            <InfoRow label="Nombre" value={perfil.nombre} />
            <InfoRow label="Email" value={perfil.email} />
            <InfoRow label="Teléfono" value={perfil.telefono} />
            <InfoRow label="Vehículo" value={perfil.vehiculo} />
            <InfoRow label="Zona" value={perfil.zona} />
          </Card>
        )}

        {/* Documentos */}
        <Button
          variant="secondary"
          onPress={() => router.push('/(repartidor)/documentos' as any)}
        >
          Ver mis documentos
        </Button>

        {/* Logout */}
        <Button variant="destructive" onPress={() => logout()} loading={isPending}>
          Cerrar sesión
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
