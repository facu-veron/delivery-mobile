# Feature: Centro de ayuda y soporte

> Estado: **implementado**  
> Archivos clave: `src/presentation/routes/ayuda.routes.ts`, `src/domain/use-cases/ayuda/ayuda.usecase.ts`

---

## GET /api/ayuda/faqs

Devuelve la lista de preguntas frecuentes filtradas por rol del usuario autenticado.

```
GET /api/ayuda/faqs

200 OK
[
  {
    "id": "1",
    "pregunta": "¿Cómo se calcula el costo de envío?",
    "respuesta": "El costo de envío se calcula según el monto del pedido...",
    "categoria": "PAGOS",
    "rolTarget": "CLIENTE"
  },
  {
    "id": "3",
    "pregunta": "¿Cómo cambio mi contraseña?",
    "respuesta": "Desde la pantalla de login...",
    "categoria": "CUENTA",
    "rolTarget": "AMBOS"
  }
]
```

El filtro es automático según el rol del token:
- CLIENTE ve FAQs de `rolTarget: CLIENTE` y `AMBOS`
- REPARTIDOR ve FAQs de `rolTarget: REPARTIDOR` y `AMBOS`

**Categorías:** `PAGOS`, `PEDIDOS`, `CUENTA`, `OTROS`

> Las FAQs son datos estáticos en el código. Para agregar o editar, modificar el array en `src/domain/use-cases/ayuda/ayuda.usecase.ts`.

---

## POST /api/ayuda/contacto

Envía un mensaje al soporte.

```
POST /api/ayuda/contacto
Content-Type: application/json

Body:
{
  "asunto": "Problema con mi pedido",      // requerido — máx 200 chars
  "mensaje": "Mi pedido no llegó...",      // requerido — máx 2000 chars
  "pedidoId": "uuid"                       // opcional — referencia al pedido
}

201 Created
{
  "mensaje": "Tu mensaje fue enviado. Te responderemos a la brevedad."
}
```

El mensaje se registra como una `NotificacionInApp` de tipo `SISTEMA` en el historial del usuario.

---

## Próximos pasos sugeridos

- Agregar un modelo `MensajeSoporte` dedicado en Prisma para que el equipo pueda leer los mensajes desde una interfaz de admin.
- Implementar respuesta del soporte con notificación al usuario.
- Integrar Slack/email webhook para recibir mensajes de soporte en tiempo real.
