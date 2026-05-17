import { Tabs } from 'expo-router';
import { Text, useColorScheme } from 'react-native';

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  return <Text style={{ fontSize: 20, color }}>{emoji}</Text>;
}

export default function ClienteTabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <TabIcon emoji="🏪" color={color} />,
        }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          title: 'Mis pedidos',
          tabBarIcon: ({ color }) => <TabIcon emoji="📦" color={color} />,
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => <TabIcon emoji="📋" color={color} />,
        }}
      />
    </Tabs>
  );
}
