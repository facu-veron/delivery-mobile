import { useRouter } from 'expo-router';
import {
  Bell,
  CircleHelp,
  ClipboardList,
  CreditCard,
  Heart,
  History,
  Lock,
  LogOut,
  MapPin,
  User,
} from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLogout } from '@/features/auth/hooks/useLogout';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { Avatar } from '@/shared/components/Avatar';
import { ProfileListItem } from '@/shared/components/profile/ProfileListItem';
import { ProfileQuickAction } from '@/shared/components/profile/ProfileQuickAction';
import { ProfileSection } from '@/shared/components/profile/ProfileSection';
import { useNoLeidas } from '@/shared/hooks/useNotificaciones';

function NoImplementadoAlert(feature: string) {
  return () => {
    // eslint-disable-next-line no-console
    console.log(`[perfil cliente] ${feature} — pendiente de backend`);
  };
}

export default function ClientePerfilScreen() {
  const router = useRouter();
  const { nombre, avatarUrl } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();
  const { data: noLeidas } = useNoLeidas();

  const firstName = nombre.split(' ')[0] || nombre;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView contentContainerStyle={{ paddingBottom: 24, gap: 16 }}>
        {/* Header */}
        <View className="px-4 pt-4 pb-1 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1">
            <Avatar nombre={nombre} avatarUrl={avatarUrl ?? undefined} size={44} />
            <View className="flex-1">
              <Text className="text-base text-foreground dark:text-foreground-dark">
                ¡Hola, <Text className="font-bold">{firstName}!</Text>
              </Text>
              <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground mt-0.5">
                Bienvenido a DeliverYa
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push('/(cliente)/notificaciones' as any)}
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

        {/* Quick actions */}
        <View className="px-4 flex-row gap-3">
          <ProfileQuickAction
            icon={MapPin}
            label="Direcciones"
            onPress={() => router.push('/(cliente)/direcciones' as any)}
          />
          <ProfileQuickAction
            icon={Heart}
            label="Favoritos"
            onPress={() => router.push('/(cliente)/favoritos' as any)}
          />
          <ProfileQuickAction
            icon={CreditCard}
            label="Pago"
            onPress={NoImplementadoAlert('métodos de pago')}
          />
          <ProfileQuickAction
            icon={CircleHelp}
            label="Ayuda"
            onPress={() => router.push('/(cliente)/ayuda' as any)}
          />
        </View>

        {/* Sección Actividad */}
        <ProfileSection title="Actividad">
          <ProfileListItem
            icon={ClipboardList}
            label="Pedidos activos"
            onPress={() => router.push('/(cliente)/(tabs)/pedidos' as any)}
          />
          <ProfileListItem
            icon={History}
            label="Historial"
            onPress={() => router.push('/(cliente)/(tabs)/historial' as any)}
          />
        </ProfileSection>

        {/* Sección Cuenta */}
        <ProfileSection title="Cuenta">
          <ProfileListItem
            icon={User}
            label="Datos personales"
            description={nombre}
            onPress={() => router.push('/(cliente)/editar-perfil' as any)}
          />
          <ProfileListItem
            icon={Lock}
            label="Cambiar contraseña"
            onPress={() => router.push('/(cliente)/cambiar-password' as any)}
          />
          <ProfileListItem
            icon={Bell}
            label="Notificaciones"
            onPress={NoImplementadoAlert('preferencias notif')}
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
          DeliverYa · Cliente
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
