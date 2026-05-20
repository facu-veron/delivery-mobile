import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp, CircleHelp, MessageSquare, Send } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { Card } from '@/shared/components/Card';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { Button } from '@/shared/components/Button';
import { useEnviarContacto, useFaqs } from '@/shared/hooks/useAyuda';
import type { Faq } from '@/shared/api/ayuda.api';

const CATEGORIA_LABEL: Record<string, string> = {
  PAGOS: 'Pagos',
  PEDIDOS: 'Pedidos',
  CUENTA: 'Cuenta',
  OTROS: 'Otros',
};

const contactoSchema = z.object({
  asunto: z.string().min(3, 'Asunto requerido').max(200),
  mensaje: z.string().min(10, 'Contanos un poco más').max(2000),
});
type ContactoValues = z.infer<typeof contactoSchema>;

const inputClass =
  'border border-border dark:border-border-dark bg-background dark:bg-background-dark rounded-lg px-3 py-2.5 text-sm text-foreground dark:text-foreground-dark';

function FaqItem({ faq }: { faq: Faq }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable
      onPress={() => setOpen((v) => !v)}
      className="py-3 border-b border-border dark:border-border-dark last:border-0 active:opacity-70"
    >
      <View className="flex-row items-start justify-between gap-3">
        <Text className="flex-1 text-sm font-medium text-foreground dark:text-foreground-dark leading-5">
          {faq.pregunta}
        </Text>
        {open ? (
          <ChevronUp size={16} color="#6A6052" strokeWidth={2} />
        ) : (
          <ChevronDown size={16} color="#6A6052" strokeWidth={2} />
        )}
      </View>
      {open && (
        <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground leading-5 mt-2">
          {faq.respuesta}
        </Text>
      )}
    </Pressable>
  );
}

function ContactoForm() {
  const { mutate: enviar, isPending } = useEnviarContacto();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactoValues>({
    resolver: zodResolver(contactoSchema),
    defaultValues: { asunto: '', mensaje: '' },
  });

  const onSubmit = handleSubmit((values) => {
    enviar(values, {
      onSuccess: (res) => {
        Alert.alert('Mensaje enviado', res.mensaje);
        reset();
      },
      onError: () => {
        Alert.alert('Error', 'No se pudo enviar el mensaje. Intentá de nuevo.');
      },
    });
  });

  return (
    <Card className="gap-3">
      <View className="flex-row items-center gap-2">
        <MessageSquare size={16} color="#6A6052" strokeWidth={2} />
        <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark">
          Contactar soporte
        </Text>
      </View>

      <View className="gap-1.5">
        <Text className="text-xs font-medium text-muted-foreground dark:text-muted-dark-foreground">
          Asunto
        </Text>
        <Controller
          control={control}
          name="asunto"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Ej: Problema con mi pedido"
              placeholderTextColor="#9E9891"
              className={inputClass}
            />
          )}
        />
        {errors.asunto && (
          <Text className="text-xs text-destructive">{errors.asunto.message}</Text>
        )}
      </View>

      <View className="gap-1.5">
        <Text className="text-xs font-medium text-muted-foreground dark:text-muted-dark-foreground">
          Mensaje
        </Text>
        <Controller
          control={control}
          name="mensaje"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Contanos qué pasó..."
              placeholderTextColor="#9E9891"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className={`${inputClass} min-h-[96px]`}
            />
          )}
        />
        {errors.mensaje && (
          <Text className="text-xs text-destructive">{errors.mensaje.message}</Text>
        )}
      </View>

      <Button
        onPress={onSubmit}
        loading={isPending}
        leftIcon={<Send size={16} color="#251E14" strokeWidth={2} />}
      >
        Enviar mensaje
      </Button>
    </Card>
  );
}

export function AyudaScreen() {
  const { data: faqs, isLoading } = useFaqs();

  const byCategoria = faqs
    ? faqs.reduce<Record<string, Faq[]>>((acc, faq) => {
        const cat = faq.categoria;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(faq);
        return acc;
      }, {})
    : {};

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScreenHeader title="Ayuda" />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* FAQ por categoría */}
          {Object.keys(byCategoria).length === 0 ? (
            <EmptyState
              icon={CircleHelp}
              title="Sin preguntas frecuentes"
              description="Podés escribirnos directamente."
            />
          ) : (
            Object.entries(byCategoria).map(([cat, items]) => (
              <View key={cat}>
                <Text className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground dark:text-muted-dark-foreground mb-2 px-1">
                  {CATEGORIA_LABEL[cat] ?? cat}
                </Text>
                <Card className="gap-0">
                  {items.map((faq) => (
                    <FaqItem key={faq.id} faq={faq} />
                  ))}
                </Card>
              </View>
            ))
          )}

          {/* Formulario de contacto */}
          <ContactoForm />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
