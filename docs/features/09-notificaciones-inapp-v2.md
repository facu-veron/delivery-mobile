# Feature: Notificaciones in-app

> Estado: **implementado**  
> Archivos clave: `src/presentation/routes/notificacion.routes.ts`, `src/infrastructure/database/repositories/notificacion.repository.impl.ts`, `src/infrastructure/push/expo-push.service.ts`

---

## Contexto

El sistema tiene dos capas de notificación:
1. **Push notifications** (Expo) — llegan al teléfono aunque la app esté cerrada
2. **Notificaciones in-app** — historial visible dentro de la app, con badge counter de no leídas

Ambas capas ahora están **sincronizadas**: cada vez que el backend envía una push notification, también crea automáticamente un registro in-app para ese usuario.

---

## Creación automática (comportamiento del backend)

Las notificaciones in-app se crean automáticamente en estos eventos:

| Evento | Tipo | Destinatario |
|--------|------|-------------|
| Repartidor llega al local | `AVISAR_CLIENTE` | Cliente del pedido |
| Nuevo pedido libre publicado | `NUEVO_PEDIDO` | Cada repartidor disponible |
| Pedido entregado | `PEDIDO_ENTREGADO` | Cliente del pedido |
| Pedido sin repartidor (timeout) | `PEDIDO_CANCELADO` | Cliente (pedido LIBRE) |
| Mensaje enviado a soporte | `SISTEMA` | El usuario que escribió |

> Los comercios **no** reciben notificaciones in-app por ahora (solo push). Esta es una limitación conocida.

---

## GET /api/notificaciones

Lista las notificaciones del usuario autenticado.

```
GET /api/notificaciones               # todas (máx 50)
GET /api/notificaciones?leidas=false  # solo no leídas

Authorization: sAccessToken (cookie, cualquier rol)

200 OK
{
  "total": 12,
  "noLeidas": 3,
  "items": [
    {
      "id": "uuid",
      "tipo": "PEDIDO_ENTREGADO",
      "titulo": "¡Pedido entregado!",
      "cuerpo": "Tu pedido de Pizzería La Piola fue entregado.",
      "data": { "pedidoId": "uuid" },
      "leida": false,
      "creadoEn": "2026-05-20T14:00:00.000Z"
    },
    {
      "id": "uuid",
      "tipo": "SISTEMA",
      "titulo": "Bienvenida",
      "cuerpo": "Gracias por usar SysDelivery.",
      "data": null,
      "leida": true,
      "creadoEn": "2026-05-19T10:00:00.000Z"
    }
  ]
}
```

**Campos:**

| Campo | Descripción |
|-------|-------------|
| `total` | Total de notificaciones (con filtro aplicado) |
| `noLeidas` | Total de no leídas (independientemente del filtro) |
| `data` | Objeto JSON con contexto extra (ej. `{ pedidoId }`) o `null` |
| `leida` | `false` = nueva, `true` = ya vista |

---

## PATCH /api/notificaciones/leer-todas

Marca todas las notificaciones del usuario como leídas.

```
PATCH /api/notificaciones/leer-todas
Authorization: sAccessToken (cookie)

204 No Content
```

---

## PATCH /api/notificaciones/:id/leer

Marca una notificación específica como leída.

```
PATCH /api/notificaciones/:id/leer
Authorization: sAccessToken (cookie)

204 No Content
```

---

## Tipos de notificación

```typescript
type TipoNotificacion =
  | 'NUEVO_PEDIDO'        // repartidor: nuevo pedido disponible
  | 'AVISAR_CLIENTE'      // cliente: repartidor llegó al local
  | 'DOCUMENTO_APROBADO'  // repartidor: admin aprobó documento
  | 'DOCUMENTO_RECHAZADO' // repartidor: admin rechazó documento
  | 'PEDIDO_ENTREGADO'    // cliente: pedido entregado
  | 'PEDIDO_CANCELADO'    // cliente/repartidor: pedido sin repartidor / cancelado
  | 'SISTEMA'             // mensajes de soporte / bienvenida
```

---

## Badge counter

Para mostrar el badge con el número de no leídas, usar el campo `noLeidas` de `GET /api/notificaciones`.

```typescript
// Al abrir la app o la pantalla de notificaciones
const { data } = await api.get('/api/notificaciones?leidas=false');
setUnreadCount(data.noLeidas);
```

---

## Flujo sugerido en el frontend

```typescript
// Tab "Notificaciones" — cargar y mostrar
const NotificacionesScreen = () => {
  const { data, refetch } = useQuery('/api/notificaciones');

  const marcarLeida = async (id: string) => {
    await api.patch(`/api/notificaciones/${id}/leer`);
    refetch();
  };

  const marcarTodas = async () => {
    await api.patch('/api/notificaciones/leer-todas');
    refetch();
  };

  return (
    <>
      <Button onPress={marcarTodas} title="Marcar todas como leídas" />
      {data.items.map(n => (
        <TouchableOpacity key={n.id} onPress={() => marcarLeida(n.id)}>
          <Text style={{ fontWeight: n.leida ? 'normal' : 'bold' }}>
            {n.titulo}
          </Text>
          <Text>{n.cuerpo}</Text>
          {/* Si tiene pedidoId, navegar al detalle */}
          {n.data?.pedidoId && (
            <Text onPress={() => navigation.navigate('Pedido', { id: n.data.pedidoId })}>
              Ver pedido
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </>
  );
};
```

---

## Notas de implementación

- Se devuelven máximo **50 notificaciones**, ordenadas por fecha descendente.
- El campo `noLeidas` siempre refleja el total sin leer del usuario (ignora el filtro `?leidas=false`).
- Las notificaciones in-app se crean en el mismo proceso que envía la push — si la push falla (token inválido), la in-app igual se crea si se provee `usuarioId`.
- Los comercios no tienen notificaciones in-app actualmente: solo reciben push.
