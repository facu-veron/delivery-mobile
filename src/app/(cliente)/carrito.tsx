import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { ShoppingBag } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { useCrearPedidoCatalogo } from '@/features/cliente/hooks/useCrearPedidoCatalogo';
import { useCarritoStore } from '@/features/cliente/store/carrito.store';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { EmptyState } from '@/shared/components/EmptyState';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { calcularCostoEnvio } from '@/shared/lib/costo-envio';
import { formatARS } from '@/shared/lib/formatters';

const schema = z.object({
  clienteDireccion: z.string().min(5, 'Ingresá tu dirección de entrega'),
});
type FormValues = z.infer<typeof schema>;

export default function CarritoScreen() {
  const router = useRouter();
  const { items, total, limpiar, comercioId, cambiarCantidad } = useCarritoStore();
  const { mutate: crearPedido, isPending } = useCrearPedidoCatalogo();

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const subtotal = total();
  const costoEnvio = calcularCostoEnvio(subtotal);
  const montoTotal = subtotal + costoEnvio;

  if (items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
        <ScreenHeader title="Tu pedido" />
        <EmptyState
          icon={ShoppingBag}
          title="Tu carrito está vacío"
          description="Sumá productos desde alguno de los comercios para hacer un pedido."
          action={
            <Button variant="outline" onPress={() => router.back()}>
              Volver
            </Button>
          }
        />
      </SafeAreaView>
    );
  }

  const onConfirmar = handleSubmit(({ clienteDireccion }) => {
    if (!comercioId) return;
    crearPedido(
      {
        comercioId,
        clienteDireccion,
        items: items.map((i) => ({ productoId: i.producto.id, cantidad: i.cantidad })),
      },
      {
        onSuccess: (pedido) => {
          limpiar();
          router.replace(`/(cliente)/pedido/${pedido.id}` as any);
        },
      }
    );
  });

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScreenHeader title="Tu pedido" />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {/* Items */}
        <Card>
          <Text className="text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wider mb-2">
            Items
          </Text>
          {items.map((item) => (
            <View
              key={item.producto.id}
              className="flex-row items-center py-2.5 border-b border-border dark:border-border-dark last:border-0"
            >
              <Text className="flex-1 text-sm text-foreground dark:text-foreground-dark" numberOfLines={2}>
                {item.producto.nombre}
              </Text>
              <View className="flex-row items-center gap-2 mr-3">
                <Pressable
                  onPress={() => cambiarCantidad(item.producto.id, item.cantidad - 1)}
                  className="w-7 h-7 items-center justify-center bg-secondary dark:bg-secondary-dark rounded-lg active:opacity-75"
                >
                  <Text className="text-base font-bold text-foreground dark:text-foreground-dark">−</Text>
                </Pressable>
                <Text className="text-sm font-bold text-foreground dark:text-foreground-dark w-4 text-center">
                  {item.cantidad}
                </Text>
                <Pressable
                  onPress={() => cambiarCantidad(item.producto.id, item.cantidad + 1)}
                  className="w-7 h-7 items-center justify-center bg-primary rounded-lg active:opacity-75"
                >
                  <Text className="text-base font-bold text-primary-foreground">+</Text>
                </Pressable>
              </View>
              <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark w-20 text-right">
                {formatARS(item.producto.precio * item.cantidad)}
              </Text>
            </View>
          ))}
        </Card>

        {/* Dirección */}
        <Card>
          <Text className="text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wider mb-2">
            Dirección de entrega
          </Text>
          <Controller
            control={control}
            name="clienteDireccion"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Ej: Av. Corrientes 1234, piso 3"
                placeholderTextColor="#9E9891"
                className="border border-border dark:border-border-dark bg-background dark:bg-background-dark rounded-lg px-3 py-2.5 text-sm text-foreground dark:text-foreground-dark"
              />
            )}
          />
          {errors.clienteDireccion && (
            <Text className="text-xs text-destructive mt-1">
              {errors.clienteDireccion.message}
            </Text>
          )}
        </Card>

        {/* Resumen */}
        <Card>
          <Text className="text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wider mb-2">
            Resumen
          </Text>
          <View className="flex-row justify-between py-1.5">
            <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground">Subtotal</Text>
            <Text className="text-sm text-foreground dark:text-foreground-dark">{formatARS(subtotal)}</Text>
          </View>
          <View className="flex-row justify-between py-1.5 border-b border-border dark:border-border-dark">
            <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground">Costo de envío</Text>
            <Text className="text-sm text-foreground dark:text-foreground-dark">{formatARS(costoEnvio)}</Text>
          </View>
          <View className="flex-row justify-between py-2 mt-1">
            <Text className="text-base font-bold text-foreground dark:text-foreground-dark">Total</Text>
            <Text className="text-base font-bold text-primary">{formatARS(montoTotal)}</Text>
          </View>
        </Card>

        <Button onPress={onConfirmar} loading={isPending}>
          Confirmar pedido
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
