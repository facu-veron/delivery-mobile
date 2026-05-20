# Requisitos backend — Secciones del perfil del repartidor

> Estado: **pendiente de implementación en el backend**
> Afecta: tab "Mi perfil" del repartidor

---

## Contexto

El rediseño del perfil del repartidor (estilo PedidosYa) suma 4 quick actions, 2 secciones de listado y un widget de disponibilidad destacado. Algunos endpoints ya existen (perfil, disponibilidad), otros no.

Pantalla afectada: `src/app/(repartidor)/(tabs)/perfil.tsx`

---

## 1. Confirmación del contrato `PATCH /api/repartidor/disponibilidad`

### Lo que envía hoy la app

```typescript
// src/features/repartidor/api/repartidor.api.ts
cambiarDisponibilidad: (disponible: boolean) =>
  apiClient.patch('/api/repartidor/disponibilidad', { disponible }),
```

Body: `{ "disponible": true }` (boolean)

### Lo que dice la Fase 1 del backend

> "Solo acepta `DISPONIBLE` o `NO_DISPONIBLE` (no `EN_PEDIDO`, ese lo maneja el sistema)"

Posibles interpretaciones del payload:

```jsonc
// Opción A — boolean (lo que la app envía hoy)
{ "disponible": true }

// Opción B — enum
{ "estado": "DISPONIBLE" }
```

**Acción:** confirmar cuál es el shape correcto y ajustar el cliente si hace falta. Hoy `useCambiarDisponibilidad` ya hace update optimista con rollback, así que el contract debe ser estable.

### Respuesta esperada (para confirmar el optimistic update)

```json
200 OK
{ "disponible": true }
```

Que el backend devuelva el estado tras el cambio es importante porque el frontend lo usa para validar el rollback.

---

## 2. Estadísticas y ganancias del repartidor

Hoy la quick action "Ganancias" no tiene endpoint detrás. Necesitamos al menos un resumen + un detalle por período.

### Endpoint resumen

```
GET /api/repartidor/estadisticas
```

```typescript
{
  hoy: {
    entregas: number;
    ganancias: number;  // suma de costoEnvio de pedidos ENTREGADO hoy
  },
  semana: {
    entregas: number;
    ganancias: number;
    horasActivas: number;  // tiempo total con disponible=true
  },
  mes: {
    entregas: number;
    ganancias: number;
  },
  rating: {
    promedio: number;        // 0-5
    totalCalificaciones: number;
  }
}
```

### Endpoint detalle (con paginación)

```
GET /api/repartidor/ganancias?desde=2026-05-01&hasta=2026-05-20
```

```typescript
{
  total: number;
  pedidos: Array<{
    pedidoId: string;
    fecha: string;
    montoEnvio: number;
    propina?: number;
  }>
}
```

---

## 3. Calificaciones del repartidor

Hoy no existe sistema de rating. La quick action "Calificaciones" lo muestra como placeholder.

### Modelo Prisma sugerido

```prisma
model CalificacionRepartidor {
  id            String   @id @default(uuid())
  pedidoId      String   @unique
  pedido        Pedido   @relation(fields: [pedidoId], references: [id])
  repartidorId  String
  repartidor    Repartidor @relation(fields: [repartidorId], references: [id])
  clienteId     String
  cliente       Cliente  @relation(fields: [clienteId], references: [id])
  estrellas     Int      // 1-5
  comentario    String?
  createdAt     DateTime @default(now())

  @@index([repartidorId])
}
```

### Endpoints

```
GET /api/repartidor/calificaciones  # las propias
POST /api/pedidos/:id/calificar     # el cliente califica tras entrega
```

```typescript
// GET response
{
  promedio: number;
  total: number;
  ultimas: Array<{
    estrellas: number;
    comentario?: string;
    fecha: string;
  }>
}
```

---

## 4. Actualización de vehículo y zona

Hoy esos campos se setean al registrarse y no se pueden editar.

### Endpoint

```
PATCH /api/repartidor/perfil
Body: { vehiculo?: string; zona?: string; telefono?: string }
```

Si se cambia la `zona`, el sistema de matching de pedidos debe pickear el nuevo valor inmediatamente.

---

## 5. Notificaciones in-app (badge counter)

El icono de campana en el header del perfil (y posiblemente en el home) requiere un endpoint para listar notificaciones no leídas.

### Endpoints

```
GET   /api/notificaciones?leidas=false   # pendientes
PATCH /api/notificaciones/:id/leer       # marcar como leída
PATCH /api/notificaciones/leer-todas
```

### Shape

```typescript
{
  total: number;
  noLeidas: number;
  items: Array<{
    id: string;
    tipo: 'NUEVO_PEDIDO' | 'AVISAR_CLIENTE' | 'DOCUMENTO_APROBADO' | 'DOCUMENTO_RECHAZADO';
    titulo: string;
    cuerpo: string;
    data?: { pedidoId?: string; documentoKey?: string };
    leida: boolean;
    createdAt: string;
  }>
}
```

> Esto es complementario al push notification: la push notifica fuera de la app, este endpoint permite ver el histórico de notificaciones dentro de la app.

---

## 6. Centro de ayuda / soporte

La quick action "Ayuda" hoy es placeholder. Mínimo:

```
GET /api/ayuda/faqs            # lista de preguntas frecuentes
POST /api/ayuda/contacto       # mensaje de soporte
```

### Shape FAQ

```typescript
Array<{
  id: string;
  pregunta: string;
  respuesta: string;
  categoria: 'PAGOS' | 'PEDIDOS' | 'CUENTA' | 'OTROS';
  rolTarget: 'CLIENTE' | 'REPARTIDOR' | 'AMBOS';
}>
```

### POST contacto

```
POST /api/ayuda/contacto
Body: { asunto: string; mensaje: string; pedidoId?: string }
```

---

## Prioridad sugerida (de mayor a menor)

1. **Confirmar contrato `PATCH disponibilidad`** — bloquea el toggle del perfil
2. **Update perfil (`PATCH /api/repartidor/perfil`)** — sin esto los campos son read-only
3. **Estadísticas / ganancias** — alta visibilidad, motivador clave del repartidor
4. **Notificaciones in-app** — útil pero no bloqueante (la push ya funciona)
5. **Calificaciones** — depende de tener volumen de pedidos
6. **Ayuda** — puede arrancar con un link estático a una landing externa
