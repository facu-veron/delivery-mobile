# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start              # Start Expo dev server
npm run android        # Run on Android device/emulator
npm run ios            # Run on iOS simulator
npm run web            # Run web version
npm run lint           # Run ESLint
```

No test runner is configured yet.

## Architecture Overview

This is an Expo SDK 55 React Native app for a delivery platform. The current codebase is a **foundation/starter** — the PRD in `docs/` describes the full planned architecture for a dual-role app (customer + delivery person).

### Routing

File-based routing via **Expo Router** (`src/app/`). Planned route groups:

- `(auth)/` — shared login/registration screens
- `(cliente)/` — customer-facing UI (role-gated)
- `(repartidor)/` — delivery person UI (role-gated)

Role is determined at login and stored in the auth Zustand store. The router reads this role to redirect appropriately after authentication.

### State Management

**Zustand** (v5) for global state. Planned stores in `src/stores/`:

- `auth.store.ts` — JWT token, user role (`cliente` | `repartidor`), userId, name
- `pedido.store.ts` — active order state for delivery person
- `carrito.store.ts` — customer shopping cart

**Critical:** JWT tokens must be persisted in `expo-secure-store`, never `AsyncStorage`. The auth store handles token refresh and forces logout on refresh failure.

### Data Fetching

**TanStack React Query** (v5) for server state. The API layer (planned in `src/api/`) uses **Axios** with JWT interceptors for auto-refresh.

Real-time order status uses **5-second polling** (React Query `refetchInterval`). The `react-native-sse` package is available for Server-Sent Events if polling is replaced.

### Styling

**NativeWind** (v4) — Tailwind CSS for React Native. Global styles in `src/global.css`. Configure new utilities in `tailwind.config.js`. Metro is already wired up for NativeWind.

### Push Notifications

`expo-notifications` + Firebase FCM. `google-services.json` handles Android FCM config. EAS project ID: `7c1f0a7b-5a7b-4abf-9397-cafb5abd7275`.

### Forms & Validation

**React Hook Form** + **Zod** (v4) for all forms. Use `@hookform/resolvers/zod` for schema binding.

## Path Aliases

```ts
@/*         → src/*
@/assets/*  → assets/*
```

## Estado de implementación

### Fase 1 — Completa ✓
- **Design system:** `tailwind.config.js` con los tokens de color del tema DeliverYa (hex equivalentes de oklch de la web). Los colores semánticos siguen el mismo naming que la web: `primary`, `secondary`, `accent`, `muted`, `card`, `destructive`, `success`, `warning`, `border`.
- **Dark mode:** variantes `*-dark` en el config (`bg-card dark:bg-card-dark`). `darkMode: 'media'` — responde automáticamente al sistema.
- **Primitivos shared:** `Button`, `Card`, `Badge`, `LoadingSpinner`, `ErrorMessage` en `src/shared/components/`.
- **Infraestructura:** `src/config/env.ts` (Zod), `src/shared/api/client.ts` (Axios + SuperTokens), `src/shared/api/query-client.ts`, `src/shared/types/pedido.types.ts` (enums espejo del backend).
- **Auth store:** `src/features/auth/store/auth.store.ts` (Zustand v5).
- **Root layout:** `src/app/_layout.tsx` con `QueryClientProvider`, `SafeAreaProvider`, `SuperTokens.init`.

### Fase 2 — Completa ✓
- **Routing por rol:** `index.tsx` hidrata el store con `useSession` (SuperTokens) → redirect a `(cliente)` o `(repartidor)` según rol.
- **Guards:** `(cliente)/_layout.tsx` y `(repartidor)/_layout.tsx` validan `isAuthenticated` + `rol` antes de renderizar.
- **Auth feature:** esquemas Zod, API (`authApi`), hooks (`useLogin`, `useLogout`, `useSession`), store Zustand.
- **Pantallas:** `(auth)/login.tsx`, `(auth)/registro.tsx` (2 pasos: selector de rol → formulario). Usan RHF + Zod + tokens del tema via NativeWind.
- **Push registration:** `usePushRegistration` corre en background post-login/registro.
- **Componentes nuevos:** `Input` (con label + error), `Button` (ya existía desde Fase 1).
- **Template limpiado:** borrados todos los archivos del starter de Expo (app-tabs, themed-text, animated-icon, etc).

### Fase 3 — Completa ✓
- **Tab navigator repartidor:** `(repartidor)/(tabs)/` — Disponibles, En curso (activo), Historial, Perfil. Listener de push `NUEVO_PEDIDO` invalida la lista.
- **Disponibilidad:** `DisponibilidadSwitch` con update optimista y rollback en error. Zustand store `useDisponibilidadStore`.
- **Lista de pedidos disponibles:** `usePedidosDisponibles` con polling 10s, pull-to-refresh, tarjetas con tipo/estado/monto.
- **Detalle de pedido:** `/(repartidor)/pedido/[id]` con polling 5s (se auto-detiene en estado terminal), `AccionesPedido`, `ConfirmarPrecioForm`.
- **Acciones por estado:** `transiciones-estado.ts` — confirmar-precio (LIBRE+ASIGNADO), en-camino, entregar, avisar-cliente.
- **Perfil:** `usePerfil`, badge `EstadoAprobacion`, link a documentos, logout.
- **Documentos:** pantalla con 5 tipos de documento, estados mock (upload en Fase 5).

### Fase 4 — Completa ✓
- **Tab navigator cliente:** `(cliente)/(tabs)/` — Inicio (🏪), Mis pedidos (📦), Historial (📋).
- **Home:** lista de comercios con `useComercios`, CTA "Pedido libre" → `/pedido-libre/nuevo`.
- **Comercio detalle:** `/(cliente)/comercio/[id]` con categorías/productos, `ProductoCard` con +/− controls, floating cart bar.
- **Carrito:** `useCarritoStore` (Zustand) — multi-comercio (limpia automáticamente al cambiar de comercio).
- **Checkout:** `/(cliente)/carrito` — editar cantidades, dirección de entrega, resumen (subtotal + costo envío offline), confirmar.
- **Pedido libre:** `/(cliente)/pedido-libre/nuevo` con formulario RHF+Zod, preview de costo de envío en vivo.
- **Costo de envío:** `calcularCostoEnvio(monto)` — `monto < $40.000 → 10%`, `monto ≥ $40.000 → $6.000 fijo`.
- **Mis pedidos:** polling 10s, handler push `AVISAR_CLIENTE` invalida la lista.
- **Seguimiento:** `/(cliente)/pedido/[id]` con polling 5s, descripciones de estado por paso, colores semánticos (warning/success/destructive).
- **Tipos:** `src/shared/types/comercio.types.ts` (Comercio, Producto, CategoriaProductos, ComercioDetalle).

### Fase 5 — Completa ✓
- **Historial repartidor:** `(repartidor)/(tabs)/historial` — lista real paginada con `useHistorialRepartidor`, navega al detalle del pedido. Invalida cache al `useEntregarPedido`.
- **Historial cliente:** `(cliente)/(tabs)/historial` — lista con `useHistorialCliente`, muestra monto total + estado badge.
- **Tab "En curso" repartidor:** ahora muestra el pedido activo en tiempo real (`usePedidoActivo`, polling 5s) con todas las acciones inline. Estado vacío dirige a disponibles.
- **Upload de documentos:** `documentos.tsx` usa `expo-image-picker` para seleccionar imagen y `FormData` para subir vía `useSubirDocumento`. Estados reales via `useDocumentos`. Muestra motivo de rechazo cuando aplica.
- **Haptics:** vibración `NotificationFeedbackType.Warning` al recibir push `AVISAR_CLIENTE` en app abierta.
- **Notification deep-link:** `_layout.tsx` escucha `addNotificationResponseReceivedListener` → navega a `/(repartidor)/pedido/:id` o `/(cliente)/pedido/:id` según rol.
- **expo-image:** `ComercioCard` usa `expo-image` en lugar de RN `Image` para mejor caché y fade-in.
- **expo-image-picker plugin:** agregado en `app.json` (requerido para permisos nativos en builds EAS).
- **Paquetes nuevos:** `expo-image-picker ~55.0.20`, `expo-haptics ~55.0.14` (requieren rebuild EAS).

## Notas de build

Paquetes nativos que requirieron rebuild del dev client:
- Fase 5: `expo-image-picker`, `expo-haptics`
- UI shadcn-style: `lucide-react-native` + `react-native-svg` (peer dep nativa — el síntoma sin rebuild es `'RCTRNSVGPath' ... in ViewManagerRegistry`)

```bash
eas build --profile development --platform android
```

## Key Design Decisions (from PRD)

- `supertokens-react-native` is available but JWT via Axios interceptors is the planned auth approach
- `expo-glass-effect` and `expo-symbols` are available for UI polish
- The app targets Android (armeabi-v7a, arm64-v8a) and iOS; web is secondary
- `react-native-reanimated` v4 is used for animations — requires Hermes (already enabled)

## Docs

- `docs/PRD_envios-mobile.md` — full product requirements, API contracts, screen flows, architecture decisions
- `docs/app-repartidor-plan.md` — delivery person feature implementation plan
