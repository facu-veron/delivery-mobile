# Feature: Calificaciones de pedidos

> Estado: **implementado**  
> Archivos clave: `src/presentation/routes/pedido.routes.ts`, `src/domain/use-cases/repartidor/calificaciones.usecase.ts`, `src/infrastructure/database/repositories/calificacion.repository.impl.ts`

---

## POST /api/pedidos/:id/calificar

El **cliente** califica al repartidor tras recibir un pedido entregado.

```
POST /api/pedidos/:id/calificar
Content-Type: application/json
Authorization: sAccessToken (cookie, rol CLIENTE)

Body:
{
  "puntaje": 5,              // requerido — entero entre 1 y 5
  "comentario": "Muy bien"  // opcional — máx 500 caracteres
}

204 No Content
```

**Errores posibles:**

| Status | Mensaje |
|--------|---------|
| 400 | `Pedido no encontrado` |
| 400 | `No podés calificar un pedido que no es tuyo` |
| 400 | `Solo podés calificar pedidos entregados` |
| 400 | `El pedido no tiene repartidor asignado` |
| 400 | `Este pedido ya fue calificado` |
| 400 | `El puntaje debe estar entre 1 y 5` |

---

## GET /api/repartidor/calificaciones

El **repartidor** consulta sus calificaciones recibidas. Incluye el nombre del cliente que calificó.

```
GET /api/repartidor/calificaciones
Authorization: sAccessToken (cookie, rol REPARTIDOR)

200 OK
{
  "promedio": 4.8,
  "total": 25,
  "ultimas": [
    {
      "id": "uuid",
      "puntaje": 5,
      "comentario": "Muy puntual y amable",
      "fecha": "2026-05-20T14:00:00.000Z",
      "clienteNombre": "María González"
    },
    {
      "id": "uuid",
      "puntaje": 4,
      "comentario": "Llegó rápido",
      "fecha": "2026-05-19T10:30:00.000Z",
      "clienteNombre": "Juan Pérez"
    },
    {
      "id": "uuid",
      "puntaje": 5,
      "comentario": null,
      "fecha": "2026-05-18T09:00:00.000Z",
      "clienteNombre": "Ana Rodríguez"
    }
  ]
}
```

**Campos:**

| Campo | Descripción |
|-------|-------------|
| `promedio` | Promedio de todos los puntajes (con 1 decimal) |
| `total` | Total de calificaciones recibidas |
| `ultimas` | Las últimas 20 calificaciones, ordenadas por fecha desc |
| `clienteNombre` | Nombre del cliente que dejó la calificación |
| `comentario` | Puede ser `null` si el cliente no dejó comentario |

---

## Flujo recomendado en el frontend

### Al recibir un pedido (cliente)

```typescript
// Mostrar pantalla de calificación cuando el pedido pasa a ENTREGADO
if (pedido.estado === 'ENTREGADO' && !yaCalificado) {
  navigation.navigate('CalificarPedido', { pedidoId: pedido.id });
}

// Enviar calificación
const calificar = async (puntaje: number, comentario?: string) => {
  await api.post(`/api/pedidos/${pedidoId}/calificar`, { puntaje, comentario });
  navigation.navigate('Home');
};
```

### Mostrar historial de calificaciones (repartidor)

```typescript
const { data } = await api.get('/api/repartidor/calificaciones');

// Renderizar estrellas
<Text>{data.promedio.toFixed(1)} ★</Text>
<Text>{data.total} calificaciones</Text>

{data.ultimas.map(c => (
  <View key={c.id}>
    <Text>{c.clienteNombre}</Text>
    <StarRating value={c.puntaje} readonly />
    {c.comentario && <Text>{c.comentario}</Text>}
    <Text>{formatDate(c.fecha)}</Text>
  </View>
))}
```

---

## Efecto en el repartidor

- Tras crear una calificación, el sistema recalcula automáticamente `calificacionProm` en el repartidor.
- El campo `Repartidor.calificacionProm` es el promedio de todos los puntajes recibidos.
- Se puede ver también en `GET /api/repartidor/estadisticas` → `rating.promedio` y en `GET /api/repartidor/perfil` → `calificacionProm`.

---

## Limitaciones

- Solo se puede calificar una vez por pedido (`pedidoId` es único en la tabla `calificaciones`).
- No hay endpoint para editar una calificación existente.
- Solo el cliente que hizo el pedido puede calificarlo.
- Se muestran las últimas 20 calificaciones. No hay paginación por ahora.
