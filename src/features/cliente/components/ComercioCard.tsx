import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { Comercio } from '@/shared/types/comercio.types';

interface Props {
  comercio: Comercio;
  onPress: () => void;
}

export function ComercioCard({ comercio, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-card dark:bg-card-dark rounded-xl overflow-hidden border border-border dark:border-border-dark active:opacity-75"
    >
      {comercio.imagen ? (
        <Image
          source={{ uri: comercio.imagen }}
          style={{ width: '100%', height: 128 }}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View className="w-full h-32 bg-muted dark:bg-muted-dark items-center justify-center">
          <Text className="text-3xl">🏪</Text>
        </View>
      )}
      <View className="p-3">
        <Text className="text-sm font-semibold text-foreground dark:text-card-dark-foreground">
          {comercio.nombre}
        </Text>
        {comercio.descripcion && (
          <Text
            numberOfLines={1}
            className="text-xs text-muted-foreground dark:text-muted-dark-foreground mt-0.5"
          >
            {comercio.descripcion}
          </Text>
        )}
        <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground mt-1">
          📍 {comercio.direccion}
        </Text>
      </View>
    </Pressable>
  );
}
