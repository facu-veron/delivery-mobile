# Arquitectura Frontend — DeliverYa Mobile

> Actualizado: 2026-05-20  
> Cubre decisiones y patrones establecidos en los Bloques 1–5.

---

## Estructura de directorios relevante

```
src/
├── app/                          # Expo Router — file-based routing
│   ├── (auth)/                   # login, registro (sin guards)
│   ├── (cliente)/                # role-gated — guard en _layout.tsx
│   │   ├── (tabs)/               # tab navigator del cliente
│   │   ├── ayuda.tsx             # re-export de shared/screens/AyudaScreen
│   │   ├── notificaciones.tsx    # re-export de shared/screens/NotificacionesScreen
│   │   ├── editar-perfil.tsx     # re-export de features/auth/screens/EditarPerfilScreen
│   │   ├── direcciones.tsx       # pantalla propia (CRUD addresses)
│   │   └── favoritos.tsx         # pantalla propia (lista de favoritos)
│   └── (repartidor)/             # role-gated — guard en _layout.tsx
│       ├── (tabs)/               # tab navigator del repartidor
│       ├── ayuda.tsx             # re-export de shared/screens/AyudaScreen
│       ├── notificaciones.tsx    # re-export de shared/screens/NotificacionesScreen
│       ├── editar-perfil.tsx     # re-export de features/auth/screens/EditarPerfilScreen
│       ├── ganancias.tsx         # pantalla propia (estadísticas + detalle ganancias)
│       └── documentos.tsx        # pantalla propia (upload de documentos)
│
├── features/
│   ├── auth/
│   │   ├── api/          me.api.ts
│   │   ├── hooks/        useMe, useActualizarMe, useSubirAvatar, useLogin, useLogout, useSession
│   │   ├── schemas/      editar-perfil.schema.ts
│   │   ├── screens/      EditarPerfilScreen.tsx  ← pantalla compartida
│   │   └── store/        auth.store.ts
│   ├── cliente/
│   │   ├── api/          cliente.api.ts
│   │   ├── components/   ComercioCard, ProductoCard, DireccionSelector
│   │   ├── hooks/        useComercios, useComercio, useDirecciones, useFavoritos,
│   │   │                 useCalificarPedido, usePedidosActivos, useHistorialCliente,
│   │   │                 useCrearPedidoLibre, useCrearPedidoCatalogo
│   │   ├── schemas/      pedido-libre.schema.ts
│   │   └── store/        carrito.store.ts
│   ├── repartidor/
│   │   ├── api/          repartidor.api.ts
│   │   ├── components/   DisponibilidadSwitch
│   │   └── hooks/        usePerfil, usePedidoActivo, usePedidosDisponibles,
│   │                     useHistorialRepartidor, useEstadisticas, useGanancias,
│   │                     useSubirDocumento, useActualizarPerfil
│   └── pedidos/
│       ├── api/          pedidos.api.ts
│       ├── components/   AccionesPedido, EstadoBadge, ConfirmarPrecioForm
│       ├── hooks/        usePedidoDetalle, useAccionesPedido
│       └── utils/        transiciones-estado.ts
│
└── shared/
    ├── api/              client.ts (Axios+SuperTokens), notificaciones.api.ts, ayuda.api.ts
    ├── components/       Button, Card, Badge, Input, Avatar, LoadingSpinner, ErrorMessage,
    │                     EmptyState, Skeleton, ScreenHeader
    │   └── profile/      ProfileQuickAction, ProfileListItem, ProfileSection
    ├── hooks/            useNotificaciones, useNoLeidas, useMarcarTodasLeidas,
    │                     usePedidoSSE, useFaqs, useEnviarContacto
    ├── lib/              formatters.ts, costo-envio.ts
    ├── screens/          NotificacionesScreen.tsx, AyudaScreen.tsx  ← shared screens
    └── types/            pedido.types.ts, comercio.types.ts
```

---

## Patrones clave

### 1. Guards de rol con re-export de pantallas

Las pantallas compartidas entre roles viven en `src/features/.../screens/` o `src/shared/screens/` y se re-exportan desde cada route group:

```typescript
// src/app/(cliente)/editar-perfil.tsx
export { EditarPerfilScreen as default } from '@/features/auth/screens/EditarPerfilScreen';

// src/app/(repartidor)/editar-perfil.tsx
export { EditarPerfilScreen as default } from '@/features/auth/screens/EditarPerfilScreen';
```

Esto garantiza que los guards de `_layout.tsx` de cada group se aplican sin duplicar código de la pantalla.

### 2. Hidratación del store en group layouts

`useMe()` se llama en ambos `_layout.tsx` para hidratar el `authStore` con datos frescos del servidor (avatarUrl, telefono) cada vez que el usuario entra al group:

```typescript
// (cliente)/_layout.tsx y (repartidor)/_layout.tsx
const { data } = useMe();
useEffect(() => {
  if (data) setPerfil({ nombre: data.perfil.nombre, telefono: data.perfil.telefono, avatarUrl: data.perfil.avatarUrl });
}, [data]);
```

### 3. Polling con auto-stop en estados terminales

Los hooks de pedido detienen el polling cuando el pedido llega a un estado terminal (ENTREGADO, CANCELADO, CANCELADO_PRECIO):

```typescript
refetchInterval: (query) => {
  const estado = query.state.data?.estado;
  if (!estado || esPedidoTerminado(estado)) return false;
  return 5_000;
},
```

### 4. SSE + polling como fallback

`usePedidoSSE` abre una conexión EventSource con el token de SuperTokens. Si falla, se cierra silenciosamente y el polling del hook base continúa como fallback sin que el usuario note la diferencia:

```typescript
usePedidoSSE(id, { queryKey: ['pedido', id], estado: pedido?.estado });
// El polling de usePedidoDetalle sigue activo como fallback
```

### 5. DireccionSelector como UX enhancement (no reemplazo)

El `DireccionSelector` muestra chips con direcciones guardadas que **pre-rellenan** el campo de texto libre — no lo reemplaza. El campo sigue siendo editable. Esto permite que el flujo funcione incluso sin direcciones guardadas.

### 6. Calificación idempotente

El widget de calificación maneja el error 400 "ya calificado" mostrando el estado readonly de agradecimiento, lo que hace que sea seguro reabrir la pantalla de un pedido entregado sin romper la UX.

---

## Tipos compartidos importantes

```typescript
// pedido.types.ts — selección de los más usados

enum DisponibilidadRepartidor { DISPONIBLE, NO_DISPONIBLE, EN_PEDIDO }
enum EstadoAprobacion { PENDIENTE, APROBADO, RECHAZADO }
enum TipoDocumento { FOTO_PERSONAL, DNI_FRENTE, DNI_DORSO, ANTECEDENTES_PENALES, ANTECEDENTES_JUDICIALES }
enum TipoNotificacion { NUEVO_PEDIDO, AVISAR_CLIENTE, DOCUMENTO_APROBADO, DOCUMENTO_RECHAZADO, PEDIDO_ENTREGADO, PEDIDO_CANCELADO, SISTEMA }

interface Repartidor {
  disponibilidad: DisponibilidadRepartidor;  // NO disponible: boolean
  estado: EstadoAprobacion;
  avatarUrl: string | null;
  calificacionProm: number;
  totalEntregas: number;
  documentos: DocumentoRepartidor[];
}

interface DocumentoRepartidor {
  tipo: TipoDocumento;          // NO key: string
  archivoUrl?: string;          // NO url
  motivoRechazo: string | null; // siempre presente (null cuando no aplica)
}

interface Pedido {
  calificado?: boolean;         // para saber si mostrar el widget
}

interface DireccionCliente {
  id, clienteId, alias, calle, numero, barrio?, referencia?, esPrincipal
}

interface NotificacionesResponse {
  total: number;
  noLeidas: number;
  items: Notificacion[];
}
```

---

## Flujos de autenticación

| Evento | Acción |
|--------|--------|
| Login exitoso | `useLogin` → guarda token SuperTokens → redirect por rol |
| Login fallido (401) | Mensaje "Credenciales incorrectas" — diferenciado de error de red |
| Token vencido | Axios interceptor de SuperTokens hace refresh automático |
| SSE auth | `SuperTokens.getAccessToken()` → `Authorization: Bearer <token>` en header |
| Logout | `useLogout` → `SuperTokens.signOut()` → redirect a login |

---

## Estado pendiente / no implementado

Ver `docs/requirements/pendientes-backend.md` para la lista completa. En resumen:

| Feature | Estado |
|---------|--------|
| Zona nombre legible (repartidor) | Pendiente — backend devuelve `zonaId` UUID |
| Cambiar contraseña | Pendiente — requiere definir flujo SuperTokens |
| Métodos de pago | Pendiente — sin definición del backend |
| `direccionEntregaId` vs `clienteDireccion` | Pendiente confirmación del contrato |
| Calificaciones recibidas (lista repartidor) | Sin endpoint GET en backend |
| Notificaciones in-app automáticas | Backend no crea registros al enviar push (futuro) |
