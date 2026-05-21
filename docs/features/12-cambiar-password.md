# Feature: Cambiar contraseña

> Estado: **implementado**  
> Archivos clave: `src/presentation/routes/auth.routes.ts`, `src/presentation/controllers/auth.controller.ts`

---

## POST /api/cambiar-password

Permite al usuario autenticado cambiar su contraseña. Requiere confirmar la contraseña actual para verificar identidad.

```
POST /api/cambiar-password
Content-Type: application/json
Authorization: sAccessToken (cookie, cualquier rol)

Body:
{
  "passwordActual": "MiPass123!",
  "passwordNueva": "NuevoPass456!"
}

204 No Content
```

**Validaciones:**

| Campo | Regla |
|-------|-------|
| `passwordActual` | requerido, no vacío |
| `passwordNueva` | requerido, mínimo 8 caracteres |

**Errores posibles:**

| Status | Mensaje |
|--------|---------|
| 400 | (Zod) `La nueva contraseña debe tener al menos 8 caracteres` |
| 400 | `La contraseña actual es incorrecta` |
| 404 | `Usuario no encontrado` |

---

## Flujo recomendado en el frontend

```typescript
// En la pantalla "Cambiar contraseña"
const cambiarPassword = async (passwordActual: string, passwordNueva: string) => {
  const res = await api.post('/api/cambiar-password', {
    passwordActual,
    passwordNueva,
  });

  if (res.status === 204) {
    Alert.alert('Éxito', 'Tu contraseña fue actualizada');
    navigation.goBack();
  }
};
```

**Manejo de errores:**

```typescript
try {
  await cambiarPassword(actual, nueva);
} catch (error) {
  if (error.response?.status === 400) {
    setError(error.response.data.error); // "La contraseña actual es incorrecta"
  }
}
```

---

## Notas de implementación

- El sistema verifica la contraseña actual usando `EmailPassword.signIn` de SuperTokens antes de actualizarla.
- Si la verificación falla, devuelve 400 (no 401) para distinguirlo de un error de sesión.
- La sesión activa **no se invalida** tras el cambio de contraseña — el usuario permanece logueado.
- Si el frontend quiere cerrar la sesión tras el cambio (práctica recomendada de seguridad), debe llamar a `POST /auth/signout` después del 204.
