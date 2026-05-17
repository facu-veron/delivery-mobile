import * as Notifications from 'expo-notifications';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Text, useColorScheme } from 'react-native';

import { useActualizarPushToken } from '@/features/repartidor/hooks/useActualizarPushToken';
import { queryClient } from '@/shared/api/query-client';

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  return <Text style={{ fontSize: 20, color }}>{emoji}</Text>;
}

export default function RepartidorTabs() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  useActualizarPushToken();

  // Invalida la lista de pedidos disponibles cuando llega una push en foreground
  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener((notif) => {
      const tipo = notif.request.content.data?.tipo;
      if (tipo === 'NUEVO_PEDIDO') {
        queryClient.invalidateQueries({ queryKey: ['pedidos', 'disponibles'] });
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#261E14' : '#FFFFFF',
          borderTopColor: isDark ? '#3D3428' : '#E6E1D8',
        },
        tabBarActiveTintColor: '#EEC234',
        tabBarInactiveTintColor: isDark ? '#9E9891' : '#6A6052',
      }}
    >
      <Tabs.Screen
        name="disponibles"
        options={{
          title: 'Disponibles',
          tabBarIcon: ({ color }) => <TabIcon emoji="📦" color={color} />,
        }}
      />
      <Tabs.Screen
        name="activo"
        options={{
          title: 'En curso',
          tabBarIcon: ({ color }) => <TabIcon emoji="🛵" color={color} />,
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => <TabIcon emoji="📋" color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} />,
        }}
      />
    </Tabs>
  );
}
