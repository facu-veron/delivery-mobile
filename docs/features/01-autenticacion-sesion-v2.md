# Feature: Autenticación y sesión

> Estado: **implementado**  
> Archivos clave: `src/infrastructure/auth/supertokens.config.ts`, `src/presentation/routes/auth.routes.ts`, `src/presentation/controllers/auth.controller.ts`

---

## Token de sesión

Tras login o registro, el access token incluye:

```typescript
{
  usuarioId: string;     // ID del Usuario en Prisma
  rol: 'CLIENTE' | 'REPARTIDOR' | 'COMERCIO' | 'ADMIN';
  perfilId: string;      // ID del perfil específico del rol
  nombre: string;        // nombre del usuario — listo para mostrar en UI
}
```

Leído en el frontend con `SuperTokens.getAccessTokenPayloadSecurely()`.

---

## Login

```
POST /auth/signin
Content-Type: application/json

Body (formato SuperTokens):
{
  "formFields": [
    { "id": "email", "value": "usuario@ejemplo.com" },
    { "id": "password", "value": "MiPass123!" }
  ]
}

→ 200  { "status": "OK", "user": { ... } }       — login exitoso
→ 401  { "status": "WRONG_CREDENTIALS_ERROR" }    — credenciales incorrectas
```

El interceptor de Axios puede tratar el 401 como error sin lógica extra.

---

## Logout

```
POST /auth/signout
Authorization: sAccessToken (cookie)

→ 200 OK
```

---

## Refresh de sesión

SuperTokens maneja el refresh automáticamente. Si configurás el interceptor de SuperTokens, no necesitás llamarlo manualmente.

```
POST /auth/session/refresh
```

---

## Registro por rol

| Endpoint | Rol | Body requerido |
|----------|-----|----------------|
| `POST /api/registro/cliente` | CLIENTE | `nombre, email, password, telefono` |
| `POST /api/registro/comercio` | COMERCIO | `nombre, email, password, telefono, calle, numero` |
| `POST /api/registro/repartidor` | REPARTIDOR | `nombre, email, password, telefono, vehiculo` |

**Respuesta 201:**
```json
{ "usuario": { ... }, "cliente|comercio|repartidor": { ... } }
```

La sesión se crea automáticamente tras el registro — no hace falta llamar a login.

**Error 409:** `"El email ya está registrado"`

---

## Cambiar contraseña

```
POST /api/cambiar-password
Content-Type: application/json
Authorization: sAccessToken (cookie)

Body:
{
  "passwordActual": "MiPass123!",
  "passwordNueva": "NuevoPass456!"
}

→ 204 No Content                        — éxito
→ 400 { "error": "La contraseña actual es incorrecta" }
```

Ver doc completo: [12-cambiar-password.md](./12-cambiar-password.md)

---

## Notas para el frontend

- `nombre` ya está en el token — no hace falta llamar a `GET /api/me` solo para el saludo.
- Si el usuario cambia su nombre con `PATCH /api/me`, el token no se actualiza hasta el próximo login. Usar `GET /api/me` para el nombre actualizado en esa sesión.
- Tras cambiar contraseña, la sesión activa sigue vigente. Si querés forzar re-login por seguridad, llamar a `POST /auth/signout` después del 204.
