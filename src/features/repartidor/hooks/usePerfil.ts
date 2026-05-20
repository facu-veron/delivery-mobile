import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { DisponibilidadRepartidor } from '@/shared/types/pedido.types';
import { repartidorApi } from '../api/repartidor.api';
import { useDisponibilidadStore } from '../store/disponibilidad.store';

export function usePerfil() {
  const setDisponible = useDisponibilidadStore((s) => s.setDisponible);

  const query = useQuery({
    queryKey: ['repartidor', 'perfil'],
    queryFn: () => repartidorApi.getPerfil(),
    select: (res) => res.data,
  });

  // Sincroniza el store con el valor real del servidor
  useEffect(() => {
    if (query.data) {
      setDisponible(query.data.disponibilidad === DisponibilidadRepartidor.DISPONIBLE);
    }
  }, [query.data?.disponibilidad]);

  return query;
}
