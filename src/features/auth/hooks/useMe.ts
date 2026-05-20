import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { meApi } from '../api/me.api';
import { useAuthStore } from '../store/auth.store';

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setPerfil = useAuthStore((s) => s.setPerfil);

  const query = useQuery({
    queryKey: ['me'],
    queryFn: () => meApi.getMe(),
    select: (res) => res.data,
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  // Hidrata el authStore cada vez que /me se refresca
  useEffect(() => {
    if (!query.data) return;
    setPerfil({
      nombre: query.data.perfil.nombre,
      telefono: query.data.perfil.telefono,
      avatarUrl: query.data.perfil.avatarUrl,
    });
  }, [query.data?.perfil.nombre, query.data?.perfil.telefono, query.data?.perfil.avatarUrl]);

  return query;
}
