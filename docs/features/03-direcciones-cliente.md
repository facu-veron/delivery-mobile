# Feature: Direcciones guardadas del cliente

> Estado: **implementado**  
> Archivos clave: `src/presentation/routes/cliente.routes.ts`, `src/presentation/controllers/cliente.controller.ts`, `src/domain/use-cases/cliente/gestionar-direcciones.usecase.ts`

---

## Endpoints

Todos requieren `CLIENTE` autenticado.

### GET /api/cliente/direcciones

Lista todas las direcciones guardadas.

```
GET /api/cliente/direcciones

200 OK
[
  {
    "id": "uuid",
    "clienteId": "uuid",
    "alias": "Casa",
    "calle": "Av. Corrientes",
    "numero": "1234",
    "barrio": "Centro",
    "referencia": "Portón azul, timbre 2B",
    "latitud": -26.1842,
    "longitud": -58.1741,
    "esPrincipal": true
  }
]
```

### POST /api/cliente/direcciones

Crea una nueva dirección.

```
POST /api/cliente/direcciones
Content-Type: application/json

Body:
{
  "alias": "Casa",           // requerido
  "calle": "Av. Corrientes", // requerido
  "numero": "1234",          // requerido
  "barrio": "Centro",        // opcional
  "referencia": "...",       // opcional
  "latitud": -26.18,         // opcional
  "longitud": -58.17,        // opcional
  "esPrincipal": true        // opcional — desplaza la anterior principal
}

201 Created → DireccionCliente
```

> Si se envía `esPrincipal: true`, las otras direcciones del cliente se marcan automáticamente como no-principales.

### PATCH /api/cliente/direcciones/:id

Actualiza campos de una dirección existente.

```
PATCH /api/cliente/direcciones/:id
Content-Type: application/json

Body: (al menos un campo)
{
  "alias": "Trabajo",
  "esPrincipal": true
}

200 OK → DireccionCliente actualizada
404 Not Found → si el id no pertenece al cliente
```

### DELETE /api/cliente/direcciones/:id

Elimina una dirección.

```
DELETE /api/cliente/direcciones/:id

204 No Content
404 Not Found → si el id no pertenece al cliente
```

---

## Uso en el flujo de pedido

Al crear un pedido (catálogo o libre), el campo `direccionEntregaId` debe ser el `id` de una de las direcciones guardadas. El frontend puede mostrar el selector de dirección guardada en el carrito y al crear un pedido libre.

El modelo `DireccionCliente` está directamente relacionado a `Pedido.direccionEntregaId`.
