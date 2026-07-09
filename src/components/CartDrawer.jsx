import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingCart, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatPrice, SELLER_PHONE } from "../data/store";

function WhatsAppIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function CartDrawer({ cart, open, onClose, onChangeQty, onRemove, onSent }) {
  const { addOrder } = useApp();
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  const total    = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const totalQty = cart.reduce((s, c) => s + c.qty, 0);

  function sendToWhatsApp() {
    let msg = "Hola! Quiero realizar el siguiente pedido:\n\n";
    cart.forEach(item => {
      msg += `• ${item.name} — Talle ${item.size} x${item.qty} = ${formatPrice(item.price * item.qty)}\n`;
    });
    msg += `\n*Total: ${formatPrice(total)}*`;
    if (phone) msg += `\nMi número: ${phone}`;

    addOrder({ client: phone || "Cliente nuevo", phone, items: cart.map(c => ({ name: c.name, size: c.size, qty: c.qty })), total });

    window.open(`https://wa.me/${SELLER_PHONE}?text=${encodeURIComponent(msg)}`, "_blank");
    setSent(true);
    onSent();
  }

  function resetCart() {
    setSent(false);
    setPhone("");
    onClose();
  }

  return (
    <AnimatePresence>
      {(open || sent) && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-[200]"
            onClick={sent ? resetCart : onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#121212] z-[201] border-l border-[#222] flex flex-col font-sans"
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center flex-1 px-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#22c55e]/20 flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-[#22c55e]" />
                </div>
                <h2 className="text-xl font-extrabold text-[#e8e8e8] mb-2">
                  ¡Pedido enviado!
                </h2>
                <p className="text-sm text-[#888] mb-8 max-w-xs">
                  Se abrió WhatsApp con tu pedido. El vendedor te confirmará en breve.
                </p>
                <button
                  onClick={resetCart}
                  className="px-8 py-3.5 rounded-xl bg-[#d4a853] text-[#0a0a0a] font-bold text-sm hover:bg-[#e8c97a] transition-all duration-200 cursor-pointer"
                >
                  Volver al catálogo
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#222] bg-[#1a1a1a]">
                  <h2 className="text-base font-extrabold text-[#e8e8e8]">
                    Tu pedido{" "}
                    <span className="font-normal text-xs text-[#888]">
                      ({totalQty} {totalQty === 1 ? "par" : "pares"})
                    </span>
                  </h2>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg bg-[#222] flex items-center justify-center text-[#888] hover:bg-[#333] hover:text-[#e8e8e8] transition-all duration-200 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="flex-1 overflow-auto px-4 sm:px-6 py-4">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-[#555]">
                      <ShoppingCart size={48} className="mb-4 opacity-50" />
                      <p className="text-sm font-semibold">El carrito está vacío</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {cart.map((item, i) => (
                        <motion.div
                          key={`${item.id}-${item.size}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-center gap-3 py-3 border-b border-[#1a1a1a] last:border-0"
                        >
                          <div className="w-11 h-11 rounded-lg border border-[#333] flex items-center justify-center text-xl bg-[#1a1a1a] shrink-0">
                            {item.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-[#e8e8e8] truncate">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-[#888]">
                              Talle {item.size} · {formatPrice(item.price)} c/u
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onChangeQty(item, -1)}
                              className="w-7 h-7 rounded-md border border-[#333] bg-transparent flex items-center justify-center text-[#888] hover:bg-[#222] hover:text-[#e8e8e8] transition-all duration-150 cursor-pointer"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-bold text-[#e8e8e8] min-w-[20px] text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => onChangeQty(item, 1)}
                              className="w-7 h-7 rounded-md border border-[#333] bg-transparent flex items-center justify-center text-[#888] hover:bg-[#222] hover:text-[#e8e8e8] transition-all duration-150 cursor-pointer"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <div className="text-sm font-extrabold text-[#d4a853] min-w-[65px] text-right">
                            {formatPrice(item.price * item.qty)}
                          </div>
                          <button
                            onClick={() => onRemove(item)}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-[#555] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all duration-150 cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="px-4 sm:px-6 py-5 border-t border-[#222] bg-[#1a1a1a]">
                    <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-[#0a0a0a] border border-[#333] mb-4">
                      <span className="text-sm font-bold text-[#888]">Total estimado</span>
                      <span className="text-2xl font-extrabold text-[#d4a853]">{formatPrice(total)}</span>
                    </div>

                    <div className="mb-3">
                      <label className="text-[10px] font-bold text-[#888] uppercase tracking-[0.08em] mb-1.5 block">
                        Tu WhatsApp (opcional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+54 9 11 1234 5678"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#333] bg-[#0a0a0a] text-[#e8e8e8] text-sm font-medium outline-none focus:border-[#d4a853] transition-colors duration-200 placeholder:text-[#555]"
                      />
                    </div>

                    <button
                      onClick={sendToWhatsApp}
                      className="w-full py-3.5 rounded-xl bg-[#22c55e] text-[#0a0a0a] font-bold text-sm hover:bg-[#16a34a] transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.98] cursor-pointer"
                    >
                      <WhatsAppIcon size={18} />
                      Enviar pedido por WhatsApp
                    </button>
                    <p className="text-center text-[10px] text-[#555] mt-2">
                      Se abrirá WhatsApp con el resumen de tu pedido
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}