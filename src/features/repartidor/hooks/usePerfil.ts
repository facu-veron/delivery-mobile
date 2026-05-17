import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useDisponibilidadStore } from '../store/disponibilidad.store';
import { repartidorApi } from '../api/repartidor.api';

export function usePerfil() {
  const setDisponible = useDisponibilidadStore((s) => s.setDisponible);

  const query = useQuery({
    queryKey: ['repartidor', 'perfil'],
    queryFn: () => repartidorApi.getPerfil(),
    select: (res) => res.data,
  });

  // Sincroniza el store con el valor real del servidor
  useEffect(() => {
    if (query.data) setDisponible(query.data.disponible);
  }, [query.data?.disponible]);

  return query;
}
