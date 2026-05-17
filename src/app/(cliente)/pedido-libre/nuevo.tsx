import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCrearPedidoLibre } from '@/features/cliente/hooks/useCrearPedidoLibre';
import {
  PedidoLibreFormValues,
  pedidoLibreSchema,
} from '@/features/cliente/schemas/pedido-libre.schema';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { formatARS } from '@/shared/lib/formatters';
import { calcularCostoEnvio } from '@/shared/lib/costo-envio';

function Campo({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-1">
      <Text className="text-xs font-medium text-muted-foreground dark:text-muted-dark-foreground">
        {label}
      </Text>
      {children}
      {error && <Text className="text-xs text-destructive">{error}</Text>}
    </View>
  );
}

export default function PedidoLibreNuevoScreen() {
  const router = useRouter();
  const { mutate: crear, isPending } = useCrearPedidoLibre();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PedidoLibreFormValues>({
    resolver: zodResolver(pedidoLibreSchema) as any,
    defaultValues: {
      localNombre: '',
      localDireccion: '',
      clienteDireccion: '',
      productoDescripcion: '',
      instruccionSinStock: '',
    },
  });

  const precioEstimadoRaw = useWatch({ control, name: 'precioEstimado' });
  const precioEstimado = Number(precioEstimadoRaw) || 0;
  const costoEnvio = precioEstimado > 0 ? calcularCostoEnvio(precioEstimado) : null;

  const inputClass =
    'border border-input dark:border-input-dark bg-background dark:bg-background-dark rounded-lg px-3 py-2.5 text-sm text-foreground dark:text-foreground-dark';

  const onSubmit = handleSubmit((values) => {
    crear(
      {
        localNombre: values.localNombre,
        localDireccion: values.localDireccion,
        clienteDireccion: values.clienteDireccion,
        productoDescripcion: values.productoDescripcion,
        precioEstimado: values.precioEstimado,
        instruccionSinStock: values.instruccionSinStock || undefined,
      },
      {
        onSuccess: (pedido) => {
          router.replace(`/(cliente)/pedido/${pedido.id}` as any);
        },
      }
    );
  });

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <View className="flex-row items-center gap-3 px-4 pt-4 pb-2">
        <Pressable onPress={() => router.back()} className="p-2">
          <Text className="text-primary text-lg">←</Text>
        </Pressable>
        <Text className="flex-1 text-xl font-bold text-foreground dark:text-foreground-dark">
          Pedido libre
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground">
          Decinos qué necesitás y de dónde, y un repartidor lo irá a buscar por vos.
        </Text>

        {/* Local */}
        <Card className="gap-3">
          <Text className="text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wide">
            Local
          </Text>
          <Campo label="Nombre del local" error={errors.localNombre?.message}>
            <Controller
              control={control}
              name="localNombre"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ej: La Boulangerie"
                  placeholderTextColor="#6A6052"
                  className={inputClass}
                />
              )}
            />
          </Campo>
          <Campo label="Dirección del local" error={errors.localDireccion?.message}>
            <Controller
              control={control}
              name="localDireccion"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ej: Av. Santa Fe 2345"
                  placeholderTextColor="#6A6052"
                  className={inputClass}
                />
              )}
            />
          </Campo>
        </Card>

        {/* Producto */}
        <Card className="gap-3">
          <Text className="text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wide">
            Qué necesitás
          </Text>
          <Campo label="Descripción del producto" error={errors.productoDescripcion?.message}>
            <Controller
              control={control}
              name="productoDescripcion"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ej: 1 medialunas de manteca y 2 facturas"
                  placeholderTextColor="#6A6052"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className={`${inputClass} min-h-[72px]`}
                />
              )}
            />
          </Campo>
          <Campo label="Si no hay stock (opcional)" error={errors.instruccionSinStock?.message}>
            <Controller
              control={control}
              name="instruccionSinStock"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ej: Cancelar el pedido / buscar similar"
                  placeholderTextColor="#6A6052"
                  className={inputClass}
                />
              )}
            />
          </Campo>
          <Campo label="Precio estimado (opcional)" error={errors.precioEstimado?.message}>
            <Controller
              control={control}
              name="precioEstimado"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  value={value?.toString() ?? ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ej: 5000"
                  placeholderTextColor="#6A6052"
                  keyboardType="numeric"
                  className={inputClass}
                />
              )}
            />
          </Campo>
        </Card>

        {/* Entrega */}
        <Card className="gap-3">
          <Text className="text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wide">
            Entrega
          </Text>
          <Campo label="Tu dirección de entrega" error={errors.clienteDireccion?.message}>
            <Controller
              control={control}
              name="clienteDireccion"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ej: Av. Corrientes 1234, piso 3"
                  placeholderTextColor="#6A6052"
                  className={inputClass}
                />
              )}
            />
          </Campo>
        </Card>

        {/* Costo estimado */}
        {costoEnvio !== null && (
          <View className="bg-warning-light dark:bg-warning-dark-light rounded-xl px-4 py-3 flex-row justify-between">
            <Text className="text-sm text-warning-foreground dark:text-warning-dark-foreground">
              Costo de envío estimado
            </Text>
            <Text className="text-sm font-bold text-warning-foreground dark:text-warning-dark-foreground">
              {formatARS(costoEnvio)}
            </Text>
          </View>
        )}

        <Button onPress={onSubmit} loading={isPending}>
          Solicitar pedido
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
