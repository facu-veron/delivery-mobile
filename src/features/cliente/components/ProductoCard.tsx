import { Pressable, Text, View } from 'react-native';

import { formatARS } from '@/shared/lib/formatters';
import { Producto } from '@/shared/types/comercio.types';

interface Props {
  producto: Producto;
  cantidad: number;
  onAgregar: () => void;
  onQuitar: () => void;
}

export function ProductoCard({ producto, cantidad, onAgregar, onQuitar }: Props) {
  return (
    <View className="flex-row items-center py-3 border-b border-border dark:border-border-dark last:border-0">
      <View className="flex-1 mr-3">
        <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
          {producto.nombre}
        </Text>
        {producto.descripcion && (
          <Text
            numberOfLines={2}
            className="text-xs text-muted-foreground dark:text-muted-dark-foreground mt-0.5"
          >
            {producto.descripcion}
          </Text>
        )}
        <Text className="text-sm font-semibold text-primary mt-1">
          {formatARS(producto.precio)}
        </Text>
      </View>

      {!producto.disponible ? (
        <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">
          Sin stock
        </Text>
      ) : cantidad === 0 ? (
        <Pressable
          onPress={onAgregar}
          className="bg-primary px-4 py-1.5 rounded-lg active:opacity-75"
        >
          <Text className="text-xs font-semibold text-primary-foreground">Agregar</Text>
        </Pressable>
      ) : (
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={onQuitar}
            className="w-8 h-8 items-center justify-center bg-secondary dark:bg-secondary-dark rounded-lg active:opacity-75"
          >
            <Text className="text-base font-bold text-foreground dark:text-foreground-dark">−</Text>
          </Pressable>
          <Text className="text-sm font-bold text-foreground dark:text-foreground-dark w-4 text-center">
            {cantidad}
          </Text>
          <Pressable
            onPress={onAgregar}
            className="w-8 h-8 items-center justify-center bg-primary rounded-lg active:opacity-75"
          >
            <Text className="text-base font-bold text-primary-foreground">+</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
