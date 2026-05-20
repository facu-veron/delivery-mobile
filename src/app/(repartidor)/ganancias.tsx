import { Calendar, Package, Star, TrendingUp } from 'lucide-react-native';
import { type LucideIcon } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useEstadisticas, useGanancias } from '@/features/repartidor/hooks/useEstadisticas';
import { Card } from '@/shared/components/Card';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { formatARS, formatDateTime } from '@/shared/lib/formatters';

function MetricaCard({
  icon: Icon,
  label,
  entregas,
  ganancias,
  highlighted = false,
}: {
  icon: LucideIcon;
  label: string;
  entregas: number;
  ganancias: number;
  highlighted?: boolean;
}) {
  return (
    <View
      className={`flex-1 rounded-2xl border p-4 gap-2 ${
        highlighted
          ? 'bg-primary/10 border-primary/30'
          : 'bg-card dark:bg-card-dark border-border dark:border-border-dark'
      }`}
    >
      <View className="flex-row items-center gap-1.5">
        <Icon
          size={14}
          color={highlighted ? '#EEC234' : '#6A6052'}
          strokeWidth={2}
        />
        <Text className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground dark:text-muted-dark-foreground">
          {label}
        </Text>
      </View>
      <Text className="text-xl font-bold text-foreground dark:text-foreground-dark">
        {formatARS(ganancias)}
      </Text>
      <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">
        {entregas} {entregas === 1 ? 'entrega' : 'entregas'}
      </Text>
    </View>
  );
}

export default function GananciasScreen() {
  const { data: stats, isLoading, isError } = useEstadisticas();
  const { data: ganancias, isLoading: loadingGanancias } = useGanancias();

  if (isLoading) return <LoadingSpinner />;
  if (isError || !stats) return <ErrorMessage message="No se pudieron cargar las estadísticas." />;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScreenHeader title="Ganancias" />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Hoy — destacado */}
        <View className="flex-row gap-3">
          <MetricaCard
            icon={TrendingUp}
            label="Hoy"
            entregas={stats.hoy.entregas}
            ganancias={stats.hoy.ganancias}
            highlighted
          />
        </View>

        {/* Semana + Mes */}
        <View className="flex-row gap-3">
          <MetricaCard
            icon={Calendar}
            label="Semana"
            entregas={stats.semana.entregas}
            ganancias={stats.semana.ganancias}
          />
          <MetricaCard
            icon={Calendar}
            label="Mes"
            entregas={stats.mes.entregas}
            ganancias={stats.mes.ganancias}
          />
        </View>

        {/* Rating */}
        <Card className="flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-full bg-warning-light dark:bg-warning-dark-light items-center justify-center">
            <Star size={22} color="#DFB030" strokeWidth={2} fill="#DFB030" />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">
              Tu calificación
            </Text>
            <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">
              {stats.rating.promedio.toFixed(1)}{' '}
              <Text className="text-sm font-normal text-muted-foreground dark:text-muted-dark-foreground">
                / 5
              </Text>
            </Text>
            <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">
              {stats.rating.totalCalificaciones}{' '}
              {stats.rating.totalCalificaciones === 1 ? 'calificación' : 'calificaciones'}
            </Text>
          </View>
        </Card>

        {/* Detalle ganancias del período por defecto (mes actual) */}
        <View className="gap-2">
          <Text className="text-base font-bold text-foreground dark:text-foreground-dark px-1">
            Detalle del período
          </Text>

          {loadingGanancias ? (
            <Card>
              <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground text-center py-4">
                Cargando detalle…
              </Text>
            </Card>
          ) : !ganancias || ganancias.pedidos.length === 0 ? (
            <Card elevated={false} className="py-2">
              <EmptyState
                icon={Package}
                title="Sin entregas en este período"
                description="Cuando completes entregas vas a ver el detalle acá."
                className="py-8"
              />
            </Card>
          ) : (
            <Card className="gap-0" elevated={true}>
              <View className="flex-row justify-between items-center py-1 pb-3 border-b border-border dark:border-border-dark">
                <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground">
                  Total del período
                </Text>
                <Text className="text-base font-bold text-success">
                  {formatARS(ganancias.total)}
                </Text>
              </View>
              {ganancias.pedidos.slice(0, 20).map((p) => (
                <View
                  key={p.pedidoId}
                  className="flex-row justify-between items-center py-2.5 border-b border-border dark:border-border-dark last:border-0"
                >
                  <View>
                    <Text className="text-sm text-foreground dark:text-foreground-dark">
                      Pedido #{p.pedidoId.slice(-6).toUpperCase()}
                    </Text>
                    <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground mt-0.5">
                      {formatDateTime(p.fecha)}
                    </Text>
                  </View>
                  <Text className="text-sm font-bold text-success">
                    +{formatARS(p.montoEnvio)}
                  </Text>
                </View>
              ))}
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
