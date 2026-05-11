# App Móvil del Repartidor — Documento de arquitectura (decisión consolidada)

**Estado:** 📐 Diseño aprobado — pendiente de implementación
**Fecha:** 2026-05-11
**Repo:** separado (`delivery-mobile`), consume el backend `delivery-api` vía API REST.

> Este documento vive en el repo del backend como referencia del contrato. La implementación va en su propio repositorio.

---

## 1. Decisiones de arquitectura

| # | Tema | Decisión MVP | Backlog futuro |
|---|------|--------------|----------------|
| 1 | Repositorio | **Repo separado**. Comunicación 100% vía API REST. Tipos/enums del backend se replican manualmente en `src/shared/types/`. | Migrar a monorepo (pnpm workspaces / Turborepo) + paquete `shared/` con schemas Zod si crece el alcance. |
| 2 | Offline-first | **No.** Requiere conexión. | MMKV + `@tanstack/query-async-storage-persister` + cola de mutaciones. |
| 3 | Mapas / geolocalización | **No.** | `expo-location` (tracking del repartidor) + `react-native-maps` (ruta a comercio/cliente). |
| 4 | Distribución | **EAS Build** desde el día 1: *development build* para desarrollo + *Internal Distribution* para producción. Sin stores. ⚠️ Las push notifications **requieren** development build (no funcionan en Expo Go), por eso EAS se configura al inicio. | Publicación en Play Store / App Store. |
| 5 | Versionado forzado | **No.** | Endpoint `GET /api/version` + chequeo de versión mínima al arrancar la app. |

---

## 2. Stack final

### Núcleo (confirmado del stack propuesto)

| Herramienta | Versión objetivo | Rol |
|-------------|------------------|-----|
| **Expo (React Native)** | **SDK 55** (RN 0.83, React 19.2) | Runtime. Coincide con `expo-server-sdk` que ya usa el backend para push. ⚠️ SDK 55 eliminó la Legacy Architecture: **solo New Architecture** (ya no existe el flag `newArchEnabled`). Min iOS 15.1, Xcode 26+, edge-to-edge obligatorio en Android 16+. |
| **Expo Router** | el que venga con SDK 55 (file-based) | Navegación tipo Next.js. Reemplaza React Navigation manual. La plantilla por defecto de SDK 55 ya trae Expo Router + estructura `/src` + Native Tabs API — alineado con lo que proponemos acá. |
| **TanStack Query** | v5 | **Único dueño del estado del servidor.** `refetchInterval` para pedidos-disponibles, invalidaciones tras mutar, optimistic updates en `tomar`. |
| **Axios** | latest | Cliente HTTP. Los interceptores de refresh los registra `supertokens-react-native`, no a mano. |
| **Zod** | v3 | Validación de forms y de variables de entorno. Define también los tipos (`z.infer`). |
| **Zustand** | v5 | **Solo estado de cliente**: sesión cacheada en memoria, estado UI del switch de disponibilidad, theme. Nunca cachea respuestas del servidor. |
| **React Hook Form** | v7 | Forms (login, registro, confirmar-precio). |
| **@hookform/resolvers** | latest | Puente RHF ↔ Zod (`zodResolver`). |
| **NativeWind** | **v4 + Tailwind v3.4.17** (recomendado para el MVP) | Estilos. Ver nota abajo sobre v5. |

> **NativeWind v4 vs v5 — recomendación:** NativeWind v5 (que usa Tailwind v4 con config CSS-first, P3 colors, CSS variables y animaciones) sigue en **pre-release / no recomendado para producción** a la fecha de este documento — su tooling (PostCSS, Metro, Tailwind v4) aún está cambiando. Para el MVP arrancamos con **NativeWind v4 + Tailwind v3.4** (estable, plugin de Babel maduro) y dejamos anotada la migración a v5 cuando llegue a estable. Si igual querés arrancar en v5 desde ya, el setup cambia: no hay `tailwind.config.js`, la config va en el CSS global, y hay que seguir la guía de migración oficial. Confirmar versión vigente antes de iniciar (`https://www.nativewind.dev/v5`).

### Adiciones críticas (sin esto la app no funciona)

| Paquete | Por qué es obligatorio |
|---------|------------------------|
| **supertokens-react-native** | SuperTokens en RN usa **headers, no cookies**. Este SDK registra los interceptores en Axios que manejan el refresh token automático. Sin él, la sesión expira y no se renueva. |
| **expo-notifications** + **expo-device** | Obtener el Expo push token y manejar notificaciones en foreground/background. El token se manda con `PATCH /api/repartidor/push-token`. |
| **react-native-sse** | El endpoint `GET /api/pedidos/:id/estado` es **SSE**. RN no trae `EventSource` nativo. |
| **react-native-safe-area-context** + **react-native-reanimated** | Peer deps de Expo Router / NativeWind. Reanimated también lo pide NativeWind v4+. |
| **expo-secure-store** | Almacenamiento seguro de cualquier secreto adicional (p. ej. flags). Nota: `supertokens-react-native` gestiona su propio almacenamiento de tokens internamente; no hace falta guardarlos a mano. |

### Opcionales / fuera de MVP (no instalar todavía)

`expo-location`, `react-native-maps`, `react-native-mmkv`, `@tanstack/query-async-storage-persister`.

---

## 3. Endpoints del backend que consume la app

| Endpoint | Pantalla / uso |
|----------|----------------|
| `POST /auth/signin` · `POST /api/registro/repartidor` | Login y registro. |
| `GET /auth/signout` | Logout. |
| `GET /api/repartidor/perfil` | Pantalla "Mi perfil". |
| `PATCH /api/repartidor/disponibilidad` | Switch principal "Estoy disponible" (optimista). |
| `PATCH /api/repartidor/push-token` | Al obtener el token de Expo (en login y al refrescar). |
| `GET /api/repartidor/pedidos-disponibles` | Lista principal (pull-to-refresh + `refetchInterval`). |
| `PATCH /api/pedidos/:id/tomar` | Acción crítica — maneja `409 Conflict` por concurrencia. |
| `PATCH /api/pedidos/:id/confirmar-precio` | Solo pedidos **LIBRE**. |
| `PATCH /api/pedidos/:id/en-camino` | Transición de estado. |
| `PATCH /api/pedidos/:id/entregar` | Cierre del flujo. |
| `POST /api/pedidos/:id/avisar-cliente` | Push "estoy en la puerta". |
| `GET /api/pedidos/:id/estado` (SSE) | Stream de cambios del pedido activo. |

**Auth:** SuperTokens. El access token ya inyecta `{ usuarioId, rol, perfilId }` en el payload de la sesión; la app lee el rol para guardas de navegación.

---

## 4. Arquitectura — Feature-First con capas internas

**No** se replica Clean Architecture estricta del backend. En mobile, abstraer entidades de dominio + use cases + repositorios infla boilerplate sin ganancia: el "dominio" del repartidor es fino (no calcula tarifa, solo la muestra; no decide quién toma un pedido, solo dispara el endpoint). Lo "limpio" se respeta en la **dirección de dependencias**, no en la cantidad de capas:

```
UI (app/)  →  hooks (features/*/hooks)  →  api (features/*/api)  →  schemas/types
```

### Estructura de carpetas

```
delivery-mobile/
├── app/                              # Expo Router (rutas)
│   ├── _layout.tsx                   # Providers globales (QueryClient, Auth, SafeArea)
│   ├── index.tsx                     # Decide auth → redirige a (auth) o (app)
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── registro.tsx
│   └── (app)/                        # Requiere sesión
│       ├── _layout.tsx               # Guard: sesión válida + rol === REPARTIDOR
│       ├── (tabs)/
│       │   ├── _layout.tsx           # Tabs principales
│       │   ├── disponibles.tsx       # Lista de pedidos disponibles
│       │   ├── activo.tsx            # Pedido en curso (si hay)
│       │   ├── historial.tsx
│       │   └── perfil.tsx
│       └── pedido/
│           └── [id].tsx              # Detalle + acciones de estado + stream SSE
│
├── src/
│   ├── features/                     # Una carpeta por contexto
│   │   ├── auth/
│   │   │   ├── api/auth.api.ts        # signIn, signOut
│   │   │   ├── hooks/
│   │   │   │   ├── useLogin.ts         # useMutation
│   │   │   │   ├── useLogout.ts
│   │   │   │   └── useSession.ts       # estado de sesión (SuperTokens + store)
│   │   │   ├── schemas/login.schema.ts
│   │   │   ├── store/auth.store.ts     # zustand: { usuario, rol, perfilId }
│   │   │   └── components/LoginForm.tsx
│   │   │
│   │   ├── repartidor/
│   │   │   ├── api/repartidor.api.ts
│   │   │   ├── hooks/
│   │   │   │   ├── usePerfil.ts
│   │   │   │   ├── useCambiarDisponibilidad.ts   # optimista + rollback
│   │   │   │   └── useActualizarPushToken.ts
│   │   │   ├── schemas/
│   │   │   ├── store/disponibilidad.store.ts     # estado UI del switch
│   │   │   └── components/DisponibilidadSwitch.tsx
│   │   │
│   │   ├── pedidos/
│   │   │   ├── api/pedidos.api.ts
│   │   │   ├── hooks/
│   │   │   │   ├── usePedidosDisponibles.ts       # refetchInterval ~10s
│   │   │   │   ├── usePedidoDetalle.ts
│   │   │   │   ├── usePedidoEstadoStream.ts        # react-native-sse
│   │   │   │   ├── useTomarPedido.ts               # maneja 409
│   │   │   │   ├── useConfirmarPrecio.ts
│   │   │   │   ├── useMarcarEnCamino.ts
│   │   │   │   ├── useEntregarPedido.ts
│   │   │   │   └── useAvisarCliente.ts
│   │   │   ├── schemas/
│   │   │   ├── components/
│   │   │   │   ├── PedidoCard.tsx
│   │   │   │   ├── EstadoBadge.tsx
│   │   │   │   ├── AccionesPedido.tsx              # botones según estado
│   │   │   │   └── ConfirmarPrecioForm.tsx
│   │   │   └── utils/transiciones-estado.ts        # qué acción mostrar por estado
│   │   │
│   │   └── notificaciones/
│   │       ├── hooks/usePushRegistration.ts
│   │       └── services/notification.service.ts
│   │
│   ├── shared/                       # Reutilizable entre features
│   │   ├── api/
│   │   │   ├── client.ts              # axios + SuperTokens.addAxiosInterceptors
│   │   │   ├── errors.ts              # mapeo de 401 / 403 / 409 a errores tipados
│   │   │   └── query-client.ts        # QueryClient configurado
│   │   ├── components/                # UI primitivos (Button, Card, Toast)
│   │   ├── hooks/                     # useDebounce, useRefreshOnFocus
│   │   ├── lib/                       # formatters (moneda ARS, fecha)
│   │   ├── theme/                     # colors, fonts, nativewind preset
│   │   └── types/
│   │       └── pedido.types.ts        # enums espejo del backend (EstadoPedido, TipoPedido, RolUsuario...)
│   │
│   └── config/
│       ├── env.ts                    # validación con Zod de env vars (API_URL, ...)
│       └── constants.ts              # URLs, timeouts, polling intervals
│
├── assets/                           # imágenes, fuentes
├── app.json                          # bundler "metro" para web; config EAS
├── eas.json                          # perfiles: development / preview / production
├── babel.config.js                   # babel-preset-expo + nativewind/babel
├── metro.config.js                   # withNativeWind
├── global.css                        # @tailwind base/components/utilities
├── tailwind.config.js                # content paths + nativewind/preset (v4)
├── tsconfig.json
└── package.json
```

### Reglas de dependencia (la parte "limpia")

1. `app/` solo importa de `src/features/*` y `src/shared/*` — **nunca llama a axios directo**.
2. `features/*/hooks/` son la **única vía** de acceso a datos desde la UI (envuelven TanStack Query/Mutation).
3. `features/*/api/` son las **únicas** que importan el `client` de Axios.
4. `features/*/schemas/` definen validación **y** tipos (`z.infer<typeof ...>`).
5. **Una feature no importa de otra feature** — si necesitan algo común, va a `shared/`.
6. Los stores de **Zustand solo guardan estado de cliente**; nunca cachean respuestas (eso es trabajo de TanStack).

---

## 5. Flujos críticos

### 5.1 Autenticación y refresh
- `client.ts` crea el axios y llama `SuperTokens.addAxiosInterceptors(client)` una sola vez.
- `SuperTokens.init({ apiDomain, apiBasePath })` se ejecuta en el bootstrap de la app (en `app/_layout.tsx` o un módulo importado por él).
- `useSession` consulta `Session.doesSessionExist()` y, si existe, lee el payload (`usuarioId`, `rol`, `perfilId`) para hidratar `auth.store`.
- Guard en `app/(app)/_layout.tsx`: si no hay sesión → `redirect` a `(auth)/login`; si el rol ≠ `REPARTIDOR` → pantalla de error / logout.
- `401` desde el backend: el interceptor de SuperTokens intenta refresh; si falla → limpiar store + `redirect` a login.

### 5.2 Push notifications
- Al completar login (y al volver al foreground si cambió): `usePushRegistration` →
  1. `expo-device` confirma que es dispositivo físico.
  2. Pide permisos con `expo-notifications`.
  3. Obtiene el Expo push token (`getExpoPushTokenAsync` con `projectId` de EAS).
  4. `useActualizarPushToken` lo manda con `PATCH /api/repartidor/push-token`.
- Handler de notificaciones en foreground para mostrar in-app cuando llega "nuevo pedido disponible" o "el cliente te respondió".
- ⚠️ Requiere *development build* — no funciona en Expo Go.

### 5.3 Lista de pedidos disponibles
- `usePedidosDisponibles`: `useQuery` con `refetchInterval` (~10 s) **solo si** el repartidor está `DISPONIBLE` (si no, `refetchInterval: false`).
- Pull-to-refresh → `refetch()`.
- El backend ya filtra por estado (`BUSCANDO_REPARTIDOR` / `LISTO_PARA_RETIRAR` con `busquedaExpiraEn` futura) y exige repartidor `APROBADO` + `DISPONIBLE`.

### 5.4 Tomar un pedido (concurrencia → 409)
- `useTomarPedido` (`useMutation`):
  - `onMutate`: opcional, marcar la card como "tomando…".
  - `onSuccess`: invalidar `pedidos-disponibles`, navegar a `pedido/[id]` o a la tab `activo`.
  - `onError` con status `409`: invalidar `pedidos-disponibles`, toast *"Otro repartidor lo tomó"*, quedarse en la lista (ya refrescada).
  - Otros errores: toast genérico + retry manual.

### 5.5 Stream del estado del pedido activo (SSE)
- `usePedidoEstadoStream(id)`: abre `EventSource` de `react-native-sse` contra `GET /api/pedidos/:id/estado` mientras la pantalla está montada; cierra en `unmount`.
- Cada evento de cambio de estado → `queryClient.invalidateQueries(['pedido', id])` (y `historial` si pasó a `ENTREGADO`).
- Reconexión: la lib reintenta; si se cae del todo, fallback a un `refetch` manual.

### 5.6 Disponibilidad (switch optimista)
- `useCambiarDisponibilidad`: `onMutate` actualiza `disponibilidad.store` (UI inmediata); `onError` → rollback al valor anterior + toast; `onSettled` → invalidar `perfil`.
- El backend rechaza el cambio si el repartidor está `EN_PEDIDO` o no `APROBADO` → mostrar el motivo.

### 5.7 Acciones por estado del pedido
- `transiciones-estado.ts` mapea `EstadoPedido` → array de acciones disponibles. `AccionesPedido` renderiza los botones correspondientes:
  - **CATALOGO** (lo que ve el repartidor): `ASIGNADO → en-camino → entregar`. `avisar-cliente` disponible mientras esté `EN_CAMINO`.
  - **LIBRE**: `ASIGNADO → confirmar-precio → (PRECIO_PENDIENTE) → en-camino → entregar`. `avisar-cliente` en `EN_CAMINO`.
- Recordatorio del dominio (no se reimplementa en mobile, solo se muestra): tarifa = `monto < $40.000 → 10%` · `monto ≥ $40.000 → $6.000 fijo`. La calcula el backend; la app la muestra y, en LIBRE, deja confirmarla.

---

## 6. Setup inicial (orden sugerido)

1. `npx create-expo-app@latest delivery-mobile --template default@sdk-55` (trae TypeScript + Expo Router + estructura `/src` + Native Tabs). New Architecture es la única opción; no hay nada que activar.
2. `eas init` + `eas.json` con perfiles `development` (development client), `preview` (Internal Distribution), `production`. Crear el primer *development build* desde el principio.
3. Instalar stack: `expo-router`, `@tanstack/react-query`, `axios`, `supertokens-react-native`, `zod`, `zustand`, `react-hook-form`, `@hookform/resolvers`, `nativewind`, `tailwindcss@3.4.17`, `react-native-reanimated`, `react-native-safe-area-context`, `expo-notifications`, `expo-device`, `expo-secure-store`, `react-native-sse`.
4. Config NativeWind v4: `tailwind.config.js` (+ `nativewind/preset`), `babel.config.js` (`nativewind/babel`), `metro.config.js` (`withNativeWind`), `global.css`, importarlo en `app/_layout.tsx`, `app.json` con `"web": { "bundler": "metro" }`.
5. `src/config/env.ts` con Zod (API_URL, etc.) + `.env` / `app.config.ts`.
6. `src/shared/api/client.ts`: axios + `SuperTokens.init` + `addAxiosInterceptors`.
7. `app/_layout.tsx`: `QueryClientProvider`, `SafeAreaProvider`, init de SuperTokens, registro de notificaciones.
8. Feature `auth` → `(auth)/login` funcionando end-to-end contra `POST /auth/signin`.
9. Guard de `(app)` por sesión + rol.
10. Feature `repartidor` (perfil + disponibilidad + push-token).
11. Feature `pedidos` (lista → tomar → detalle con SSE → acciones de estado).
12. Feature `notificaciones` (registro + handlers).
13. Pulido: `historial`, estados de error/empty, toasts, theme.

---

## 7. Backlog post-MVP

- Monorepo + paquete `shared/` con schemas Zod compartidos backend ↔ mobile.
- Offline-first: MMKV + persister de TanStack + cola de mutaciones (tomar/entregar diferidos).
- `expo-location` (tracking del repartidor) + `react-native-maps` (ruta a comercio/cliente).
- `GET /api/version` en el backend + chequeo de versión mínima al arrancar.
- Publicación en Play Store / App Store.
- Migración a NativeWind v5 + Tailwind v4 cuando v5 sea estable.

---

### Referencias

- Expo SDK 55 (changelog): https://expo.dev/changelog/sdk-55 — referencia de versiones: https://docs.expo.dev/versions/latest/ — (SDK 56 con RN 0.85 llega en Q2 2026; min iOS sube a 16.4)
- NativeWind v5 (pre-release): https://www.nativewind.dev/v5 — guía de migración: https://www.nativewind.dev/v5/guides/migrate-from-v4
- NativeWind v4 (estable): https://www.nativewind.dev/docs/getting-started/installation — verificar compat con RN 0.83 / React 19.2 antes de fijar versión
- SuperTokens React Native: https://supertokens.com/docs/session/quick-setup/frontend (sección React Native / interceptores Axios)
