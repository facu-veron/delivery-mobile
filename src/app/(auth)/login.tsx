import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Bike } from 'lucide-react-native';
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

import { useLogin } from '@/features/auth/hooks/useLogin';
import { loginSchema, type LoginInput } from '@/features/auth/schemas/login.schema';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, isError, error } = useLogin();

  const errorMessage = (() => {
    if (!isError) return null;
    const status = (error as any)?.response?.status;
    if (status === 401) return 'Credenciales incorrectas. Revisá tu email y contraseña.';
    return 'No pudimos iniciar sesión. Probá de nuevo en unos segundos.';
  })();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          {/* Marca */}
          <View className="items-center mb-10 mt-8">
            <View className="w-16 h-16 rounded-2xl bg-primary items-center justify-center mb-4 shadow-sm shadow-foreground/10">
              <Bike size={32} color="#251E14" strokeWidth={2.25} />
            </View>
            <Text className="text-3xl font-bold text-foreground dark:text-foreground-dark tracking-tight">
              DeliverYa
            </Text>
            <Text className="text-muted-foreground dark:text-muted-dark-foreground mt-1 text-base">
              Ingresá a tu cuenta
            </Text>
          </View>

          {/* Formulario */}
          <View className="gap-4">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.email?.message}
                />
              )}
            />

            <View className="gap-1.5">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Contraseña"
                    placeholder="••••••••"
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.password?.message}
                  />
                )}
              />
              <Pressable onPress={() => setShowPassword(v => !v)} className="self-end">
                <Text className="text-sm text-primary font-medium">
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </Pressable>
            </View>

            {errorMessage && (
              <View className="bg-destructive-light dark:bg-destructive-dark-light rounded-lg px-4 py-3">
                <Text className="text-destructive dark:text-destructive-dark text-sm text-center">
                  {errorMessage}
                </Text>
              </View>
            )}

            <Button onPress={handleSubmit(data => login(data))} loading={isPending} className="mt-2">
              Iniciar sesión
            </Button>

            <Pressable
              onPress={() => router.push('/(auth)/registro')}
              className="items-center py-3"
            >
              <Text className="text-muted-foreground dark:text-muted-dark-foreground text-sm">
                ¿No tenés cuenta?{' '}
                <Text className="text-primary font-semibold">Registrate</Text>
              </Text>
            </Pressable>
          </View>

          <View className="h-8" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
