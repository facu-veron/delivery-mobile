import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { useCambiarPassword } from '@/features/auth/hooks/useCambiarPassword';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { ScreenHeader } from '@/shared/components/ScreenHeader';

const schema = z
  .object({
    passwordActual: z.string().min(1, 'Ingresá tu contraseña actual'),
    passwordNueva: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmar: z.string().min(1, 'Confirmá la nueva contraseña'),
  })
  .refine((v) => v.passwordNueva === v.confirmar, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmar'],
  });

type FormValues = z.infer<typeof schema>;

function CampoPassword({
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <View className="gap-1.5">
      <Text className="text-xs font-medium text-muted-foreground dark:text-muted-dark-foreground">
        {label}
      </Text>
      <View className="flex-row items-center border border-border dark:border-border-dark bg-background dark:bg-background-dark rounded-lg overflow-hidden">
        <TextInput
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor="#9E9891"
          secureTextEntry={!visible}
          className="flex-1 px-3 py-2.5 text-sm text-foreground dark:text-foreground-dark"
        />
        <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8} className="px-3 active:opacity-60">
          {visible ? (
            <EyeOff size={18} color="#6A6052" strokeWidth={2} />
          ) : (
            <Eye size={18} color="#6A6052" strokeWidth={2} />
          )}
        </Pressable>
      </View>
      {error && <Text className="text-xs text-destructive">{error}</Text>}
    </View>
  );
}

export function CambiarPasswordScreen() {
  const { mutate: cambiar, isPending } = useCambiarPassword();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { passwordActual: '', passwordNueva: '', confirmar: '' },
  });

  const onSubmit = handleSubmit((values) => {
    cambiar(
      { passwordActual: values.passwordActual, passwordNueva: values.passwordNueva },
      {
        onSuccess: () => {
          Alert.alert('Contraseña actualizada', 'Tu contraseña fue cambiada correctamente.');
          reset();
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.error === 'La contraseña actual es incorrecta'
              ? 'La contraseña actual es incorrecta.'
              : 'No se pudo cambiar la contraseña. Intentá de nuevo.';
          Alert.alert('Error', msg);
        },
      }
    );
  });

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScreenHeader title="Cambiar contraseña" />

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center gap-3 bg-muted dark:bg-muted-dark rounded-xl px-4 py-3">
          <Lock size={16} color="#6A6052" strokeWidth={2} />
          <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground flex-1 leading-4">
            Usá una contraseña de al menos 8 caracteres. Tu sesión seguirá activa después del cambio.
          </Text>
        </View>

        <Card className="gap-4">
          <Controller
            control={control}
            name="passwordActual"
            render={({ field: { value, onChange, onBlur } }) => (
              <CampoPassword
                label="Contraseña actual"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.passwordActual?.message}
                placeholder="Tu contraseña actual"
              />
            )}
          />

          <Controller
            control={control}
            name="passwordNueva"
            render={({ field: { value, onChange, onBlur } }) => (
              <CampoPassword
                label="Nueva contraseña"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.passwordNueva?.message}
                placeholder="Mínimo 8 caracteres"
              />
            )}
          />

          <Controller
            control={control}
            name="confirmar"
            render={({ field: { value, onChange, onBlur } }) => (
              <CampoPassword
                label="Confirmar nueva contraseña"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.confirmar?.message}
                placeholder="Repetí la nueva contraseña"
              />
            )}
          />
        </Card>

        <Button onPress={onSubmit} loading={isPending}>
          Guardar nueva contraseña
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
