import { QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SuperTokens from 'supertokens-react-native';

import '../global.css';
import { env } from '@/config/env';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { queryClient } from '@/shared/api/query-client';
import { RolUsuario } from '@/shared/types/pedido.types';

SuperTokens.init({
  apiDomain: env.API_URL,
  apiBasePath: '/auth',
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function NotificationNavigator() {
  const router = useRouter();
  const { rol, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      if (!isAuthenticated) return;
      const data = response.notification.request.content.data as Record<string, string>;
      const { tipo, pedidoId } = data;

      if (!pedidoId) return;

      if (tipo === 'NUEVO_PEDIDO' && rol === RolUsuario.REPARTIDOR) {
        router.push(`/(repartidor)/pedido/${pedidoId}` as any);
      } else if (
        (tipo === 'AVISAR_CLIENTE' || tipo === 'PEDIDO_EN_CAMINO') &&
        rol === RolUsuario.CLIENTE
      ) {
        router.push(`/(cliente)/pedido/${pedidoId}` as any);
      }
    });
    return () => sub.remove();
  }, [isAuthenticated, rol, router]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <NotificationNavigator />
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
