import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { z } from 'zod';

import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { formatARS } from '@/shared/lib/formatters';
import { useConfirmarPrecio } from '../hooks/useConfirmarPrecio';

const schema = z.object({
  precioReal: z.coerce.number().positive('Debe ser mayor a $0'),
});
type FormData = z.infer<typeof schema>;

interface Props {
  pedidoId: string;
  precioEstimado?: number;
}

export function ConfirmarPrecioForm({ pedidoId, precioEstimado }: Props) {
  const { mutate, isPending } = useConfirmarPrecio(pedidoId);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <View className="gap-4 p-4 bg-card dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark">
      <View>
        <Text className="text-base font-bold text-foreground dark:text-foreground-dark">
          Confirmar precio real
        </Text>
        {precioEstimado && (
          <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground mt-1">
            Estimado por el cliente: {formatARS(precioEstimado)}
          </Text>
        )}
      </View>

      <Controller
        control={control}
        name="precioReal"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Precio real del producto"
            placeholder="0"
            keyboardType="numeric"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value?.toString() ?? ''}
            error={errors.precioReal?.message}
          />
        )}
      />

      <Button onPress={handleSubmit((d) => mutate(d.precioReal))} loading={isPending}>
        Confirmar precio
      </Button>
    </View>
  );
}
