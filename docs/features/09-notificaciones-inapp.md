# Feature: Notificaciones in-app

> Estado: **implementado**  
> Archivos clave: `src/presentation/routes/notificacion.routes.ts`, `src/infrastructure/database/repositories/notificacion.repository.impl.ts`

---

## Contexto

Las push notifications ya funcionan (Expo Push). Este módulo agrega un **historial de notificaciones** visible dentro de la app, con badge counter de no leídas.

---

## GET /api/notificaciones

Lista las notificaciones del usuario autenticado.

```
GET /api/notificaciones               # todas
GET /api/notificaciones?leidas=false  # solo no leídas

200 OK
{
  "total": 12,
  "noLeidas": 3,
  "items": [
    {
      "id": "uuid",
      "tipo": "NUEVO_PEDIDO",
      "titulo": "Nuevo pedido recibido",
      "cuerpo": "Tenés un nuevo pedido de Juan Pérez",
      "data": { "pedidoId": "uuid" },
      "leida": false,
      "creadoEn": "2026-05-20T14:00:00.000Z"
    }
  ]
}
```

Devuelve máximo 50 notificaciones, ordenadas por fecha descendente.

---

## PATCH /api/notificaciones/leer-todas

Marca todas las notificaciones como leídas.

```
PATCH /api/notificaciones/leer-todas

204 No Content
```

---

## PATCH /api/notificaciones/:id/leer

Marca una notificación específica como leída.

```
PATCH /api/notificaciones/:id/leer

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
  | 'PEDIDO_CANCELADO'    // cliente/repartidor: pedido cancelado
  | 'SISTEMA'             // mensajes de soporte/ayuda
```

---

## Badge counter

Para mostrar el badge con el número de no leídas, usar el campo `noLeidas` de `GET /api/notificaciones`. El frontend puede hacer polling en background o llamarlo al abrir la pantalla de notificaciones.

---

## Notas de implementación

Actualmente, el backend no crea automáticamente notificaciones in-app al enviar push notifications. Esto se puede agregar en un futuro: en cada lugar donde se llama a `notifService.enviar(...)`, también crear un registro en `NotificacionInApp`.

Para el flujo de soporte (`POST /api/ayuda/contacto`), sí se crea una notificación de tipo `SISTEMA` para el usuario que envió el mensaje.
