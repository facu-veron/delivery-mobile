import { Redirect, Stack } from 'expo-router';

import { useMe } from '@/features/auth/hooks/useMe';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { RolUsuario } from '@/shared/types/pedido.types';

export default function ClienteLayout() {
  const { isAuthenticated, rol } = useAuthStore();

  // Hidrata el authStore con /api/me (avatarUrl, telefono)
  useMe();

  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
  if (rol !== RolUsuario.CLIENTE) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
