import { Switch, Text, View } from 'react-native';

import { EstadoAprobacion } from '@/shared/types/pedido.types';
import { useCambiarDisponibilidad } from '../hooks/useCambiarDisponibilidad';
import { useDisponibilidadStore } from '../store/disponibilidad.store';

interface Props {
  aprobacion: EstadoAprobacion;
}

export function DisponibilidadSwitch({ aprobacion }: Props) {
  const disponible = useDisponibilidadStore((s) => s.disponible);
  const { mutate, isPending } = useCambiarDisponibilidad();

  const noAprobado = aprobacion !== EstadoAprobacion.APROBADO;
  const disabled = noAprobado || isPending;

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-card dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark">
      <View className="flex-1 mr-3">
        <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
          {disponible ? '🟢 Disponible' : '⚫ No disponible'}
        </Text>
        {noAprobado && (
          <Text className="text-xs text-warning dark:text-warning-dark mt-0.5">
            Tu cuenta está pendiente de aprobación
          </Text>
        )}
      </View>
      <Switch
        value={disponible}
        onValueChange={(v) => mutate(v)}
        disabled={disabled}
        trackColor={{ false: '#E6E1D8', true: '#EEC234' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}
