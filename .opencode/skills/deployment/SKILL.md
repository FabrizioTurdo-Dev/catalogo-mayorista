---
name: deployment
description: Use when building, deploying, or configuring deployment for this project. Hosted on GitHub Pages via gh-pages and GitHub Actions.
---

# Deploy

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Dev server con Vite |
| `npm run build` | Build a `dist/` |
| `npm run preview` | Preview del build |
| `npm run deploy` | Build + push a gh-pages |

## GitHub Actions

El deploy automático está en `.github/workflows/deploy.yml`. Se ejecuta en cada push a `main`.

## Configuración Vite

```js
// vite.config.js
base: '/catalogo-mayorista/'
```

## Routing

Usa `HashRouter` (`/#/` y `/#/admin`) porque GitHub Pages no soporta SPA routing con BrowserRouter.
