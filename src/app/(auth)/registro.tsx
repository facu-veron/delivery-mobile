import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import SuperTokens from 'supertokens-react-native';

import { authApi } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import {
  registroClienteSchema,
  registroRepartidorSchema,
  type RegistroClienteInput,
  type RegistroRepartidorInput,
} from '@/features/auth/schemas/registro.schema';
import { usePushRegistration } from '@/features/notificaciones/hooks/usePushRegistration';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { RolUsuario } from '@/shared/types/pedido.types';

type Rol = 'CLIENTE' | 'REPARTIDOR' | null;

// ─── Selector de rol ────────────────────────────────────────────────────────
function RolCard({
  emoji,
  titulo,
  descripcion,
  onPress,
}: {
  emoji: string;
  titulo: string;
  descripcion: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="border-2 border-border dark:border-border-dark bg-card dark:bg-card-dark rounded-2xl p-5 active:border-primary active:bg-secondary dark:active:bg-secondary-dark gap-3"
    >
      <Text className="text-4xl">{emoji}</Text>
      <View>
        <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">
          {titulo}
        </Text>
        <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground mt-1">
          {descripcion}
        </Text>
      </View>
      <Text className="text-primary font-semibold text-sm">Continuar →</Text>
    </Pressable>
  );
}

// ─── Formulario de cliente ───────────────────────────────────────────────────
function FormCliente({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const { setSession } = useAuthStore();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: RegistroClienteInput) => authApi.registrarCliente(data),
    onSuccess: async () => {
      const payload = await SuperTokens.getAccessTokenPayloadSecurely();
      setSession({
        usuarioId: payload.usuarioId ?? '',
        rol: RolUsuario.CLIENTE,
        perfilId: payload.perfilId ?? '',
        nombre: payload.nombre ?? '',
      });
      router.replace('/(cliente)');
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistroClienteInput>({ resolver: zodResolver(registroClienteSchema) });

  return (
    <FormWrapper titulo="Datos de tu cuenta" onBack={onBack} isError={isError} isPending={isPending} onSubmit={handleSubmit(data => mutate(data))}>
      <CamposBase control={control} errors={errors} />
    </FormWrapper>
  );
}

// ─── Formulario de repartidor ────────────────────────────────────────────────
function FormRepartidor({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const { setSession } = useAuthStore();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: RegistroRepartidorInput) => authApi.registrarRepartidor(data),
    onSuccess: async () => {
      const payload = await SuperTokens.getAccessTokenPayloadSecurely();
      setSession({
        usuarioId: payload.usuarioId ?? '',
        rol: RolUsuario.REPARTIDOR,
        perfilId: payload.perfilId ?? '',
        nombre: payload.nombre ?? '',
      });
      router.replace('/(repartidor)');
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistroRepartidorInput>({ resolver: zodResolver(registroRepartidorSchema) });

  return (
    <FormWrapper titulo="Datos de tu cuenta" onBack={onBack} isError={isError} isPending={isPending} onSubmit={handleSubmit(data => mutate(data))}>
      <CamposBase control={control} errors={errors} />
      <Controller
        control={control}
        name="vehiculo"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Tipo de vehículo"
            placeholder="Ej: Moto, Bicicleta, Auto"
            autoCapitalize="sentences"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={(errors as any).vehiculo?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="zona"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Zona de trabajo"
            placeholder="Ej: Centro, Norte, Sur"
            autoCapitalize="sentences"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={(errors as any).zona?.message}
          />
        )}
      />
    </FormWrapper>
  );
}

// ─── Campos compartidos ──────────────────────────────────────────────────────
function CamposBase({ control, errors }: { control: any; errors: any }) {
  return (
    <>
      <Controller
        control={control}
        name="nombre"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Nombre completo" placeholder="Juan García" autoCapitalize="words" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.nombre?.message} />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Email" placeholder="tu@email.com" keyboardType="email-address" autoCapitalize="none" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.email?.message} />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Contraseña" placeholder="Mínimo 8 caracteres" secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} error={errors.password?.message} />
        )}
      />
      <Controller
        control={control}
        name="telefono"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Teléfono" placeholder="3516 000000" keyboardType="phone-pad" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.telefono?.message} />
        )}
      />
    </>
  );
}

// ─── Wrapper del formulario ──────────────────────────────────────────────────
function FormWrapper({
  titulo,
  children,
  onBack,
  isError,
  isPending,
  onSubmit,
}: {
  titulo: string;
  children: React.ReactNode;
  onBack: () => void;
  isError: boolean;
  isPending: boolean;
  onSubmit: () => void;
}) {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingVertical: 24 }}
      keyboardShouldPersistTaps="handled"
      className="px-6"
    >
      <Pressable onPress={onBack} className="flex-row items-center gap-2 mb-6">
        <Text className="text-primary text-base">←</Text>
        <Text className="text-primary font-medium">Elegir rol</Text>
      </Pressable>

      <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark mb-6">
        {titulo}
      </Text>

      <View className="gap-4">
        {children}

        {isError && (
          <View className="bg-destructive-light dark:bg-destructive-dark-light rounded-lg px-4 py-3">
            <Text className="text-destructive dark:text-destructive-dark text-sm text-center">
              Hubo un error al crear la cuenta. Intentá de nuevo.
            </Text>
          </View>
        )}

        <Button onPress={onSubmit} loading={isPending} className="mt-2">
          Crear cuenta
        </Button>
      </View>
      <View className="h-8" />
    </ScrollView>
  );
}

// ─── Pantalla principal ──────────────────────────────────────────────────────
export default function RegistroScreen() {
  usePushRegistration();
  const router = useRouter();
  const [rol, setRol] = useState<Rol>(null);

  if (rol === 'CLIENTE') return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FormCliente onBack={() => setRol(null)} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  if (rol === 'REPARTIDOR') return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FormRepartidor onBack={() => setRol(null)} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-2 mt-4 mb-8">
          <Text className="text-primary text-base">←</Text>
          <Text className="text-primary font-medium">Volver al login</Text>
        </Pressable>

        <Text className="text-3xl font-bold text-foreground dark:text-foreground-dark mb-2">
          Crear cuenta
        </Text>
        <Text className="text-muted-foreground dark:text-muted-dark-foreground mb-8 text-base">
          ¿Quién sos?
        </Text>

        <View className="gap-4">
          <RolCard
            emoji="🛒"
            titulo="Soy cliente"
            descripcion="Pedí lo que necesitás de cualquier comercio de la ciudad."
            onPress={() => setRol('CLIENTE')}
          />
          <RolCard
            emoji="🛵"
            titulo="Soy repartidor"
            descripcion="Ganá dinero haciendo envíos en tu zona a tu propio ritmo."
            onPress={() => setRol('REPARTIDOR')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
