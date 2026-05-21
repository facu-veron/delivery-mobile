# Requisitos backend pendientes — Mobile

> Actualizado: 2026-05-20 (post Bloque 5)  
> Lista consolidada de lo que el frontend necesita del backend y aún no está confirmado/implementado.  
> Los ítems resueltos fueron eliminados.

---

## 1. Upload avatar — restricciones de archivo

**Frontend:** `expo-image-picker` → `POST /api/me/avatar` con `multipart/form-data`.

**Falta documentar:**
- Tamaño máximo (bytes)
- Formatos aceptados (JPEG / PNG / WEBP)
- Si el backend redimensiona o el cliente debe hacerlo

**Sin esta info:** el frontend muestra un error genérico si el archivo es rechazado por tamaño/formato.

---

## 2. Notificaciones in-app — creación automática al enviar push

**Estado actual:** el backend NO crea automáticamente un registro `NotificacionInApp` al enviar una push notification. La pantalla de notificaciones solo mostrará mensajes de contacto de soporte (tipo `SISTEMA`) y lo que el backend genere explícitamente.

**Sugerencia:** en cada llamada a `notifService.enviar(...)`, crear también el registro en `NotificacionInApp`. Esto haría que el historial in-app refleje todas las pushes recibidas.
