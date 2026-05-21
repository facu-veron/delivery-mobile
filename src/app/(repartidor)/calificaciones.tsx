import { MessageSquare, Star } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCalificaciones } from '@/features/repartidor/hooks/useCalificaciones';
import { Card } from '@/shared/components/Card';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { formatDateTime } from '@/shared/lib/formatters';
import { CalificacionRecibida } from '@/shared/types/pedido.types';

function Estrellas({ puntaje }: { puntaje: number }) {
  return (
    <View className="flex-row gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          color="#EEC234"
          strokeWidth={1.5}
          fill={i <= puntaje ? '#EEC234' : 'transparent'}
        />
      ))}
    </View>
  );
}

function CalificacionItem({ item }: { item: CalificacionRecibida }) {
  return (
    <View className="py-3 border-b border-border dark:border-border-dark last:border-0">
      <View className="flex-row items-start justify-between gap-2 mb-1">
        <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark flex-1">
          {item.clienteNombre}
        </Text>
        <Estrellas puntaje={item.puntaje} />
      </View>
      {item.comentario ? (
        <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground leading-5 mb-1">
          "{item.comentario}"
        </Text>
      ) : null}
      <Text className="text-[11px] text-muted-foreground dark:text-muted-dark-foreground">
        {formatDateTime(item.fecha)}
      </Text>
    </View>
  );
}

export default function CalificacionesScreen() {
  const { data, isLoading, isError } = useCalificaciones();

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <ErrorMessage message="No se pudieron cargar las calificaciones." />;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScreenHeader title="Calificaciones" />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Resumen */}
        <Card className="flex-row items-center gap-4">
          <View className="w-14 h-14 rounded-full bg-warning-light dark:bg-warning-dark-light items-center justify-center">
            <Star size={26} color="#DFB030" strokeWidth={2} fill="#DFB030" />
          </View>
          <View className="flex-1">
            <Text className="text-3xl font-bold text-foreground dark:text-foreground-dark">
              {data.promedio.toFixed(1)}
              <Text className="text-base font-normal text-muted-foreground dark:text-muted-dark-foreground">
                {' '}/ 5
              </Text>
            </Text>
            <Estrellas puntaje={Math.round(data.promedio)} />
            <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground mt-1">
              {data.total} {data.total === 1 ? 'calificación' : 'calificaciones'} recibidas
            </Text>
          </View>
        </Card>

        {/* Listado */}
        {data.ultimas.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="Sin calificaciones aún"
            description="Completá entregas para empezar a recibir calificaciones de los clientes."
          />
        ) : (
          <View>
            <Text className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground dark:text-muted-dark-foreground mb-2 px-1">
              Últimas {data.ultimas.length} calificaciones
            </Text>
            <Card className="gap-0">
              {data.ultimas.map((item) => (
                <CalificacionItem key={item.id} item={item} />
              ))}
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
