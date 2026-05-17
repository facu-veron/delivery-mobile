import { useQuery } from '@tanstack/react-query';

import { useDisponibilidadStore } from '@/features/repartidor/store/disponibilidad.store';
import { repartidorApi } from '@/features/repartidor/api/repartidor.api';

export function usePedidosDisponibles() {
  const disponible = useDisponibilidadStore((s) => s.disponible);

  return useQuery({
    queryKey: ['pedidos', 'disponibles'],
    queryFn: () => repartidorApi.getPedidosDisponibles(),
    select: (res) => res.data,
    refetchInterval: disponible ? 10_000 : false,
  });
}
