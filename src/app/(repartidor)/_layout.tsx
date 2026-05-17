import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { RolUsuario } from '@/shared/types/pedido.types';

export default function RepartidorLayout() {
  const { isAuthenticated, rol } = useAuthStore();

  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
  if (rol !== RolUsuario.REPARTIDOR) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
