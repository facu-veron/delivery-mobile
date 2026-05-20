# Feature: Comercios favoritos del cliente

> Estado: **implementado**  
> Archivos clave: `src/presentation/routes/cliente.routes.ts`, `src/domain/use-cases/cliente/gestionar-favoritos.usecase.ts`

---

## Endpoints

Todos requieren `CLIENTE` autenticado.

### GET /api/cliente/favoritos

Lista los comercios marcados como favoritos.

```
GET /api/cliente/favoritos

200 OK
{
  "comercios": [
    {
      "id": "uuid",
      "nombre": "Panadería El Sol",
      "descripcion": "...",
      "telefono": "...",
      "calle": "...",
      "numero": "...",
      "logoUrl": "...",
      "estadoCuenta": "ACTIVO"
    }
  ]
}
```

### POST /api/cliente/favoritos/:comercioId

Agrega un comercio a favoritos. Si ya existe, es idempotente (no falla).

```
POST /api/cliente/favoritos/:comercioId

204 No Content
```

### DELETE /api/cliente/favoritos/:comercioId

Quita un comercio de favoritos.

```
DELETE /api/cliente/favoritos/:comercioId

204 No Content
404 Not Found → si no estaba en favoritos
```

---

## Integración en la UI

- En `ComercioCard`: botón corazón con toggle. Llamar `POST` para agregar, `DELETE` para quitar.
- En la pantalla de favoritos: usar `GET /api/cliente/favoritos` y mostrar la lista.
- Para saber si un comercio ya es favorito al cargar la lista de comercios, el frontend puede mantener en estado local los IDs de favoritos (obtenidos del `GET`).

---

## Modelo de base de datos

```sql
-- comercios_favoritos
clienteId + comercioId → PRIMARY KEY compuesto
```

La relación es `@@id([clienteId, comercioId])` — no hay duplicados posibles.
