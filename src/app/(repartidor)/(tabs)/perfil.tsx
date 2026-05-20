import { useRouter } from 'expo-router';
import {
  Bell,
  CircleHelp,
  FileText,
  Lock,
  LogOut,
  Mail,
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
import { EstadoAprobacion } from '@/shared/types/pedido.types';

const aprobacionVariant = {
  [EstadoAprobacion.APROBADO]: 'success',
  [EstadoAprobacion.PENDIENTE]: 'warning',
  [EstadoAprobacion.RECHAZADO]: 'destructive',
} as const;

const aprobacionLabel = {
  [EstadoAprobacion.APROBADO]: 'Aprobado',
  [EstadoAprobacion.PENDIENTE]: 'Pendiente',
  [EstadoAprobacion.RECHAZADO]: 'Rechazado',
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
              <Badge variant={aprobacionVariant[perfil.aprobacion]} dot>
                {aprobacionLabel[perfil.aprobacion]}
              </Badge>
            </View>
          </View>
          <Pressable
            onPress={NoImplementadoAlert('notificaciones')}
            hitSlop={8}
            className="w-10 h-10 rounded-full bg-card dark:bg-card-dark border border-border dark:border-border-dark items-center justify-center active:opacity-70"
          >
            <Bell size={18} color="#251E14" strokeWidth={2} />
          </Pressable>
        </View>

        {/* Disponibilidad (acción principal) */}
        <View className="px-4">
          <DisponibilidadSwitch aprobacion={perfil.aprobacion} />
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
            onPress={NoImplementadoAlert('ganancias')}
          />
          <ProfileQuickAction
            icon={Star}
            label="Calificaciones"
            onPress={NoImplementadoAlert('calificaciones')}
          />
          <ProfileQuickAction
            icon={CircleHelp}
            label="Ayuda"
            onPress={NoImplementadoAlert('ayuda')}
          />
        </View>

        {/* Sección Cuenta */}
        <ProfileSection title="Cuenta">
          <ProfileListItem
            icon={User}
            label="Datos personales"
            onPress={NoImplementadoAlert('editar perfil')}
          />
          <ProfileListItem
            icon={Mail}
            label="Email"
            description={perfil.email}
            onPress={NoImplementadoAlert('cambiar email')}
            showChevron={false}
          />
          <ProfileListItem
            icon={Phone}
            label="Teléfono"
            description={perfil.telefono}
            onPress={NoImplementadoAlert('cambiar teléfono')}
            showChevron={false}
          />
          <ProfileListItem
            icon={Lock}
            label="Cambiar contraseña"
            onPress={NoImplementadoAlert('cambiar password')}
          />
        </ProfileSection>

        {/* Sección Trabajo */}
        <ProfileSection title="Trabajo">
          <ProfileListItem
            icon={Truck}
            label="Vehículo"
            description={perfil.vehiculo}
            onPress={NoImplementadoAlert('vehículo')}
          />
          <ProfileListItem
            icon={MapPin}
            label="Zona de trabajo"
            description={perfil.zona}
            onPress={NoImplementadoAlert('zona')}
          />
          <ProfileListItem
            icon={TrendingUp}
            label="Estadísticas"
            onPress={NoImplementadoAlert('estadísticas')}
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
