import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useActualizarMe } from '@/features/auth/hooks/useActualizarMe';
import { useSubirAvatar } from '@/features/auth/hooks/useSubirAvatar';
import {
  EditarPerfilInput,
  editarPerfilSchema,
} from '@/features/auth/schemas/editar-perfil.schema';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useActualizarPerfilRepartidor } from '@/features/repartidor/hooks/useActualizarPerfil';
import { usePerfil } from '@/features/repartidor/hooks/usePerfil';
import { Avatar } from '@/shared/components/Avatar';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { Input } from '@/shared/components/Input';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { RolUsuario } from '@/shared/types/pedido.types';

export function EditarPerfilScreen() {
  const router = useRouter();
  const { rol, nombre, telefono, avatarUrl } = useAuthStore();
  const { data: perfilRepartidor } = usePerfil();

  const esRepartidor = rol === RolUsuario.REPARTIDOR;

  const { mutate: actualizarMe, isPending: actualizandoMe } = useActualizarMe();
  const { mutate: actualizarRepartidor, isPending: actualizandoRepartidor } =
    useActualizarPerfilRepartidor();
  const { mutate: subirAvatar, isPending: subiendoAvatar } = useSubirAvatar();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<EditarPerfilInput>({
    resolver: zodResolver(editarPerfilSchema),
    defaultValues: {
      nombre,
      telefono,
      vehiculo: esRepartidor ? perfilRepartidor?.vehiculo ?? '' : undefined,
    },
  });

  const guardando = actualizandoMe || actualizandoRepartidor;

  const onSubmit = handleSubmit((values) => {
    actualizarMe(
      { nombre: values.nombre, telefono: values.telefono },
      {
        onSuccess: () => {
          if (esRepartidor && values.vehiculo) {
            actualizarRepartidor(
              { vehiculo: values.vehiculo },
              { onSuccess: () => router.back() },
            );
          } else {
            router.back();
          }
        },
      },
    );
  });

  const handleCambiarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para cambiar la foto.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    const formData = new FormData();
    formData.append('avatar', {
      uri: asset.uri,
      name: asset.fileName ?? 'avatar.jpg',
      type: asset.mimeType ?? 'image/jpeg',
    } as any);
    subirAvatar(formData);
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScreenHeader title="Editar perfil" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar editable */}
          <Card className="items-center gap-3 py-6">
            <Pressable
              onPress={handleCambiarFoto}
              disabled={subiendoAvatar}
              className="relative active:opacity-80"
            >
              <Avatar nombre={nombre} avatarUrl={avatarUrl ?? undefined} size={96} />
              <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary border-2 border-card dark:border-card-dark items-center justify-center">
                <Camera size={14} color="#251E14" strokeWidth={2.25} />
              </View>
            </Pressable>
            <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">
              {subiendoAvatar ? 'Subiendo foto…' : 'Tocá para cambiar la foto'}
            </Text>
          </Card>

          {/* Form */}
          <View className="gap-3">
            <Controller
              control={control}
              name="nombre"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="Nombre completo"
                  placeholder="Juan Pérez"
                  autoCapitalize="words"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.nombre?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="telefono"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="Teléfono"
                  placeholder="3704 123456"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.telefono?.message}
                />
              )}
            />
            {esRepartidor && (
              <Controller
                control={control}
                name="vehiculo"
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input
                    label="Vehículo"
                    placeholder="Ej: Moto, Bicicleta, Auto"
                    autoCapitalize="sentences"
                    value={value ?? ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.vehiculo?.message}
                  />
                )}
              />
            )}
          </View>

          <Button
            onPress={onSubmit}
            loading={guardando}
            disabled={!isDirty}
            className="mt-2"
          >
            Guardar cambios
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
