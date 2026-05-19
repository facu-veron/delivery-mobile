import { Image } from 'expo-image';
import { Text, View } from 'react-native';

interface AvatarProps {
  nombre: string;
  avatarUrl?: string;
  size?: number;
}

export function Avatar({ nombre, avatarUrl, size = 40 }: AvatarProps) {
  const inicial = nombre.trim().charAt(0).toUpperCase();

  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#EEC234',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: size * 0.4, fontWeight: '700', color: '#251E14' }}>
        {inicial}
      </Text>
    </View>
  );
}
