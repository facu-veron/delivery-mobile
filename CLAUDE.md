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

### Fases 2-5 — Pendientes
Ver plan de fases completo en la conversación.

## Key Design Decisions (from PRD)

- `supertokens-react-native` is available but JWT via Axios interceptors is the planned auth approach
- `expo-glass-effect` and `expo-symbols` are available for UI polish
- The app targets Android (armeabi-v7a, arm64-v8a) and iOS; web is secondary
- `react-native-reanimated` v4 is used for animations — requires Hermes (already enabled)

## Docs

- `docs/PRD_envios-mobile.md` — full product requirements, API contracts, screen flows, architecture decisions
- `docs/app-repartidor-plan.md` — delivery person feature implementation plan
