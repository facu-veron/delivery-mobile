import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import EventSource from 'react-native-sse';
import SuperTokens from 'supertokens-react-native';

import { env } from '@/config/env';
import { esPedidoTerminado } from '@/features/pedidos/utils/transiciones-estado';
import { EstadoPedido } from '@/shared/types/pedido.types';

interface Options {
  /** React Query key to invalidate on each estado_actualizado event */
  queryKey: unknown[];
  /** Current estado — SSE is skipped when the pedido is already terminal */
  estado: EstadoPedido | undefined;
}

/**
 * Opens an SSE connection to /api/pedidos/:id/estado while the pedido is active.
 * On each evento `estado_actualizado` the given queryKey is invalidated so
 * React Query refetches with the real state. Falls back silently to polling
 * (already configured in the query hook) if the connection can't be established.
 */
export function usePedidoSSE(pedidoId: string, { queryKey, estado }: Options) {
  const qc = useQueryClient();
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!pedidoId || !estado || esPedidoTerminado(estado)) {
      esRef.current?.close();
      esRef.current = null;
      return;
    }

    let active = true;

    const connect = async () => {
      const token = await SuperTokens.getAccessToken();
      if (!active) return;

      const url = `${env.API_URL}/api/pedidos/${pedidoId}/estado`;
      const es = new EventSource<'estado_actualizado'>(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        pollingInterval: 0,
      });

      es.addEventListener('estado_actualizado', () => {
        qc.invalidateQueries({ queryKey });
      });

      es.addEventListener('error', () => {
        es.close();
      });

      esRef.current = es;
    };

    connect();

    return () => {
      active = false;
      esRef.current?.close();
      esRef.current = null;
    };
  }, [pedidoId, estado, qc, queryKey]);
}
