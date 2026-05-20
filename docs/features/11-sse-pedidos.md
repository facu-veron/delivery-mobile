# Feature: Actualizaciones en tiempo real — SSE de pedidos

> Estado: **implementado**  
> Archivos clave: `src/presentation/routes/pedido.routes.ts`, `src/presentation/controllers/pedido.controller.ts`

---

## GET /api/pedidos/:id/estado

Server-Sent Events para recibir actualizaciones del estado de un pedido en tiempo real.

```
GET /api/pedidos/:id/estado
Accept: text/event-stream
Authorization: sAccessToken (cookie)
```

El servidor mantiene la conexión abierta y emite eventos cada vez que el pedido cambia de estado:

```
event: estado_actualizado
data: {"pedidoId":"uuid","estado":"EN_CAMINO","updatedAt":"..."}
```

---

## Uso con react-native-sse (ya instalado)

```typescript
import EventSource from 'react-native-sse';

const es = new EventSource(`${API_URL}/api/pedidos/${pedidoId}/estado`, {
  headers: { Cookie: `sAccessToken=${token}` },
});

es.addEventListener('estado_actualizado', (event) => {
  const data = JSON.parse(event.data!);
  setEstado(data.estado);
});

es.addEventListener('error', () => {
  // Fallback a polling si la conexión SSE falla
  iniciarPolling();
});

// Cleanup
return () => es.close();
```

---

## Reemplaza el polling

El SSE reemplaza el polling activo de 5s que tenían varias pantallas:

| Pantalla | Antes | Ahora |
|----------|-------|-------|
| Detalle de pedido (repartidor) | polling 5s | SSE |
| Tab "En curso" (repartidor) | polling 5s | SSE |
| Seguimiento del pedido (cliente) | polling 5s | SSE |

Para `usePedidosDisponibles` y `mis-pedidos` (listas), el polling sigue siendo razonable ya que no hay un pedido específico a escuchar.

---

## Estrategia de fallback

Si el SSE se corta (red inestable, servidor reiniciado), el frontend detecta el evento `error` y puede activar polling como fallback. Al reconectarse, volver a SSE.
