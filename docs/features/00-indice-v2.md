# Índice de features — Backend

> Actualizado: 2026-05-21  
> Directorio: `docs/features/`

Este directorio documenta todos los endpoints disponibles para el frontend React Native/Expo, organizados por feature.

---

## Features implementados

| # | Feature | Endpoints | Estado |
|---|---------|-----------|--------|
| 01 | [Autenticación y sesión](./01-autenticacion-sesion.md) | `POST /auth/signin`, registros, cambiar password | ✅ Implementado |
| 02 | [Perfil propio — /api/me](./02-perfil-me.md) | `GET/PATCH /api/me`, `POST /api/me/avatar` | ✅ Implementado |
| 03 | [Direcciones del cliente](./03-direcciones-cliente.md) | `GET/POST/PATCH/DELETE /api/cliente/direcciones` | ✅ Implementado |
| 04 | [Comercios favoritos](./04-favoritos-cliente.md) | `GET/POST/DELETE /api/cliente/favoritos` | ✅ Implementado |
| 05 | [Disponibilidad repartidor](./05-disponibilidad-repartidor.md) | `PATCH /api/repartidor/disponibilidad` | ✅ Actualizado |
| 06 | [Perfil del repartidor](./06-perfil-repartidor.md) | `GET/PATCH /api/repartidor/perfil`, `/documentos` | ✅ Actualizado |
| 07 | [Estadísticas y ganancias](./07-estadisticas-repartidor.md) | `GET /api/repartidor/estadisticas`, `/ganancias`, `/calificaciones` | ✅ Implementado |
| 08 | [Calificaciones](./08-calificaciones.md) | `POST /api/pedidos/:id/calificar` | ✅ Actualizado |
| 09 | [Notificaciones in-app](./09-notificaciones-inapp.md) | `GET/PATCH /api/notificaciones` | ✅ Actualizado |
| 10 | [Ayuda y soporte](./10-ayuda-soporte.md) | `GET /api/ayuda/faqs`, `POST /api/ayuda/contacto` | ✅ Implementado |
| 11 | [SSE — Pedidos en tiempo real](./11-sse-pedidos.md) | `GET /api/pedidos/:id/estado` | ✅ Pre-existente |
| 12 | [Cambiar contraseña](./12-cambiar-password.md) | `POST /api/cambiar-password` | ✅ Implementado |
| 13 | [Crear pedido — dirección libre](./13-crear-pedido-direccion-libre.md) | `clienteDireccion` en creación de pedido | ✅ Implementado |

---

## Cambios en features pre-existentes (sesión 1 y 2)

### `PATCH /api/repartidor/disponibilidad`
- **Antes:** `{ "disponibilidad": "DISPONIBLE" }` → devolvía objeto repartidor completo
- **Ahora:** `{ "disponible": true }` → devuelve `{ "disponible": true }`

### Token de sesión
- **Antes:** `{ usuarioId, rol, perfilId }`
- **Ahora:** `{ usuarioId, rol, perfilId, nombre }` — `nombre` ya disponible sin llamada extra

### Login con credenciales incorrectas
- **Antes:** HTTP 200 con `{ status: "WRONG_CREDENTIALS_ERROR" }`
- **Ahora:** HTTP 401 con `{ status: "WRONG_CREDENTIALS_ERROR" }`

### `GET /api/repartidor/calificaciones` — campo nuevo
- `clienteNombre` ahora incluido en cada calificación (antes no existía)

### `GET /api/repartidor/perfil` — campo nuevo
- `zonaNombre` ahora incluido con el nombre legible de la zona (antes solo `zonaId` UUID)

### Crear pedido — campo nuevo `clienteDireccion`
- Ambos endpoints de creación de pedido ahora aceptan `clienteDireccion: string` como alternativa a `direccionEntregaId: uuid`

### Notificaciones in-app — creación automática
- Al enviar push notifications, el sistema crea automáticamente un registro en `NotificacionInApp`
- Afecta: aviso al cliente ("repartidor en la puerta"), pedido disponible (repartidores), pedido entregado (cliente), sin repartidor/expirado (cliente)

---

## Resumen de todos los endpoints

```
# Autenticación (SuperTokens built-in)
POST   /auth/signin
POST   /auth/signout
POST   /auth/session/refresh

# Registro
POST   /api/registro/cliente
POST   /api/registro/comercio
POST   /api/registro/repartidor

# Perfil propio (cualquier rol)
GET    /api/me
PATCH  /api/me
POST   /api/me/avatar
POST   /api/cambiar-password

# Cliente — direcciones
GET    /api/cliente/direcciones
POST   /api/cliente/direcciones
PATCH  /api/cliente/direcciones/:id
DELETE /api/cliente/direcciones/:id

# Cliente — favoritos
GET    /api/cliente/favoritos
POST   /api/cliente/favoritos/:comercioId
DELETE /api/cliente/favoritos/:comercioId

# Pedidos
GET    /api/pedidos
GET    /api/pedidos/:id
GET    /api/pedidos/:id/estado         (SSE)
POST   /api/pedidos/catalogo
POST   /api/pedidos/libre
POST   /api/pedidos/:id/calificar      (CLIENTE)
POST   /api/pedidos/:id/cancelar       (CLIENTE)
POST   /api/pedidos/:id/aceptar        (COMERCIO)
POST   /api/pedidos/:id/rechazar       (COMERCIO)
POST   /api/pedidos/:id/en-preparacion (COMERCIO)
POST   /api/pedidos/:id/listo          (COMERCIO)
POST   /api/pedidos/:id/tomar          (REPARTIDOR)
POST   /api/pedidos/:id/confirmar-precio (REPARTIDOR)
POST   /api/pedidos/:id/en-camino      (REPARTIDOR)
POST   /api/pedidos/:id/entregar       (REPARTIDOR)
POST   /api/pedidos/:id/avisar-cliente (REPARTIDOR)

# Repartidor
GET    /api/repartidor/perfil
PATCH  /api/repartidor/perfil
GET    /api/repartidor/documentos
PATCH  /api/repartidor/disponibilidad
GET    /api/repartidor/estadisticas
GET    /api/repartidor/ganancias
GET    /api/repartidor/calificaciones
GET    /api/repartidor/pedidos-disponibles

# Notificaciones
GET    /api/notificaciones
PATCH  /api/notificaciones/leer-todas
PATCH  /api/notificaciones/:id/leer

# Ayuda
GET    /api/ayuda/faqs
POST   /api/ayuda/contacto

# Público
GET    /api/tarifa/calcular?monto=50000
GET    /api/comercios
GET    /api/comercios/:id
```

---

## Pendientes / decisiones abiertas

- **Métodos de pago:** pendiente definir si el sistema será 100% efectivo o incluirá pasarela (MercadoPago).
- **horasActivas** en estadísticas: requiere trackear historial de disponibilidad (no implementado).
- **Avatar en producción:** actualmente se guarda en disco local. Para producción, migrar a S3/Cloudinary cambiando solo `src/infrastructure/upload/multer.config.ts`.
- **Historial de notificaciones del comercio:** actualmente los comercios no reciben notificaciones in-app, solo push.
