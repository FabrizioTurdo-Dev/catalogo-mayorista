---
name: ui-patterns
description: Use when building UI components, pages, or styles for this project. All styles are inline, no CSS framework.
---

# UI Patterns del proyecto

Este proyecto usa **React con estilos inline** (objetos JS style). No hay Tailwind, CSS modules, styled-components, ni framework CSS.

## Convenciones

- Estilos definidos como objetos `const styles = { ... }`
- Sin clases CSS externas
- Sin CSS modules
- Sin librerías de componentes (solo React puro)

## Páginas

- **Catálogo** (`Catalogo.jsx`): grilla de productos, filtros por categoría y talle, carrito lateral
- **Admin** (`Admin.jsx`): login simple, tabs internas (Productos/Pedidos/Config)

## Consideraciones UX

- El catálogo es mobile-first (WhatsApp)
- Las imágenes de productos son base64 embebidas en la DB
- Los pedidos NO persisten — se pierden al recargar
