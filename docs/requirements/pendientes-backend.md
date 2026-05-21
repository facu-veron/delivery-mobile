# Requisitos backend pendientes — Mobile

> Actualizado: 2026-05-20 (post Bloque 5)  
> Lista consolidada de lo que el frontend necesita del backend y aún no está confirmado/implementado.
> Los ítems resueltos fueron eliminados.

---

## 1. Nombre de zona legible (repartidor)

**Problema:** `GET /api/repartidor/perfil` devuelve `zonaId: "uuid"`. La UI no puede mostrar un nombre legible.

**Necesitamos:** que el perfil incluya `zonaNombre: string`, o un endpoint `GET /api/zonas/:id` que devuelva `{ id, nombre }`.

**Workaround actual:** la fila "Zona de trabajo" en el perfil está deshabilitada (NoImplementadoAlert).

---

## 2. Campo `clienteDireccion` vs `direccionEntregaId`

**Problema:** los docs del backend indican que crear un pedido acepta `direccionEntregaId`, pero el frontend actualmente envía `clienteDireccion` (string libre) y funciona.

**Necesitamos confirmación** de si el backend acepta ambos formatos o si debemos migrar.

**Estado frontend:** envía `clienteDireccion` string. El `DireccionSelector` pre-rellena ese campo con la dirección guardada seleccionada — no envía IDs.

**Impacto si se migra a `direccionEntregaId`:** el flujo de carrito y pedido-libre deberá requerir una dirección guardada (no se puede escribir texto libre).

---

## 3. Disponibilidad — formato del body PATCH

**Lo que enviamos:**
```json
{ "disponible": true }
```

**Lo que puede esperar el backend según docs:**
```json
{ "disponibilidad": "DISPONIBLE" }
```

**Acción:** confirmar contrato y actualizar `repartidor.api.ts:cambiarDisponibilidad` si hace falta.

---

## 4. Cambiar contraseña

**Frontend:** quick action en ambos perfiles — sin implementar.

**Opción A — endpoint propio:**
```
POST /api/auth/cambiar-password
Body: { "passwordActual": string, "passwordNueva": string }
200 OK | 401 Unauthorized
```

**Opción B:** usar flujo SuperTokens de reset por email (no requiere endpoint nuevo, pero el UX es más incómodo dentro de la app).

---

## 5. Lista de calificaciones recibidas (repartidor)

**Frontend:** quick action "Calificaciones" actualmente navega a Ganancias (workaround).

**Necesitamos:** `GET /api/repartidor/calificaciones` — lista de reseñas recibidas con puntaje, comentario, fecha y nombre del cliente (o anónimo).

**Cuando esté disponible:** crear `CalificacionesScreen` en `/(repartidor)/calificaciones`.

---

## 6. Upload avatar — restricciones de archivo

**Frontend:** `expo-image-picker` → `POST /api/me/avatar` con `multipart/form-data`.

**Falta documentar:**
- Tamaño máximo (bytes)
- Formatos aceptados (JPEG / PNG / WEBP)
- Si el backend redimensiona o el cliente debe hacerlo

**Sin esta info:** el frontend muestra un error genérico si el archivo es rechazado por tamaño/formato.

---

## 7. Notificaciones in-app — creación automática al enviar push

**Estado actual:** el backend NO crea automáticamente un registro `NotificacionInApp` al enviar una push notification. La pantalla de notificaciones solo mostrará mensajes de contacto de soporte (tipo `SISTEMA`) y lo que el backend genere explícitamente.

**Sugerencia:** en cada llamada a `notifService.enviar(...)`, crear también el registro en `NotificacionInApp`. Esto haría que el historial in-app refleje todas las pushes recibidas.
