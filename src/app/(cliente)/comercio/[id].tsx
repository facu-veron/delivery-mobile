import { useLocalSearchParams, useRouter } from 'expo-router';
import { ShoppingBag } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductoCard } from '@/features/cliente/components/ProductoCard';
import { useComercio } from '@/features/cliente/hooks/useComercio';
import { useCarritoStore } from '@/features/cliente/store/carrito.store';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { formatARS } from '@/shared/lib/formatters';
import { Producto } from '@/shared/types/comercio.types';

export default function ComercioScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: comercio, isLoading, isError } = useComercio(id);
  const { items, total, agregar, cambiarCantidad, comercioId } = useCarritoStore();

  if (isLoading) return <LoadingSpinner />;
  if (isError || !comercio) return <ErrorMessage message="No se pudo cargar el comercio." />;

  const getCantidad = (productoId: string) =>
    items.find((i) => i.producto.id === productoId)?.cantidad ?? 0;

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0);
  const isFromThisComercio = comercioId === comercio.id;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScreenHeader title={comercio.nombre} subtitle={comercio.direccion} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110, gap: 16 }}>
        {comercio.categorias.map((categoria) => (
          <View key={categoria.id} className="gap-2">
            <Text className="text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wider">
              {categoria.nombre}
            </Text>
            <View className="bg-card dark:bg-card-dark rounded-xl px-4 border border-border dark:border-border-dark shadow-sm shadow-foreground/5">
              {categoria.productos.map((producto: Producto) => (
                <ProductoCard
                  key={producto.id}
                  producto={producto}
                  cantidad={getCantidad(producto.id)}
                  onAgregar={() => agregar(comercio.id, producto)}
                  onQuitar={() => cambiarCantidad(producto.id, getCantidad(producto.id) - 1)}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Floating cart bar */}
      {isFromThisComercio && totalItems > 0 && (
        <View className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-2 bg-background dark:bg-background-dark border-t border-border dark:border-border-dark">
          <Pressable
            onPress={() => router.push('/(cliente)/carrito' as any)}
            className="bg-primary rounded-2xl py-4 px-4 flex-row items-center justify-between active:opacity-90 shadow-sm shadow-foreground/10"
          >
            <View className="flex-row items-center gap-2">
              <View className="w-7 h-7 rounded-lg bg-primary-foreground/15 items-center justify-center">
                <ShoppingBag size={15} color="#251E14" strokeWidth={2.25} />
              </View>
              <View className="bg-primary-foreground/15 rounded-full px-2 py-0.5">
                <Text className="text-xs font-bold text-primary-foreground">{totalItems}</Text>
              </View>
            </View>
            <Text className="text-sm font-bold text-primary-foreground">Ver carrito</Text>
            <Text className="text-sm font-bold text-primary-foreground">
              {formatARS(total())}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
