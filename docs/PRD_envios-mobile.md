# envios-mobile — PRD para Claude Code

**Stack:** Expo · React Native · TypeScript · Zustand  
**Rol:** App unificada para CLIENTE y REPARTIDOR — routing por rol post-login  
**Una sola app en la store**, dos experiencias completamente distintas según el rol

---

## Arquitectura de routing — por rol

El rol se determina al hacer login y persiste en `auth.store`. El root layout redirige automáticamente:

```typescript
// src/app/_layout.tsx
const { token, rol } = useAuthStore()

if (!token) return <Redirect href="/(auth)/login" />
if (rol === 'CLIENTE') return <Redirect href="/(cliente)" />
if (rol === 'REPARTIDOR') return <Redirect href="/(repartidor)" />
```

> **Las pantallas de cliente y repartidor NUNCA se mezclan.** El layout de cada grupo valida el rol. Un usuario CLIENTE no puede navegar a ninguna ruta de `(repartidor)` y viceversa. Esto es obligatorio desde el día uno.

---

## Autenticación — JWT con SecureStore

Los tokens JWT se guardan en `expo-secure-store`. **NUNCA en AsyncStorage** — AsyncStorage es texto plano, no es seguro para tokens de autenticación.

```typescript
// src/stores/auth.store.ts
interface AuthStore {
  token: string | null
  rol: 'CLIENTE' | 'REPARTIDOR' | null
  usuarioId: string | null
  nombre: string | null
  login: (credentials: LoginInput) => Promise<void>
  logout: () => Promise<void>
  cargarDesdeStorage: () => Promise<void>  // se llama al iniciar la app
}
```

El `api.client.ts` intercepta los 401 e intenta el refresh automáticamente. Si el refresh falla, hace logout.

---

## Estructura de directorios

```
envios-mobile/
├── app.json
├── .env
├── package.json
├── tsconfig.json
└── src/
    ├── app/                            ← Expo Router
    │   ├── _layout.tsx                 ← lee token + rol → redirect
    │   │
    │   ├── (auth)/
    │   │   ├── login.tsx               ← compartido ambos roles
    │   │   └── registro.tsx            ← selector de rol → formulario dinámico
    │   │
    │   ├── (cliente)/                  ← solo accesible con rol CLIENTE
    │   │   ├── _layout.tsx             ← tab navigator del cliente + valida rol
    │   │   ├── index.tsx               ← home: comercios adheridos + botón pedido libre
    │   │   ├── comercio/[id].tsx       ← catálogo del comercio + carrito
    │   │   ├── pedido-libre/nuevo.tsx  ← formulario de pedido libre
    │   │   ├── pedido/[id].tsx         ← seguimiento con polling cada 5s
    │   │   └── historial.tsx
    │   │
    │   └── (repartidor)/               ← solo accesible con rol REPARTIDOR
    │       ├── _layout.tsx             ← tab navigator del repartidor + valida rol
    │       ├── index.tsx               ← toggle disponibilidad + pedido activo
    │       ├── pedido-activo.tsx       ← detalles + acciones + botón avisar cliente
    │       ├── historial.tsx
    │       └── documentos.tsx          ← subir y ver estado de documentos
    │
    ├── domain/
    │   ├── value-objects/
    │   │   └── costo-envio.vo.ts       ← copia del VO para preview en carrito sin API
    │   └── use-cases/                  ← orquestan llamadas a la API
    │       ├── pedido/
    │       │   ├── crear-pedido-catalogo.usecase.ts
    │       │   ├── crear-pedido-libre.usecase.ts
    │       │   └── confirmar-precio.usecase.ts
    │       ├── cliente/
    │       │   └── registrar-cliente.usecase.ts
    │       └── repartidor/
    │           ├── registrar-repartidor.usecase.ts
    │           └── subir-documento.usecase.ts
    │
    ├── infrastructure/
    │   ├── api/
    │   │   ├── api.client.ts           ← fetch + JWT automático + refresh + logout
    │   │   ├── auth.api.ts
    │   │   ├── pedido.api.ts
    │   │   ├── comercio.api.ts
    │   │   └── repartidor.api.ts
    │   ├── push/
    │   │   └── push.service.ts         ← registrar token Expo, listeners
    │   └── storage/
    │       └── secure-storage.ts       ← expo-secure-store wrapper
    │
    ├── presentation/
    │   ├── components/
    │   │   ├── shared/
    │   │   │   ├── badge-estado.tsx
    │   │   │   ├── loading.tsx
    │   │   │   └── error-boundary.tsx
    │   │   ├── cliente/
    │   │   │   ├── comercio-card.tsx
    │   │   │   ├── carrito.tsx
    │   │   │   ├── pedido-libre-form.tsx
    │   │   │   └── seguimiento-pedido.tsx ← muestra estado + resultado del polling
    │   │   └── repartidor/
    │   │       ├── disponibilidad-toggle.tsx
    │   │       ├── pedido-card.tsx
    │   │       └── boton-avisar-cliente.tsx ← dispara push al cliente
    │   └── hooks/
    │       ├── useAuth.ts              ← leer store, acciones login/logout
    │       ├── useNotificaciones.ts    ← listener push: nuevo pedido, alerta cliente
    │       └── usePedidoPolling.ts     ← polling cada 5s al estado del pedido
    │
    └── stores/                         ← Zustand
        ├── auth.store.ts               ← token, rol, usuarioId, nombre
        ├── pedido.store.ts             ← pedido activo del repartidor
        └── carrito.store.ts            ← carrito del cliente (pedido CATALOGO)
```

---

## Push notifications — flujos completos

Al hacer login, se registra el push token del dispositivo en la API:

```typescript
// src/infrastructure/push/push.service.ts
async function registrarPushToken() {
  const { data: token } = await Notifications.getExpoPushTokenAsync()
  await api.patch('/usuarios/push-token', { token })
}
```

| Evento | Quién recibe | Comportamiento en la app |
|--------|-------------|--------------------------|
| Nuevo pedido disponible | Repartidor | Modal con detalles del pedido — botones Aceptar / Ignorar |
| Botón "avisar al cliente" | Cliente | Push + vibración — "Tu repartidor está en la puerta" |
| Pedido en camino | Cliente | Actualiza estado en pantalla de seguimiento |
| Sin repartidor (timeout 5min) | Cliente | Notifica que nadie tomó el pedido, ofrece reintentar |

```typescript
// Listener de notificaciones con la app abierta
Notifications.addNotificationReceivedListener(notif => {
  const { tipo, pedidoId } = notif.request.content.data
  if (tipo === 'NUEVO_PEDIDO') pedidoStore.mostrarModal(pedidoId)
  if (tipo === 'AVISAR_CLIENTE') Haptics.notificationAsync('warning')
})
```

---

## Polling del estado del pedido

React Native no tiene `EventSource` nativo. Para el MVP se usa polling cada 5 segundos. Es simple, confiable, y fácil de reemplazar por WebSocket en el futuro.

```typescript
// src/presentation/hooks/usePedidoPolling.ts
export function usePedidoPolling(pedidoId: string) {
  const [pedido, setPedido] = useState(null)

  useEffect(() => {
    const intervalo = setInterval(async () => {
      const data = await pedidoApi.getEstado(pedidoId)
      setPedido(data)
      // Dejar de hacer polling cuando el pedido termina
      if (['ENTREGADO', 'CANCELADO', 'CANCELADO_PRECIO'].includes(data.estado)) {
        clearInterval(intervalo)
      }
    }, 5000)
    return () => clearInterval(intervalo)
  }, [pedidoId])

  return pedido
}
```

---

## Flujo del pedido libre — desde la app

El cliente puede pedir en cualquier comercio de la ciudad, esté o no adherido a la plataforma:

| # | Actor | Acción |
|---|-------|--------|
| 1 | Cliente | Toca "Pedido libre" en el home |
| 2 | Cliente | Completa: nombre del local, dirección del local, descripción del producto, precio estimado, instrucción si no hay stock |
| 3 | App | Muestra el costo de envío estimado usando `CostoEnvio.calcular(precioEstimado)` — sin llamar a la API |
| 4 | Cliente | Confirma el pedido |
| 5 | Sistema | Notifica repartidores disponibles — timeout 5 min |
| 6 | Repartidor | Ve la notificación, acepta, ve dirección y descripción |
| 7 | Repartidor | Llega al local, ve el precio real, lo ingresa → "Confirmar precio" |
| 8 | Sistema | Recalcula costo de envío con precio real, notifica al cliente el total definitivo |
| 9 | Repartidor | Paga el producto, toca "En camino" |
| 10 | Repartidor | Si nadie contesta al llegar, toca "Avisar al cliente" → push al cliente |
| 11 | Cliente | Paga en mano: monto del producto confirmado + costo de envío real |

---

## Flujo del pedido de catálogo — desde la app

| # | Actor | Acción |
|---|-------|--------|
| 1 | Cliente | Elige un comercio adherido del home |
| 2 | Cliente | Ve el catálogo con precios reales del comercio |
| 3 | Cliente | Agrega productos al carrito — el costo de envío se calcula en tiempo real en el carrito |
| 4 | Cliente | Confirma el pedido |
| 5 | Comercio | Recibe notificación push — acepta o rechaza desde la web |
| 6 | Comercio | Actualiza estado (en preparación → listo) desde la web |
| 7 | Sistema | Busca repartidor — mismo mecanismo que pedido libre |
| 8 | Repartidor | Acepta, va al local, paga el precio del catálogo, entrega |
| 9 | Cliente | Paga en mano al repartidor |

---

## Pantalla del repartidor — pedido activo

Cuando el repartidor tiene un pedido asignado, `index.tsx` muestra `pedido-activo.tsx` con:

- Dirección del local (donde retirar)
- Descripción del producto (pedido LIBRE) o lista de items (pedido CATALOGO)
- Monto a adelantar en el local
- Monto total a cobrar al cliente
- Botón "Confirmar precio real" (solo pedido LIBRE, en estado ASIGNADO)
- Botón "Ya retiré del local" → `PATCH /pedidos/:id/en-camino`
- Botón "Entregué el pedido" → `PATCH /pedidos/:id/entregar`
- Botón "Avisar al cliente" → `POST /pedidos/:id/avisar-cliente` (para cuando no contesta)

---

## Registro de repartidor — documentos obligatorios

El repartidor sube 5 documentos desde `documentos.tsx`. Hasta que el admin los apruebe, no puede recibir pedidos:

| Documento | Estado en la app |
|-----------|-----------------|
| Foto personal (selfie) | Pendiente / Aprobado / Rechazado |
| DNI frente | Pendiente / Aprobado / Rechazado |
| DNI dorso | Pendiente / Aprobado / Rechazado |
| Antecedentes penales | Pendiente / Aprobado / Rechazado |
| Antecedentes judiciales | Pendiente / Aprobado / Rechazado |

Si algún documento es rechazado, se muestra el motivo y el repartidor puede subirlo nuevamente.

---

## Variables de entorno

```env
EXPO_PUBLIC_API_URL=http://localhost:4000
# En producción:
# EXPO_PUBLIC_API_URL=https://api.tudominio.com
```

---

## Lo que NO hace este proyecto en el MVP

- No tiene geolocalización activa (las coordenadas están en el schema para el futuro)
- No procesa pagos (el pago es en mano, directo al repartidor)
- No usa SSE (usa polling — SSE nativo en React Native requiere polyfill)
- No permite al cliente acceder al panel de comercio o admin (eso es `envios-web`)
