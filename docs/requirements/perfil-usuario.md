# Requisitos backend — Perfil de usuario

> Estado: **pendiente de implementación en el backend**  
> Afecta: módulo cliente y módulo repartidor

---

## Contexto

La app mobile muestra un header de bienvenida con el nombre y avatar del usuario.  
El `nombre` ya llega en el payload del access token (disponible sin llamada extra).  
Lo que **no existe aún** es una URL de foto de perfil ni un endpoint para gestionarla.

El componente `Avatar` (`src/shared/components/Avatar.tsx`) ya está preparado para recibir una `avatarUrl` opcional. Si no se pasa, muestra la inicial del nombre como fallback.

---

## 1. Campo `avatarUrl` en el perfil

### Qué se necesita

Que el endpoint `GET /api/me` incluya `avatarUrl` en la respuesta:

```json
{
  "usuarioId": "uuid",
  "rol": "CLIENTE",
  "perfilId": "uuid",
  "perfil": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "telefono": "3704123456",
    "avatarUrl": "https://cdn.example.com/avatars/uuid.jpg"
  }
}
```

`avatarUrl` puede ser `null` si el usuario no subió foto — la app muestra la inicial en ese caso.

### Cambio en Prisma

Agregar el campo a los modelos `Cliente` y `Repartidor`:

```prisma
model Cliente {
  // ...campos existentes
  avatarUrl String?
}

model Repartidor {
  // ...campos existentes
  avatarUrl String?
}
```

---

## 2. Endpoint para subir/actualizar avatar

```
POST /api/me/avatar
Content-Type: multipart/form-data
Authorization: sAccessToken (cookie)

Body: { avatar: <archivo imagen> }
```

**Respuesta 200:**
```json
{
  "avatarUrl": "https://cdn.example.com/avatars/uuid.jpg"
}
```

**Restricciones esperadas:**
- Formatos aceptados: `image/jpeg`, `image/png`, `image/webp`
- Tamaño máximo: 5 MB
- El backend almacena el archivo (S3, Cloudinary, o local) y guarda la URL en Prisma

---

## 3. Endpoint para obtener perfil completo del cliente

Actualmente `GET /api/me` devuelve los datos básicos del perfil.  
Se necesita confirmar que el campo `telefono` también esté disponible ahí (se usa en la pantalla de perfil del cliente).

```json
{
  "perfil": {
    "nombre": "Juan Pérez",
    "telefono": "3704123456",
    "avatarUrl": null
  }
}
```

---

## 4. Integración en el token (opcional)

Si se quiere evitar una llamada extra a `/api/me` en cada sesión, incluir `avatarUrl` en el payload del access token al momento de crear la sesión (`createNewSession`):

```typescript
// supertokens.config.ts
await Session.createNewSession(req, res, userId, {
  usuarioId: usuario.id,
  rol: usuario.rol,
  perfilId: perfilId,
  nombre: perfil.nombre,
  avatarUrl: perfil.avatarUrl ?? null,   // <-- nuevo
});
```

Esto permite leer `avatarUrl` desde `SuperTokens.getAccessTokenPayloadSecurely()` sin hacer fetch adicional, igual que hacemos con `nombre`.

---

## Impacto en la app mobile

| Archivo | Cambio requerido |
|---------|-----------------|
| `src/shared/components/Avatar.tsx` | Ya preparado — acepta `avatarUrl?: string` |
| `src/features/auth/store/auth.store.ts` | Agregar campo `avatarUrl: string` al store si se incluye en el token |
| `src/features/auth/hooks/useSession.ts` | Leer `payload.avatarUrl` y guardarlo en el store |
| `src/features/auth/hooks/useLogin.ts` | Ídem al hacer login |
| `src/app/(cliente)/(tabs)/index.tsx` | Pasar `avatarUrl` al componente `Avatar` |
| `src/app/(cliente)/(tabs)/perfil.tsx` | Mostrar avatar + botón para cambiarlo |
| `src/app/(repartidor)/(tabs)/perfil.tsx` | Ídem |
