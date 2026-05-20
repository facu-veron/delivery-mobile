# Feature: Calificaciones de pedidos

> Estado: **implementado**  
> Archivos clave: `src/presentation/routes/pedido.routes.ts`, `src/domain/use-cases/repartidor/calificaciones.usecase.ts`

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

## Flujo recomendado en el frontend

1. Al llegar a estado `ENTREGADO`, mostrar pantalla de calificación
2. El cliente selecciona estrellas (1–5) y opcionalmente escribe un comentario
3. Llamar a `POST /api/pedidos/:id/calificar`
4. Si es 204 → mostrar "¡Gracias por tu calificación!"
5. Si ya fue calificado (400) → mostrar el rating existente como readonly

---

## Efecto en el repartidor

- Tras crear la calificación, el sistema recalcula automáticamente `calificacionProm` en el repartidor.
- El campo `Repartidor.calificacionProm` es el promedio de todos los puntajes recibidos.
- Se puede ver en `GET /api/repartidor/estadisticas` → `rating.promedio`.

---

## Limitaciones

- Solo se puede calificar una vez por pedido (`pedidoId` es unique en la tabla `calificaciones`).
- No hay endpoint para editar una calificación existente.
- Solo el cliente que hizo el pedido puede calificarlo.
