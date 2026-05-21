# Feature: Crear pedido — soporte de dirección como texto libre

> Estado: **implementado**  
> Archivos clave: `src/presentation/validators/pedido.validator.ts`, `src/presentation/controllers/pedido.controller.ts`

---

## Contexto

Al crear un pedido (`POST /api/pedidos/catalogo` o `POST /api/pedidos/libre`), el campo de dirección de entrega ahora acepta dos formatos alternativos:

| Campo | Tipo | Cuándo usarlo |
|-------|------|---------------|
| `direccionEntregaId` | UUID string | El cliente tiene la dirección guardada en su perfil |
| `clienteDireccion` | string (mín 5 chars) | El cliente tipea una dirección libre en el momento |

**Solo se necesita uno de los dos.** Si se mandan ambos, prevalece `direccionEntregaId`.

---

## POST /api/pedidos/catalogo

### Con dirección guardada (recomendado)

```
POST /api/pedidos/catalogo
Content-Type: application/json

Body:
{
  "comercioId": "uuid",
  "direccionEntregaId": "uuid-de-direccion-guardada",
  "items": [
    { "productoId": "uuid", "cantidad": 2 }
  ],
  "notasCliente": "Sin cebolla"
}
```

### Con dirección libre (sin guardar)

```
POST /api/pedidos/catalogo
Content-Type: application/json

Body:
{
  "comercioId": "uuid",
  "clienteDireccion": "Av. 25 de Mayo 1234, barrio Centro",
  "items": [
    { "productoId": "uuid", "cantidad": 1 }
  ]
}
```

**Qué hace el backend cuando recibe `clienteDireccion`:**
1. Crea una `DireccionCliente` automáticamente con `alias: "Dirección de entrega"` y `numero: "S/N"`
2. Usa el ID de esa nueva dirección para el pedido
3. La dirección queda guardada en el historial de direcciones del cliente

---

## POST /api/pedidos/libre

Misma lógica. Ambos campos son opcionales en el body, pero al menos uno debe estar presente.

### Con dirección guardada

```
POST /api/pedidos/libre
Content-Type: application/json

Body:
{
  "direccionEntregaId": "uuid",
  "nombreLocalLibre": "Farmacia del Centro",
  "direccionLocalLibre": "San Martín 456",
  "descripcionLibre": "Paracetamol 500mg x20",
  "precioEstimadoCliente": 450
}
```

### Con dirección libre

```
POST /api/pedidos/libre
Content-Type: application/json

Body:
{
  "clienteDireccion": "Calle Belgrano 890, Los Soldados",
  "nombreLocalLibre": "Kiosco esquina",
  "direccionLocalLibre": "Av. 25 de Mayo y San Martín",
  "descripcionLibre": "Gaseosa 2.25L Coca-Cola",
  "precioEstimadoCliente": 1500
}
```

---

## Errores posibles

| Status | Mensaje |
|--------|---------|
| 400 | `Debés enviar direccionEntregaId o clienteDireccion` |
| 400 | `La dirección debe tener al menos 5 caracteres` (si `clienteDireccion` es muy corto) |
| 400 | `direccionEntregaId inválido` (si el UUID tiene formato incorrecto) |

---

## Flujo sugerido en el frontend

```typescript
// En la pantalla de selección de dirección al crear pedido

const crearPedido = async () => {
  const body: any = {
    comercioId,
    items,
  };

  if (direccionSeleccionada) {
    // Usuario eligió una dirección guardada
    body.direccionEntregaId = direccionSeleccionada.id;
  } else if (textoDireccionLibre) {
    // Usuario escribió la dirección a mano
    body.clienteDireccion = textoDireccionLibre;
  }

  await api.post('/api/pedidos/catalogo', body);
};
```

---

## Relación con el módulo de Direcciones

Las direcciones creadas automáticamente vía `clienteDireccion` aparecen en `GET /api/cliente/direcciones`. El cliente puede verlas, editarlas y reutilizarlas en pedidos futuros como `direccionEntregaId`.

Ver también: [Direcciones del cliente](./03-direcciones-cliente.md)
