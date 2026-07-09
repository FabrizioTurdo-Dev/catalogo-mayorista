---
name: whatsapp-orders
description: Use when working with the WhatsApp order flow. This is how customers send orders and how the admin confirms them.
---

# WhatsApp Orders — Flujo de pedidos

## Customer flow (Catálogo público)

1. Cliente agrega productos al carrito con talle y cantidad
2. Verifica stock disponible en cada talle
3. Completa nombre y teléfono
4. Al enviar, se abre WhatsApp con mensaje formateado al número del vendedor
5. El pedido se guarda en memoria (React Context) con estado `"pendiente"`

## Admin flow

- Los pedidos aparecen en la sección Pedidos del admin
- Estados: `pendiente` → `confirmado` → `enviado` → `cancelado`
- El admin puede confirmar pedidos abriendo WhatsApp automáticamente

## Formato del mensaje WhatsApp

```
¡Hola! Quiero hacer un pedido:

👤 Cliente: {nombre}
📞 Teléfono: {telefono}

🛒 Productos:
• {nombre} - Talle {talle} x {cantidad} = ${total}

💰 Total: ${totalFinal}
```

## Seller phone

Configurado en `src/data/store.js` como `SELLER_PHONE`. Se usa para generar el link de WhatsApp.
