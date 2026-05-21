import { Bell, CheckCheck, ChevronRight, Package, ShoppingBag, Truck, XCircle } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/shared/components/Card';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useMarcarLeida, useMarcarTodasLeidas, useNotificaciones } from '@/shared/hooks/useNotificaciones';
import { formatDateTime } from '@/shared/lib/formatters';
import { Notificacion, RolUsuario, TipoNotificacion } from '@/shared/types/pedido.types';
import { useRouter } from 'expo-router';

const TIPO_ICON: Record<TipoNotificacion, LucideIcon> = {
  [TipoNotificacion.NUEVO_PEDIDO]: ShoppingBag,
  [TipoNotificacion.AVISAR_CLIENTE]: Truck,
  [TipoNotificacion.DOCUMENTO_APROBADO]: CheckCheck,
  [TipoNotificacion.DOCUMENTO_RECHAZADO]: XCircle,
  [TipoNotificacion.PEDIDO_ENTREGADO]: Package,
  [TipoNotificacion.PEDIDO_CANCELADO]: XCircle,
  [TipoNotificacion.SISTEMA]: Bell,
};

const TIPO_COLOR: Record<TipoNotificacion, string> = {
  [TipoNotificacion.NUEVO_PEDIDO]: '#EEC234',
  [TipoNotificacion.AVISAR_CLIENTE]: '#EEC234',
  [TipoNotificacion.DOCUMENTO_APROBADO]: '#2D8A4E',
  [TipoNotificacion.DOCUMENTO_RECHAZADO]: '#C13D2A',
  [TipoNotificacion.PEDIDO_ENTREGADO]: '#2D8A4E',
  [TipoNotificacion.PEDIDO_CANCELADO]: '#C13D2A',
  [TipoNotificacion.SISTEMA]: '#6A6052',
};

function NotificacionItem({
  item,
  onPress,
}: {
  item: Notificacion;
  onPress?: () => void;
}) {
  const Icon = TIPO_ICON[item.tipo] ?? Bell;
  const color = TIPO_COLOR[item.tipo] ?? '#6A6052';
  const tappable = !!onPress;

  const content = (
    <View
      className={`flex-row gap-3 py-3 border-b border-border dark:border-border-dark last:border-0 ${
        !item.leida ? 'opacity-100' : 'opacity-60'
      }`}
    >
      <View
        className="w-9 h-9 rounded-full items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon size={16} color={color} strokeWidth={2} />
      </View>
      <View className="flex-1 gap-0.5">
        <View className="flex-row items-start justify-between gap-2">
          <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark flex-1">
            {item.titulo}
          </Text>
          {!item.leida && (
            <View className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
          )}
        </View>
        <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground leading-4">
          {item.cuerpo}
        </Text>
        <Text className="text-[11px] text-muted-foreground dark:text-muted-dark-foreground mt-0.5">
          {formatDateTime(item.creadoEn)}
        </Text>
      </View>
      {tappable && (
        <View className="justify-center">
          <ChevronRight size={14} color="#6A6052" strokeWidth={2} />
        </View>
      )}
    </View>
  );

  if (tappable) {
    return (
      <Pressable onPress={onPress} className="active:opacity-70">
        {content}
      </Pressable>
    );
  }
  return content;
}

export function NotificacionesScreen() {
  const router = useRouter();
  const { rol } = useAuthStore();
  const { data, isLoading } = useNotificaciones();
  const { mutate: marcarTodas, isPending } = useMarcarTodasLeidas();
  const { mutate: marcarLeida } = useMarcarLeida();

  const pedidoBase = rol === RolUsuario.REPARTIDOR ? '/(repartidor)/pedido' : '/(cliente)/pedido';

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScreenHeader
        title="Notificaciones"
        right={
          data && data.noLeidas > 0 ? (
            <Pressable
              onPress={() => marcarTodas()}
              disabled={isPending}
              hitSlop={8}
              className="active:opacity-60"
            >
              <Text className="text-xs font-medium text-primary">
                Marcar leídas
              </Text>
            </Pressable>
          ) : undefined
        }
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Sin notificaciones"
          description="Cuando haya novedades las vas a ver acá."
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Card className="gap-0">
            {data.items.map((item) => {
              const pedidoId = item.data?.pedidoId;
              const onPress = pedidoId
                ? () => {
                    if (!item.leida) marcarLeida(item.id);
                    router.push(`${pedidoBase}/${pedidoId}` as any);
                  }
                : undefined;
              return <NotificacionItem key={item.id} item={item} onPress={onPress} />;
            })}
          </Card>
          {data.total > data.items.length && (
            <Text className="text-xs text-center text-muted-foreground dark:text-muted-dark-foreground mt-3">
              Mostrando las últimas 50 notificaciones
            </Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
