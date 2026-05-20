import { Image } from 'expo-image';
import { Heart, MapPin, Store } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Comercio } from '@/shared/types/comercio.types';

interface Props {
  comercio: Comercio;
  onPress: () => void;
  isFavorito?: boolean;
  onToggleFavorito?: () => void;
}

export function ComercioCard({ comercio, onPress, isFavorito, onToggleFavorito }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-card dark:bg-card-dark rounded-xl overflow-hidden border border-border dark:border-border-dark active:opacity-80 shadow-sm shadow-foreground/5"
    >
      <View className="relative">
        {comercio.imagen ? (
          <Image
            source={{ uri: comercio.imagen }}
            style={{ width: '100%', height: 132 }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View className="w-full h-32 bg-muted dark:bg-muted-dark items-center justify-center">
            <Store size={32} color="#6A6052" strokeWidth={1.75} />
          </View>
        )}
        {onToggleFavorito && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorito();
            }}
            hitSlop={8}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 items-center justify-center active:opacity-70"
          >
            <Heart
              size={16}
              color="#FEFEFE"
              strokeWidth={2}
              fill={isFavorito ? '#FEFEFE' : 'transparent'}
            />
          </Pressable>
        )}
      </View>
      <View className="p-3 gap-1">
        <Text className="text-base font-semibold text-foreground dark:text-card-dark-foreground">
          {comercio.nombre}
        </Text>
        {comercio.descripcion && (
          <Text
            numberOfLines={1}
            className="text-xs text-muted-foreground dark:text-muted-dark-foreground"
          >
            {comercio.descripcion}
          </Text>
        )}
        <View className="flex-row items-center gap-1.5 mt-0.5">
          <MapPin size={12} color="#6A6052" strokeWidth={2} />
          <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground flex-1" numberOfLines={1}>
            {comercio.direccion}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
