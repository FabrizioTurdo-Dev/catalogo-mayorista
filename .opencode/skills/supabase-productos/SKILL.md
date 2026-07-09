---
name: supabase-productos
description: Use when working with Supabase database queries for the productos table. Also use for CRUD operations, schema questions, or data modeling in this project.
---

# Supabase Productos — Esquema y operaciones

Este proyecto usa Supabase como backend. La tabla principal es `productos` con esta estructura.

## Columnas

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | int8 (PK) | Auto-incremental |
| `name` | text | Nombre del producto |
| `brand` | text | Marca |
| `cat` | text | `"adulto"` o `"nino"` |
| `price` | float8 | Precio en ARS |
| `tag` | text | Badge opcional ("Nuevo", "Oferta") |
| `active` | bool | Visibilidad |
| `emoji` | text | Emoji fallback para imagen |
| `stock` | jsonb | `{ "35": 10, "36": 5 }` |
| `image` | text | Base64 data URL |

## Cliente Supabase

Se inicializa en `src/config/supabase.js` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` del `.env.local`.

## Operaciones comunes

- `SELECT * FROM productos ORDER BY id ASC` — Catálogo público
- `SELECT * FROM productos ORDER BY id DESC` — Admin
- `INSERT INTO productos (...) VALUES (...)` — Crear producto
- `UPDATE productos SET ... WHERE id = ...` — Editar producto
- `DELETE FROM productos WHERE id = ...` — Eliminar
