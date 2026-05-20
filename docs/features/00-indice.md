# Índice de features — Backend

> Generado: 2026-05-20  
> Directorio: `docs/features/`

Este directorio documenta todos los endpoints disponibles para el frontend React Native/Expo, organizados por feature.

---

## Features implementados

| # | Feature | Endpoints | Estado |
|---|---------|-----------|--------|
| 01 | [Autenticación y sesión](./01-autenticacion-sesion.md) | `POST /auth/signin`, registros | ✅ Implementado |
| 02 | [Perfil propio — /api/me](./02-perfil-me.md) | `GET/PATCH /api/me`, `POST /api/me/avatar` | ✅ Implementado |
| 03 | [Direcciones del cliente](./03-direcciones-cliente.md) | `GET/POST/PATCH/DELETE /api/cliente/direcciones` | ✅ Implementado |
| 04 | [Comercios favoritos](./04-favoritos-cliente.md) | `GET/POST/DELETE /api/cliente/favoritos` | ✅ Implementado |
| 05 | [Disponibilidad repartidor](./05-disponibilidad-repartidor.md) | `PATCH /api/repartidor/disponibilidad` | ✅ Actualizado |
| 06 | [Perfil del repartidor](./06-perfil-repartidor.md) | `GET/PATCH /api/repartidor/perfil`, `/documentos` | ✅ Implementado |
| 07 | [Estadísticas y ganancias](./07-estadisticas-repartidor.md) | `GET /api/repartidor/estadisticas`, `/ganancias`, `/calificaciones` | ✅ Implementado |
| 08 | [Calificaciones](./08-calificaciones.md) | `POST /api/pedidos/:id/calificar` | ✅ Implementado |
| 09 | [Notificaciones in-app](./09-notificaciones-inapp.md) | `GET/PATCH /api/notificaciones` | ✅ Implementado |
| 10 | [Ayuda y soporte](./10-ayuda-soporte.md) | `GET /api/ayuda/faqs`, `POST /api/ayuda/contacto` | ✅ Implementado |
| 11 | [SSE — Pedidos en tiempo real](./11-sse-pedidos.md) | `GET /api/pedidos/:id/estado` | ✅ Pre-existente |

---

## Cambios en features pre-existentes

### `PATCH /api/repartidor/disponibilidad`
- **Antes:** `{ "disponibilidad": "DISPONIBLE" }` → devolvía objeto repartidor completo
- **Ahora:** `{ "disponible": true }` → devuelve `{ "disponible": true }`

### Token de sesión
- **Antes:** `{ usuarioId, rol, perfilId }`
- **Ahora:** `{ usuarioId, rol, perfilId, nombre }` — `nombre` ya disponible sin llamada extra

### Login con credenciales incorrectas
- **Antes:** HTTP 200 con `{ status: "WRONG_CREDENTIALS_ERROR" }`
- **Ahora:** HTTP 401 con `{ status: "WRONG_CREDENTIALS_ERROR" }`

---

## Resumen de nuevos endpoints

```
GET    /api/me
PATCH  /api/me
POST   /api/me/avatar

GET    /api/cliente/direcciones
POST   /api/cliente/direcciones
PATCH  /api/cliente/direcciones/:id
DELETE /api/cliente/direcciones/:id

GET    /api/cliente/favoritos
POST   /api/cliente/favoritos/:comercioId
DELETE /api/cliente/favoritos/:comercioId

GET    /api/repartidor/documentos
PATCH  /api/repartidor/perfil
GET    /api/repartidor/estadisticas
GET    /api/repartidor/ganancias
GET    /api/repartidor/calificaciones

POST   /api/pedidos/:id/calificar

GET    /api/notificaciones
PATCH  /api/notificaciones/leer-todas
PATCH  /api/notificaciones/:id/leer

GET    /api/ayuda/faqs
POST   /api/ayuda/contacto
```

---

## Pendientes / decisiones

- **Métodos de pago:** pendiente definir si el sistema será 100% efectivo o incluirá pasarela (MercadoPago). Ver `docs/requirements/perfil-cliente-secciones.md` sección 3.
- **horasActivas** en estadísticas: requiere trackear historial de disponibilidad (no implementado).
- **Avatar en producción:** actualmente se guarda en disco local. Para producción, migrar a S3/Cloudinary cambiando solo `src/infrastructure/upload/multer.config.ts`.
