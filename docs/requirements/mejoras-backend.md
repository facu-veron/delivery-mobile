# Sugerencias de mejora — Backend

> Estado: **sugerencias / pendientes de evaluación**  
> Originadas en análisis del frontend mobile

---

## 1. Payload del token de sesión — campos obligatorios

### Problema actual

En `useLogin.ts`, después de un login exitoso se llama a `SuperTokens.getAccessTokenPayloadSecurely()` para obtener `rol`, `perfilId` y `nombre`. Si alguno de esos campos **no está en el payload del token**, el store queda con valores vacíos y el redirect de rol puede fallar silenciosamente (el usuario queda pegado en la pantalla de login sin mensaje de error).

### Lo que el token debe incluir siempre

```typescript
// supertokens.config.ts — createNewSession
await Session.createNewSession(req, res, userId, {
  usuarioId: string,   // obligatorio
  rol: 'CLIENTE' | 'REPARTIDOR',  // obligatorio — el redirect depende de este campo
  perfilId: string,    // obligatorio
  nombre: string,      // obligatorio — se muestra en UI
});
```

Si alguno de estos falta, el frontend no tiene forma de distinguirlo de un error de red.

---

## 2. Respuesta del endpoint de login

### Problema actual

SuperTokens devuelve HTTP 200 tanto para login exitoso como para credenciales incorrectas:

```json
// Login fallido — sigue siendo HTTP 200
{ "status": "WRONG_CREDENTIALS_ERROR" }
```

El interceptor de Axios trata esto como éxito y `onSuccess` se dispara. El frontend intenta obtener el token de sesión (que no existe), lanza una excepción interna, y el usuario no recibe feedback claro.

### Sugerencia

Agregar un hook de SuperTokens post-sign-in para devolver el `status` en la respuesta y permitir que el frontend lo maneje explícitamente, **o** configurar SuperTokens para retornar 4xx en credenciales inválidas si la versión lo permite:

```typescript
// override en supertokens.config.ts
EmailPassword.init({
  override: {
    apis: (originalImplementation) => ({
      ...originalImplementation,
      signInPOST: async (input) => {
        const response = await originalImplementation.signInPOST!(input);
        if (response.status === 'WRONG_CREDENTIALS_ERROR') {
          // opción: setear código HTTP 401 explícito
          input.options.res.setStatusCode(401);
        }
        return response;
      },
    }),
  },
}),
```

> **Nota:** esto requiere también arreglar `useLogin.ts` en el frontend para leer `response.data.status`. El archivo correspondiente es `src/features/auth/hooks/useLogin.ts`.

---

## 3. Reemplazar polling por SSE para estado de pedidos

### Problema actual

El frontend usa polling activo en múltiples pantallas:

| Pantalla | Intervalo | Hook |
|----------|-----------|------|
| Detalle de pedido (repartidor) | 5 s | `usePedidoDetalle` |
| Tab "En curso" (repartidor) | 5 s | `usePedidoActivo` |
| Seguimiento de pedido (cliente) | 5 s | `/(cliente)/pedido/[id]` |
| Lista de pedidos disponibles | 10 s | `usePedidosDisponibles` |
| Mis pedidos (cliente) | 10 s | `/(cliente)/(tabs)/mis-pedidos` |

Con múltiples repartidores y clientes activos esto escala mal.

### Sugerencia

Implementar un endpoint SSE por pedido:

```
GET /api/pedidos/:id/eventos
Accept: text/event-stream
```

El paquete `react-native-sse` ya está instalado en el proyecto. El frontend puede suscribirse al stream y recibir actualizaciones de estado en tiempo real sin polling.

**Eventos mínimos a emitir:**
```
event: estado_actualizado
data: {"pedidoId": "uuid", "estado": "EN_CAMINO", "updatedAt": "..."}
```

El polling puede mantenerse como fallback si la conexión SSE se interrumpe.

---

## 4. Endpoint de disponibilidad del repartidor — respuesta optimista

### Contexto

El frontend implementa **update optimista** en `DisponibilidadSwitch`: actualiza el estado local inmediatamente y hace rollback si el servidor falla. Para que esto funcione bien, el endpoint debe responder rápido (< 500 ms) y devolver el estado real tras el cambio.

### Respuesta esperada

```
PATCH /api/repartidor/disponibilidad
Body: { "disponible": true }

200 OK
{ "disponible": true }
```

Si el servidor devuelve el estado sin el campo `disponible` en la respuesta, el frontend no puede confirmar que el rollback sea correcto.

---

## 5. Endpoint de documentos — motivo de rechazo

### Contexto

La pantalla de documentos del repartidor muestra el `motivoRechazo` cuando el estado es `RECHAZADO`. Esto ya funciona si el backend lo incluye en la respuesta de `GET /api/repartidor/documentos`.

### Respuesta esperada por documento

```json
{
  "tipo": "DNI_FRENTE",
  "estado": "RECHAZADO",
  "motivoRechazo": "La imagen está borrosa, subí una foto más nítida.",
  "url": "https://cdn.example.com/docs/uuid.jpg"
}
```

El campo `motivoRechazo` debe ser `null` (no ausente) cuando el estado no es `RECHAZADO`, para que el frontend pueda diferenciarlo.
