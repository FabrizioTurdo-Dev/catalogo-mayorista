---
name: admin-auth
description: Use when working with admin authentication in this project. The admin panel uses hardcoded credentials, not Supabase Auth.
---

# Admin Auth

El panel de admin (`/#/admin`) usa login hardcodeado con credenciales fijas. No usa Supabase Auth ni sesiones persistentes.

## Credenciales

- **Usuario:** `admin`
- **Contraseña:** `calzado2025`

## Cómo funciona

El estado de login se maneja con un booleano (`isLoggedIn`) en el estado local del componente `Admin.jsx`. No hay tokens JWT, cookies, ni session storage.

## Secciones del admin

1. **Productos** — CRUD completo de productos contra Supabase
2. **Pedidos** — Lista de pedidos en memoria (no persisten)
3. **Config** — Configuración visual (solo UI, no persiste a DB)
