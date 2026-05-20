# Feature: Perfil propio — /api/me

> Estado: **implementado**  
> Archivos clave: `src/presentation/routes/auth.routes.ts`, `src/presentation/controllers/auth.controller.ts`, `src/domain/use-cases/me/`

---

## GET /api/me

Devuelve el perfil completo del usuario autenticado.

```
GET /api/me
Authorization: sAccessToken (cookie)

200 OK
{
  "usuarioId": "uuid",
  "rol": "CLIENTE",
  "perfilId": "uuid",
  "perfil": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "telefono": "3704123456",
    "avatarUrl": null,
    "creadoEn": "2026-01-01T00:00:00.000Z"
  }
}
```

---

## PATCH /api/me

Actualiza nombre y/o teléfono. Aplica a CLIENTE y REPARTIDOR.

```
PATCH /api/me
Content-Type: application/json
Authorization: sAccessToken (cookie)

Body:
{
  "nombre": "Juan Pérez Actualizado",  // opcional
  "telefono": "3704999888"             // opcional
}

200 OK
{
  "nombre": "Juan Pérez Actualizado",
  "telefono": "3704999888",
  "avatarUrl": null
}
```

**Validaciones:**
- Al menos uno de los campos es requerido
- `nombre`: 2–100 caracteres
- No se puede cambiar el email por este endpoint (usa el flujo de SuperTokens)

---

## POST /api/me/avatar

Sube o actualiza la foto de perfil.

```
POST /api/me/avatar
Content-Type: multipart/form-data
Authorization: sAccessToken (cookie)

Form field: avatar (archivo imagen)

200 OK
{
  "avatarUrl": "http://localhost:4000/uploads/avatars/avatar-1234567890.jpg"
}
```

**Restricciones:**
- Formatos: `image/jpeg`, `image/png`, `image/webp`
- Tamaño máximo: 5 MB
- Field name del form: `avatar`

**Acceso público a la imagen:**  
Las imágenes se sirven como archivos estáticos desde:
```
http://localhost:4000/uploads/avatars/<filename>
```

Cambiar `UPLOADS_DIR` en `.env` para personalizar la carpeta.

---

## Cambio de contraseña

SuperTokens maneja el flujo de reset. La app debe:
1. Llamar a `POST /auth/user/password/reset/token` con el email
2. El usuario recibe un email con link para resetear

No hay endpoint custom para esto.
