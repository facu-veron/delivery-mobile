import Ionicons from '@expo/vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { View, useColorScheme } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, color, focused }: { name: IconName; color: string; focused: boolean }) {
  return (
    <View style={[
      { width: 52, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
      focused && { backgroundColor: 'rgba(238, 194, 52, 0.15)' },
    ]}>
      <Ionicons name={name} size={24} color={color} />
    </View>
  );
}

import { useActualizarPushToken } from '@/features/repartidor/hooks/useActualizarPushToken';
import { queryClient } from '@/shared/api/query-client';

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
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="disponibles"
        options={{
          title: 'Disponibles',
          tabBarIcon: ({ color, focused }) => <TabIcon name="fast-food-outline" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="activo"
        options={{
          title: 'En curso',
          tabBarIcon: ({ color, focused }) => <TabIcon name="bicycle-outline" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color, focused }) => <TabIcon name="time-outline" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => <TabIcon name="person-outline" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
