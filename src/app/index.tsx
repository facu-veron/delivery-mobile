import { Redirect } from 'expo-router';

import { useSession } from '@/features/auth/hooks/useSession';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { RolUsuario } from '@/shared/types/pedido.types';

export default function Index() {
  const { loading } = useSession();
  const { isAuthenticated, rol } = useAuthStore();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
  if (rol === RolUsuario.CLIENTE) return <Redirect href="/(cliente)" />;
  if (rol === RolUsuario.REPARTIDOR) return <Redirect href="/(repartidor)" />;

  return <Redirect href="/(auth)/login" />;
}
