# Feature: Perfil del repartidor

> Estado: **implementado**  
> Archivos clave: `src/presentation/routes/repartidor.routes.ts`, `src/presentation/controllers/repartidor.controller.ts`

---

## GET /api/repartidor/perfil

Devuelve el perfil completo con documentos.

```
GET /api/repartidor/perfil

200 OK
{
  "id": "uuid",
  "nombre": "Carlos López",
  "telefono": "3704555666",
  "vehiculo": "Moto",
  "patente": "ABC123",
  "avatarUrl": null,
  "estado": "APROBADO",
  "disponibilidad": "DISPONIBLE",
  "zonaId": "uuid",
  "calificacionProm": 4.5,
  "totalEntregas": 127,
  "documentos": [
    {
      "tipo": "DNI_FRENTE",
      "estado": "APROBADO",
      "motivoRechazo": null,
      "archivoUrl": "https://..."
    }
  ]
}
```

> `motivoRechazo` siempre está presente (null cuando no está rechazado).

---

## PATCH /api/repartidor/perfil

Actualiza vehículo, teléfono y/o nombre.

```
PATCH /api/repartidor/perfil
Content-Type: application/json

Body: (al menos un campo)
{
  "nombre": "Carlos López",
  "telefono": "3704999777",
  "vehiculo": "Bicicleta"
}

200 OK → Repartidor actualizado
```

---

## GET /api/repartidor/documentos

Endpoint dedicado para listar los documentos con estado y motivo de rechazo.

```
GET /api/repartidor/documentos

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
    "tipo": "DNI_DORSO",
    "estado": "PENDIENTE",
    "motivoRechazo": null
  }
]
```

Tipos de documento: `FOTO_PERSONAL`, `DNI_FRENTE`, `DNI_DORSO`, `ANTECEDENTES_PENALES`, `ANTECEDENTES_JUDICIALES`
