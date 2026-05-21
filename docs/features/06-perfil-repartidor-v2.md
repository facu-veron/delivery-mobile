# Feature: Perfil del repartidor

> Estado: **implementado**  
> Archivos clave: `src/presentation/routes/repartidor.routes.ts`, `src/presentation/controllers/repartidor.controller.ts`

---

## GET /api/repartidor/perfil

Devuelve el perfil completo con documentos y nombre de zona legible.

```
GET /api/repartidor/perfil
Authorization: sAccessToken (cookie, rol REPARTIDOR)

200 OK
{
  "id": "uuid",
  "nombre": "Carlos Sosa",
  "telefono": "3704234567",
  "vehiculo": "Moto Honda Wave 110",
  "patente": "AB123CD",
  "avatarUrl": null,
  "estado": "APROBADO",
  "disponibilidad": "DISPONIBLE",
  "zonaId": "uuid",
  "zonaNombre": "Formosa Capital",
  "calificacionProm": 4.5,
  "totalEntregas": 127,
  "documentos": [
    {
      "id": "uuid",
      "tipo": "DNI_FRENTE",
      "estado": "APROBADO",
      "motivoRechazo": null,
      "archivoUrl": "https://..."
    }
  ]
}
```

**Campos clave:**

| Campo | Descripción |
|-------|-------------|
| `estado` | `PENDIENTE_REVISION`, `APROBADO`, `RECHAZADO`, `SUSPENDIDO` |
| `disponibilidad` | `DISPONIBLE`, `NO_DISPONIBLE` |
| `zonaId` | UUID interno de la zona asignada |
| `zonaNombre` | Nombre legible de la zona — usar este para mostrar en UI |
| `calificacionProm` | Promedio de puntajes (0–5), se recalcula tras cada calificación |
| `totalEntregas` | Contador acumulado de pedidos entregados |

> `motivoRechazo` en documentos siempre está presente (null cuando no está rechazado).

---

## PATCH /api/repartidor/perfil

Actualiza vehículo, teléfono y/o nombre.

```
PATCH /api/repartidor/perfil
Content-Type: application/json
Authorization: sAccessToken (cookie, rol REPARTIDOR)

Body: (al menos un campo)
{
  "nombre": "Carlos López",
  "telefono": "3704999777",
  "vehiculo": "Bicicleta"
}

200 OK → Repartidor actualizado (mismo formato que GET)
```

**Errores posibles:**

| Status | Mensaje |
|--------|---------|
| 400 | `Debés enviar al menos un campo para actualizar` |

---

## GET /api/repartidor/documentos

Endpoint dedicado para listar los documentos con estado y motivo de rechazo.

```
GET /api/repartidor/documentos
Authorization: sAccessToken (cookie, rol REPARTIDOR)

200 OK
[
  {
    "id": "uuid",
    "tipo": "DNI_FRENTE",
    "estado": "RECHAZADO",
    "motivoRechazo": "La imagen está borrosa, subí una foto más nítida.",
    "archivoUrl": "https://..."
  },
  {
    "id": "uuid",
    "tipo": "DNI_DORSO",
    "estado": "PENDIENTE",
    "motivoRechazo": null
  }
]
```

**Tipos de documento:** `FOTO_PERSONAL`, `DNI_FRENTE`, `DNI_DORSO`, `ANTECEDENTES_PENALES`, `ANTECEDENTES_JUDICIALES`

**Estados de documento:** `PENDIENTE`, `APROBADO`, `RECHAZADO`

---

## Flujo sugerido en el frontend

```typescript
// Pantalla de perfil del repartidor
const { data: perfil } = await api.get('/api/repartidor/perfil');

// Mostrar zona
<Text>{perfil.zonaNombre || 'Sin zona asignada'}</Text>

// Mostrar estado de cuenta
const estadoLabel = {
  APROBADO: 'Cuenta activa',
  PENDIENTE_REVISION: 'En revisión',
  RECHAZADO: 'Rechazado',
  SUSPENDIDO: 'Suspendido',
};

// Documentos rechazados → mostrar motivo
perfil.documentos
  .filter(d => d.estado === 'RECHAZADO')
  .forEach(d => Alert.alert(`Documento rechazado: ${d.tipo}`, d.motivoRechazo));
```
