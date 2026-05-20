import { Tabs } from 'expo-router';
import { ClipboardList, History, Home, User, type LucideIcon } from 'lucide-react-native';
import { View, useColorScheme } from 'react-native';

function TabIcon({
  Icon,
  color,
  focused,
}: {
  Icon: LucideIcon;
  color: string;
  focused: boolean;
}) {
  return (
    <View
      style={[
        { width: 52, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
        focused && { backgroundColor: 'rgba(238, 194, 52, 0.18)' },
      ]}
    >
      <Icon size={20} color={color} strokeWidth={focused ? 2.4 : 2} />
    </View>
  );
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
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={Home} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={ClipboardList} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={History} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={User} color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
