import { useRouter } from 'expo-router';
import { AlertTriangle, ChevronRight } from 'lucide-react-native';
import { Pressable, Switch, Text, View } from 'react-native';

import { EstadoAprobacion } from '@/shared/types/pedido.types';
import { useCambiarDisponibilidad } from '../hooks/useCambiarDisponibilidad';
import { useDisponibilidadStore } from '../store/disponibilidad.store';

interface Props {
  aprobacion: EstadoAprobacion;
  motivoRechazo?: string;
}

export function DisponibilidadSwitch({ aprobacion, motivoRechazo }: Props) {
  const router = useRouter();
  const disponible = useDisponibilidadStore((s) => s.disponible);
  const { mutate, isPending } = useCambiarDisponibilidad();

  const noAprobado = aprobacion !== EstadoAprobacion.APROBADO;
  const rechazado = aprobacion === EstadoAprobacion.RECHAZADO;

  // Si no está aprobado, toda la card lleva a documentos
  if (noAprobado) {
    return (
      <Pressable
        onPress={() => router.push('/(repartidor)/documentos' as any)}
        className="flex-row items-center gap-3 px-4 py-3.5 bg-warning-light dark:bg-warning-dark-light rounded-2xl border border-warning/30 active:opacity-80"
      >
        <View className="w-10 h-10 rounded-xl bg-warning/15 items-center justify-center">
          <AlertTriangle size={20} color="#DFB030" strokeWidth={2} />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-bold text-warning dark:text-warning-dark">
            {rechazado ? 'Cuenta rechazada' : 'Cuenta pendiente de aprobación'}
          </Text>
          <Text className="text-xs text-warning dark:text-warning-dark/90 mt-0.5 leading-5">
            {rechazado
              ? motivoRechazo ?? 'Subí tus documentos nuevamente para revisión.'
              : 'Completá la carga de documentos para empezar a recibir pedidos.'}
          </Text>
        </View>
        <ChevronRight size={18} color="#DFB030" strokeWidth={2.25} />
      </Pressable>
    );
  }

  return (
    <View className="flex-row items-center justify-between px-4 py-3.5 bg-card dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark shadow-sm shadow-foreground/5">
      <View className="flex-row items-center gap-3 flex-1 mr-3">
        <View
          className={`w-2.5 h-2.5 rounded-full ${
            disponible ? 'bg-success' : 'bg-muted-foreground dark:bg-muted-dark-foreground'
          }`}
        />
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
            {disponible ? 'Disponible' : 'No disponible'}
          </Text>
          <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground mt-0.5">
            {disponible ? 'Vas a recibir pedidos nuevos' : 'No vas a recibir pedidos'}
          </Text>
        </View>
      </View>
      <Switch
        value={disponible}
        onValueChange={(v) => mutate(v)}
        disabled={isPending}
        trackColor={{ false: '#E6E1D8', true: '#EEC234' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}
