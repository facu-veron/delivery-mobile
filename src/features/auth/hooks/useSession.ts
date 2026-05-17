import { useEffect, useState } from 'react';
import SuperTokens from 'supertokens-react-native';

import { RolUsuario } from '@/shared/types/pedido.types';
import { useAuthStore } from '../store/auth.store';

export function useSession() {
  const [loading, setLoading] = useState(true);
  const { setSession, clearSession, isAuthenticated } = useAuthStore();

  useEffect(() => {
    async function hydrate() {
      try {
        const exists = await SuperTokens.doesSessionExist();
        if (!exists) {
          clearSession();
          return;
        }
        const payload = await SuperTokens.getAccessTokenPayloadSecurely();
        setSession({
          usuarioId: payload.usuarioId ?? '',
          rol: payload.rol as RolUsuario,
          perfilId: payload.perfilId ?? '',
          nombre: payload.nombre ?? '',
        });
      } finally {
        setLoading(false);
      }
    }
    hydrate();
  }, []);

  return { loading, isAuthenticated };
}
