# Feature: Disponibilidad del repartidor

> Estado: **implementado — contrato actualizado**  
> Archivos clave: `src/presentation/routes/repartidor.routes.ts`, `src/presentation/validators/repartidor.validator.ts`

---

## PATCH /api/repartidor/disponibilidad

El endpoint ahora acepta un **boolean** (en lugar del enum string anterior).

```
PATCH /api/repartidor/disponibilidad
Content-Type: application/json
Authorization: sAccessToken (cookie, rol REPARTIDOR)

Body:
{ "disponible": true }   // → DISPONIBLE
{ "disponible": false }  // → NO_DISPONIBLE

200 OK
{ "disponible": true }
```

**Errores posibles:**

| Status | Mensaje |
|--------|---------|
| 400 | `Solo los repartidores aprobados pueden cambiar su disponibilidad` |
| 400 | `No podés cambiar la disponibilidad mientras tenés un pedido activo` |

---

## Notas de implementación

- El backend convierte el boolean a `DisponibilidadRepartidor` (`DISPONIBLE` / `NO_DISPONIBLE`) internamente.
- `EN_PEDIDO` es solo seteado por el sistema cuando el repartidor acepta un pedido — no puede enviarse desde el frontend.
- La respuesta devuelve solo `{ disponible: boolean }` (no el objeto repartidor completo) para confirmar el optimistic update del frontend.

---

## Optimistic update en el frontend

El hook `useCambiarDisponibilidad` puede:
1. Actualizar el estado local inmediatamente
2. Llamar al endpoint
3. Si la respuesta confirma el estado → OK
4. Si hay error → rollback al estado anterior usando el campo `disponible` de la respuesta
