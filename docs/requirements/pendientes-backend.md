# Requisitos backend pendientes — Mobile

> Actualizado: 2026-05-20  
> Lista consolidada de lo que el frontend necesita del backend y aún no está confirmado/implementado.

---

## 1. Nombre de zona legible (repartidor)

**Problema:** `GET /api/repartidor/perfil` devuelve `zonaId: "uuid"`. La UI no puede mostrar un nombre legible.

**Necesitamos:** que el perfil incluya `zonaNombre: string`, o un endpoint `GET /api/zonas/:id` que devuelva `{ id, nombre }`.

**Workaround actual:** no se muestra la zona en la UI.

---

## 2. Campo `clienteDireccion` en pedidos

**Problema:** los docs de backend dicen que crear pedido acepta `direccionEntregaId`, pero el frontend envía `clienteDireccion` (string libre) y esto actualmente funciona.

**Necesitamos confirmación** de si el backend acepta ambos formatos o si debemos migrar a `direccionEntregaId`. Si el backend solo acepta `direccionEntregaId`, el flujo de carrito/pedido-libre debe cambiarse para requerir que el usuario tenga al menos una dirección guardada.

**Estado actual del frontend:** usa `clienteDireccion` string + selector de direcciones guardadas como atajo (pre-rellena el campo de texto).

---

## 3. Disponibilidad — formato del body del PATCH

**Problema:** el frontend envía `{ disponible: boolean }` pero los docs dicen que el endpoint acepta `DISPONIBLE | NO_DISPONIBLE` como string.

**Lo que enviamos hoy:**
```json
{ "disponible": true }
```

**Lo que puede esperar el backend:**
```json
{ "disponibilidad": "DISPONIBLE" }
```

**Acción:** confirmar con backend cuál es el contrato exacto y actualizar `repartidor.api.ts` si hace falta.

---

## 4. Cambiar contraseña

**Frontend:** quick action en perfil (repartidor y cliente) — actualmente no implementado.

**Necesitamos:** endpoint para cambio de contraseña autenticado, o confirmar que se usa el flujo SuperTokens de reset vía email.

**Sugerencia:**
```
POST /api/auth/cambiar-password
Body: { "passwordActual": string, "passwordNueva": string }
200 OK | 401 Unauthorized (password actual incorrecta)
```

---

## 5. Calificaciones del repartidor

**Frontend:** quick action "Calificaciones" en perfil del repartidor — actualmente sin pantalla.

**Necesitamos** (ya documentado en `docs/features/08-calificaciones.md`):
- `GET /api/repartidor/calificaciones` — lista de reseñas recibidas
- Endpoint ya existe según el doc — solo falta la pantalla en el frontend.

**Acción:** implementar `CalificacionesScreen` en el frontend (tarea pendiente de Bloque 4).

---

## 6. Notificaciones in-app

**Frontend:** ícono de campana en perfil → sin pantalla.

**Necesitamos** (ya documentado en `docs/features/09-notificaciones-inapp.md`):
- `GET /api/notificaciones` — lista paginada
- `PATCH /api/notificaciones/:id/leer` — marcar como leída
- Badge counter en el ícono (requiere count no-leídas en la respuesta)

**Acción:** implementar en Bloque 4.

---

## 7. Upload avatar — tamaño y formato

**Frontend:** usa `expo-image-picker` → `POST /api/me/avatar` con `multipart/form-data`.

**Necesitamos** que el backend documente:
- Tamaño máximo aceptado
- Formatos soportados (JPEG, PNG, WEBP)
- Si redimensiona automáticamente o el cliente debe hacerlo

**Sin esta info:** el frontend no puede mostrar un error descriptivo si el archivo es rechazado.
