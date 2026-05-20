# Requisitos backend — Secciones del perfil del cliente

> Estado: **pendiente de implementación en el backend**
> Afecta: tab "Mi perfil" del cliente

---

## Contexto

El rediseño del perfil del cliente (estilo PedidosYa) suma 4 quick actions y 2 secciones de listado. Hoy esos botones existen como placeholders pero **no tienen endpoint detrás**.

Pantalla afectada: `src/app/(cliente)/(tabs)/perfil.tsx`

---

## 1. Direcciones guardadas del cliente

El cliente debe poder guardar varias direcciones (Casa, Trabajo, etc.) y seleccionarlas al hacer pedidos en lugar de tipearlas cada vez.

### Endpoints

```
GET    /api/cliente/direcciones
POST   /api/cliente/direcciones
PATCH  /api/cliente/direcciones/:id
DELETE /api/cliente/direcciones/:id
```

### Shape de Dirección

```typescript
{
  id: string;
  alias: string;          // "Casa", "Trabajo"
  direccion: string;      // "Av. Corrientes 1234"
  piso?: string;          // "3 B"
  referencia?: string;    // "Edificio rojo, timbre 12"
  esPredeterminada: boolean;
  lat?: number;
  lng?: number;
}
```

### Modelo Prisma sugerido

```prisma
model DireccionCliente {
  id              String  @id @default(uuid())
  clienteId       String
  cliente         Cliente @relation(fields: [clienteId], references: [id])
  alias           String
  direccion       String
  piso            String?
  referencia      String?
  esPredeterminada Boolean @default(false)
  lat             Float?
  lng             Float?
  createdAt       DateTime @default(now())

  @@index([clienteId])
}
```

### Impacto en la app

- Nueva pantalla `/(cliente)/direcciones/index.tsx` con CRUD
- En `carrito.tsx` y `pedido-libre/nuevo.tsx`: selector de dirección guardada con opción "+ Nueva dirección"

---

## 2. Comercios favoritos

Permite al cliente marcar comercios como favoritos para acceso rápido.

### Endpoints

```
GET    /api/cliente/favoritos              # lista de comercios favoritos
POST   /api/cliente/favoritos/:comercioId  # agregar
DELETE /api/cliente/favoritos/:comercioId  # quitar
```

### Shape

```typescript
// GET response
{
  comercios: Comercio[]  // mismo shape que el actual
}
```

### Modelo Prisma sugerido

```prisma
model ComercioFavorito {
  clienteId  String
  comercioId String
  createdAt  DateTime @default(now())

  cliente  Cliente  @relation(fields: [clienteId], references: [id])
  comercio Comercio @relation(fields: [comercioId], references: [id])

  @@id([clienteId, comercioId])
  @@index([clienteId])
}
```

### Impacto en la app

- Nueva pantalla `/(cliente)/favoritos/index.tsx`
- En `ComercioCard`: corazón con toggle de favorito

---

## 3. Métodos de pago

El sistema actual no muestra integración con MercadoPago u otra pasarela. Si está pensado para pago en efectivo al repartidor, este endpoint puede ser opcional.

### Endpoints (si aplica)

```
GET    /api/cliente/metodos-pago
POST   /api/cliente/metodos-pago
DELETE /api/cliente/metodos-pago/:id
```

### Notas

Pendiente decidir si el flujo de pago es 100% efectivo (no requiere este endpoint) o si habrá pasarela. Si se decide pago online, hay que armar también:
- Webhook de MercadoPago para confirmar pagos
- Estado `PAGO_PENDIENTE` en el flujo del pedido

---

## 4. Actualización de datos personales

Editar nombre, teléfono y email del propio perfil.

### Endpoint

```
PATCH /api/me
Body: { nombre?: string; telefono?: string }
```

> Email se suele cambiar por flujo separado con verificación. SuperTokens tiene endpoints propios para eso (`/auth/user/email/exists`, etc.).

### Restricciones

- `telefono`: validar formato AR (mismo regex que registro)
- `nombre`: 2-100 caracteres
- No permitir cambiar `email` por este endpoint

---

## 5. Cambio de contraseña

### Endpoint

SuperTokens ya provee el flujo. La app debe:

1. Llamar a `POST /auth/user/password/reset/token` con email → recibe email con link
2. O usar el endpoint custom del backend que llame internamente al de SuperTokens

Documentar el endpoint específico que se quiera exponer.
