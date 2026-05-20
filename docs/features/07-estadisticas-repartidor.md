# Feature: Estadísticas y ganancias del repartidor

> Estado: **implementado**  
> Archivos clave: `src/presentation/routes/repartidor.routes.ts`, `src/domain/use-cases/repartidor/estadisticas.usecase.ts`

---

## GET /api/repartidor/estadisticas

Resumen de actividad del repartidor autenticado.

```
GET /api/repartidor/estadisticas

200 OK
{
  "hoy": {
    "entregas": 5,
    "ganancias": 1500
  },
  "semana": {
    "entregas": 32,
    "ganancias": 8400
  },
  "mes": {
    "entregas": 127,
    "ganancias": 33800
  },
  "rating": {
    "promedio": 4.8,
    "totalCalificaciones": 95
  }
}
```

**Notas:**
- `ganancias` es la suma de `costoEnvio` de pedidos con estado `ENTREGADO`.
- `horasActivas` no está implementado (requeriría trackear historial de disponibilidad).
- Las fechas se calculan relativas a la hora del servidor al momento del request.

---

## GET /api/repartidor/ganancias

Detalle de ganancias filtrado por período.

```
GET /api/repartidor/ganancias?desde=2026-05-01&hasta=2026-05-20

Query params:
  desde: ISO date string (default: inicio del mes actual)
  hasta: ISO date string (default: ahora)

200 OK
{
  "total": 8400,
  "pedidos": [
    {
      "pedidoId": "uuid",
      "fecha": "2026-05-20T14:30:00.000Z",
      "montoEnvio": 600
    }
  ]
}
```

**Notas:**
- Lista solo pedidos en estado `ENTREGADO`.
- El `montoEnvio` es el `costoEnvio` del pedido (lo que cobra el repartidor).
- Ordenado por fecha descendente.

---

## GET /api/repartidor/calificaciones

Resumen y últimas calificaciones recibidas.

```
GET /api/repartidor/calificaciones

200 OK
{
  "promedio": 4.8,
  "total": 95,
  "ultimas": [
    {
      "id": "uuid",
      "puntaje": 5,
      "comentario": "Muy rápido y amable",
      "fecha": "2026-05-19T18:00:00.000Z"
    }
  ]
}
```

Devuelve las últimas 20 calificaciones.
