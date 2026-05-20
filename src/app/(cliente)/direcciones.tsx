import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Plus, Star, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import {
  useCrearDireccion,
  useDirecciones,
  useEliminarDireccion,
} from '@/features/cliente/hooks/useDirecciones';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { DireccionCliente } from '@/shared/types/pedido.types';

const schema = z.object({
  alias: z.string().min(1, 'Nombre requerido'),
  calle: z.string().min(2, 'Calle requerida'),
  numero: z.string().min(1, 'Número requerido'),
  barrio: z.string().optional(),
  referencia: z.string().optional(),
  esPrincipal: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

const inputClass =
  'border border-border dark:border-border-dark bg-background dark:bg-background-dark rounded-lg px-3 py-2.5 text-sm text-foreground dark:text-foreground-dark';

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
    <View className="gap-1.5">
      <Text className="text-xs font-medium text-muted-foreground dark:text-muted-dark-foreground">
        {label}
      </Text>
      {children}
      {error && <Text className="text-xs text-destructive">{error}</Text>}
    </View>
  );
}

function DireccionItem({
  direccion,
  onDelete,
}: {
  direccion: DireccionCliente;
  onDelete: (id: string) => void;
}) {
  return (
    <View className="flex-row items-center gap-3 py-3 border-b border-border dark:border-border-dark last:border-0">
      <View className="w-9 h-9 rounded-full bg-secondary dark:bg-secondary-dark items-center justify-center flex-shrink-0">
        <MapPin size={16} color="#6A6052" strokeWidth={2} />
      </View>
      <View className="flex-1 gap-0.5">
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark">
            {direccion.alias}
          </Text>
          {direccion.esPrincipal && (
            <Badge variant="warning" dot>
              Principal
            </Badge>
          )}
        </View>
        <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground" numberOfLines={1}>
          {direccion.calle} {direccion.numero}
          {direccion.barrio ? `, ${direccion.barrio}` : ''}
        </Text>
        {direccion.referencia ? (
          <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground" numberOfLines={1}>
            {direccion.referencia}
          </Text>
        ) : null}
      </View>
      <Pressable
        onPress={() =>
          Alert.alert('Eliminar dirección', `¿Eliminás "${direccion.alias}"?`, [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(direccion.id) },
          ])
        }
        hitSlop={8}
        className="p-1 active:opacity-60"
      >
        <Trash2 size={18} color="#C13D2A" strokeWidth={2} />
      </Pressable>
    </View>
  );
}

function AgregarModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { mutate: crear, isPending } = useCrearDireccion();
  const [esPrincipal, setEsPrincipal] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { alias: '', calle: '', numero: '', barrio: '', referencia: '' },
  });

  const onSubmit = handleSubmit((values) => {
    crear(
      {
        alias: values.alias,
        calle: values.calle,
        numero: values.numero,
        barrio: values.barrio || undefined,
        referencia: values.referencia || undefined,
        esPrincipal,
      },
      {
        onSuccess: () => {
          reset();
          setEsPrincipal(false);
          onClose();
        },
      }
    );
  });

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-border dark:border-border-dark">
          <Text className="text-base font-bold text-foreground dark:text-foreground-dark">
            Nueva dirección
          </Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground">
              Cancelar
            </Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
          <Campo label="Nombre (alias)" error={errors.alias?.message}>
            <Controller
              control={control}
              name="alias"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ej: Casa, Trabajo"
                  placeholderTextColor="#9E9891"
                  className={inputClass}
                />
              )}
            />
          </Campo>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Campo label="Calle" error={errors.calle?.message}>
                <Controller
                  control={control}
                  name="calle"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Av. Corrientes"
                      placeholderTextColor="#9E9891"
                      className={inputClass}
                    />
                  )}
                />
              </Campo>
            </View>
            <View className="w-24">
              <Campo label="Número" error={errors.numero?.message}>
                <Controller
                  control={control}
                  name="numero"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="1234"
                      placeholderTextColor="#9E9891"
                      keyboardType="numeric"
                      className={inputClass}
                    />
                  )}
                />
              </Campo>
            </View>
          </View>

          <Campo label="Barrio (opcional)" error={errors.barrio?.message}>
            <Controller
              control={control}
              name="barrio"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ej: Centro"
                  placeholderTextColor="#9E9891"
                  className={inputClass}
                />
              )}
            />
          </Campo>

          <Campo label="Referencia (opcional)" error={errors.referencia?.message}>
            <Controller
              control={control}
              name="referencia"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ej: Portón azul, timbre 2B"
                  placeholderTextColor="#9E9891"
                  className={inputClass}
                />
              )}
            />
          </Campo>

          <Pressable
            onPress={() => setEsPrincipal((v) => !v)}
            className="flex-row items-center gap-3 py-3 px-4 rounded-xl border border-border dark:border-border-dark active:opacity-70"
          >
            <View
              className={`w-5 h-5 rounded border-2 items-center justify-center ${
                esPrincipal
                  ? 'bg-primary border-primary'
                  : 'border-border dark:border-border-dark'
              }`}
            >
              {esPrincipal && <Star size={11} color="#251E14" strokeWidth={2.5} fill="#251E14" />}
            </View>
            <Text className="text-sm text-foreground dark:text-foreground-dark">
              Marcar como principal
            </Text>
          </Pressable>

          <Button onPress={onSubmit} loading={isPending}>
            Guardar dirección
          </Button>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default function DireccionesScreen() {
  const { data: direcciones, isLoading } = useDirecciones();
  const { mutate: eliminar } = useEliminarDireccion();
  const [showModal, setShowModal] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScreenHeader
        title="Mis direcciones"
        right={
          <Pressable
            onPress={() => setShowModal(true)}
            hitSlop={8}
            className="w-9 h-9 rounded-full bg-primary items-center justify-center active:opacity-75"
          >
            <Plus size={18} color="#251E14" strokeWidth={2.5} />
          </Pressable>
        }
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : !direcciones || direcciones.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Sin direcciones guardadas"
          description="Guardá tus direcciones frecuentes para hacer pedidos más rápido."
          action={
            <Button onPress={() => setShowModal(true)}>
              Agregar dirección
            </Button>
          }
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Card className="gap-0">
            {direcciones.map((dir) => (
              <DireccionItem
                key={dir.id}
                direccion={dir}
                onDelete={(id) => eliminar(id)}
              />
            ))}
          </Card>
        </ScrollView>
      )}

      <AgregarModal visible={showModal} onClose={() => setShowModal(false)} />
    </SafeAreaView>
  );
}
