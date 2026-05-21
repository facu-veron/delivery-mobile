import { useRouter } from 'expo-router';
import {
  Bell,
  CircleHelp,
  FileText,
  Lock,
  LogOut,
  MapPin,
  Phone,
  Star,
  TrendingUp,
  Truck,
  User,
  Wallet,
} from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLogout } from '@/features/auth/hooks/useLogout';
import { DisponibilidadSwitch } from '@/features/repartidor/components/DisponibilidadSwitch';
import { usePerfil } from '@/features/repartidor/hooks/usePerfil';
import { Avatar } from '@/shared/components/Avatar';
import { Badge } from '@/shared/components/Badge';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ProfileListItem } from '@/shared/components/profile/ProfileListItem';
import { ProfileQuickAction } from '@/shared/components/profile/ProfileQuickAction';
import { ProfileSection } from '@/shared/components/profile/ProfileSection';
import { useNoLeidas } from '@/shared/hooks/useNotificaciones';
import { EstadoAprobacion } from '@/shared/types/pedido.types';

const aprobacionVariant = {
  [EstadoAprobacion.APROBADO]: 'success',
  [EstadoAprobacion.PENDIENTE]: 'warning',
  [EstadoAprobacion.PENDIENTE_REVISION]: 'warning',
  [EstadoAprobacion.RECHAZADO]: 'destructive',
  [EstadoAprobacion.SUSPENDIDO]: 'destructive',
} as const;

const aprobacionLabel = {
  [EstadoAprobacion.APROBADO]: 'Aprobado',
  [EstadoAprobacion.PENDIENTE]: 'Pendiente',
  [EstadoAprobacion.PENDIENTE_REVISION]: 'En revisión',
  [EstadoAprobacion.RECHAZADO]: 'Rechazado',
  [EstadoAprobacion.SUSPENDIDO]: 'Suspendido',
};

function NoImplementadoAlert(feature: string) {
  return () => {
    // eslint-disable-next-line no-console
    console.log(`[perfil] ${feature} — pendiente de backend`);
  };
}

export default function PerfilScreen() {
  const router = useRouter();
  const { data: perfil, isLoading } = usePerfil();
  const { mutate: logout, isPending } = useLogout();
  const { data: noLeidas } = useNoLeidas();

  if (isLoading || !perfil) return <LoadingSpinner />;

  const firstName = perfil.nombre.split(' ')[0];

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView contentContainerStyle={{ paddingBottom: 24, gap: 16 }}>
        {/* Header: saludo + estado */}
        <View className="px-4 pt-4 pb-1 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1">
            <Avatar nombre={perfil.nombre} size={44} />
            <View className="flex-1">
              <Text className="text-base text-foreground dark:text-foreground-dark">
                ¡Hola, <Text className="font-bold">{firstName}!</Text>
              </Text>
              <Badge variant={aprobacionVariant[perfil.estado]} dot>
                {aprobacionLabel[perfil.estado]}
              </Badge>
            </View>
          </View>
          <Pressable
            onPress={() => router.push('/(repartidor)/notificaciones' as any)}
            hitSlop={8}
            className="w-10 h-10 rounded-full bg-card dark:bg-card-dark border border-border dark:border-border-dark items-center justify-center active:opacity-70"
          >
            <Bell size={18} color="#251E14" strokeWidth={2} />
            {!!noLeidas && noLeidas > 0 && (
              <View className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive items-center justify-center">
                <Text className="text-[9px] font-bold text-white">
                  {noLeidas > 9 ? '9+' : noLeidas}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Disponibilidad (acción principal) */}
        <View className="px-4">
          <DisponibilidadSwitch estado={perfil.estado} />
        </View>

        {/* Quick actions */}
        <View className="px-4 flex-row gap-3">
          <ProfileQuickAction
            icon={FileText}
            label="Documentos"
            onPress={() => router.push('/(repartidor)/documentos' as any)}
          />
          <ProfileQuickAction
            icon={Wallet}
            label="Ganancias"
            onPress={() => router.push('/(repartidor)/ganancias' as any)}
          />
          <ProfileQuickAction
            icon={Star}
            label="Calificaciones"
            onPress={() => router.push('/(repartidor)/calificaciones' as any)}
          />
          <ProfileQuickAction
            icon={CircleHelp}
            label="Ayuda"
            onPress={() => router.push('/(repartidor)/ayuda' as any)}
          />
        </View>

        {/* Sección Cuenta */}
        <ProfileSection title="Cuenta">
          <ProfileListItem
            icon={User}
            label="Datos personales"
            onPress={() => router.push('/(repartidor)/editar-perfil' as any)}
          />
          <ProfileListItem
            icon={Phone}
            label="Teléfono"
            description={perfil.telefono}
            onPress={() => router.push('/(repartidor)/editar-perfil' as any)}
          />
          <ProfileListItem
            icon={Lock}
            label="Cambiar contraseña"
            onPress={() => router.push('/(repartidor)/cambiar-password' as any)}
          />
        </ProfileSection>

        {/* Sección Trabajo */}
        <ProfileSection title="Trabajo">
          <ProfileListItem
            icon={Truck}
            label="Vehículo"
            description={perfil.vehiculo}
            onPress={() => router.push('/(repartidor)/editar-perfil' as any)}
          />
          <ProfileListItem
            icon={MapPin}
            label="Zona de trabajo"
            description={perfil.zonaNombre ?? 'Sin zona asignada'}
            onPress={NoImplementadoAlert('zona')}
          />
          <ProfileListItem
            icon={TrendingUp}
            label="Estadísticas"
            description={`${perfil.totalEntregas} entregas · ⭐ ${perfil.calificacionProm.toFixed(1)}`}
            onPress={() => router.push('/(repartidor)/ganancias' as any)}
          />
        </ProfileSection>

        {/* Logout */}
        <View className="px-4 mt-2">
          <Pressable
            onPress={() => logout()}
            disabled={isPending}
            className="flex-row items-center justify-center gap-2 py-3.5 rounded-xl border border-destructive/30 active:bg-destructive-light/40 disabled:opacity-50"
          >
            <LogOut size={18} color="#C13D2A" strokeWidth={2} />
            <Text className="text-sm font-semibold text-destructive">
              Cerrar sesión
            </Text>
          </Pressable>
        </View>

        <Text className="text-[11px] text-center text-muted-foreground dark:text-muted-dark-foreground mt-1">
          DeliverYa · Repartidor
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
