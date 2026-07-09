import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Plus, Minus, Search } from "lucide-react";
import { formatPrice } from "../data/store";
import MOCK_PRODUCTS from "../data/mockProducts";
import CartDrawer from "../components/CartDrawer";

function ProductCard({ product, onAdd }) {
  const availableSizes = Object.entries(product.stock)
    .filter(([, qty]) => qty > 0)
    .map(([s]) => Number(s))
    .sort((a, b) => a - b);

  const [selectedSize, setSelectedSize] = useState(availableSizes[0] ?? null);
  const [imgError, setImgError] = useState(false);

  if (!product.active) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col rounded-xl border border-[#222] bg-[#121212] overflow-hidden hover:border-[#d4a853]/40 transition-colors duration-300"
    >
      {product.tag && (
        <span className="absolute top-3 left-3 z-10 bg-[#d4a853] text-[#0a0a0a] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
          {product.tag}
        </span>
      )}

      <div className="relative h-52 overflow-hidden bg-[#1a1a1a]">
        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {product.emoji}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <span className="text-[10px] uppercase tracking-[0.15em] text-[#888] font-semibold">
            {product.brand}
          </span>
          <h3 className="text-[15px] font-bold text-[#e8e8e8] mt-0.5">
            {product.name}
          </h3>
        </div>

        <div className="text-xl font-bold text-[#d4a853]">
          {formatPrice(product.price)}
        </div>

        {availableSizes.length > 0 ? (
          <div className="flex gap-1.5 flex-wrap">
            {availableSizes.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`w-9 h-9 text-xs font-bold rounded-lg border transition-all duration-150 flex items-center justify-center cursor-pointer ${
                  selectedSize === s
                    ? "bg-[#d4a853] text-[#0a0a0a] border-[#d4a853]"
                    : "bg-transparent text-[#e8e8e8] border-[#333] hover:border-[#555]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-xs font-bold text-[#ef4444]">Sin stock disponible</span>
        )}

        <button
          disabled={!selectedSize}
          onClick={() => onAdd(product, selectedSize)}
          className={`mt-auto w-full py-3 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            selectedSize
              ? "bg-[#d4a853] text-[#0a0a0a] hover:bg-[#e8c97a] active:scale-[0.97]"
              : "bg-[#222] text-[#555] cursor-not-allowed"
          }`}
        >
          <Plus size={16} />
          Agregar
        </button>
      </div>
    </motion.div>
  );
}

export default function Catalogo() {
  const [catFilter, setCatFilter] = useState("todos");
  const [sizeFilter, setSizeFilter] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const allSizes = useMemo(() => {
    const s = new Set();
    MOCK_PRODUCTS.filter(p => p.active).forEach(p =>
      Object.keys(p.stock).forEach(t => s.add(Number(t)))
    );
    return [...s].sort((a, b) => a - b);
  }, []);

  const filtered = useMemo(
    () =>
      MOCK_PRODUCTS.filter(p => {
        if (!p.active) return false;
        const catOk = catFilter === "todos" || p.cat === catFilter;
        const sizeOk = !sizeFilter || (sizeFilter in p.stock && p.stock[sizeFilter] > 0);
        return catOk && sizeOk;
      }),
    [catFilter, sizeFilter]
  );

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);

  function addToCart(product, size) {
    setCart(prev => {
      const ex = prev.find(c => c.id === product.id && c.size === size);
      return ex
        ? prev.map(c =>
            c.id === product.id && c.size === size
              ? { ...c, qty: c.qty + 1 }
              : c
          )
        : [...prev, { ...product, size, qty: 1 }];
    });
    showToast(`${product.name} talle ${size} agregado`);
  }

  function changeQty(item, delta) {
    setCart(prev =>
      prev
        .map(c =>
          c.id === item.id && c.size === item.size
            ? { ...c, qty: c.qty + delta }
            : c
        )
        .filter(c => c.qty > 0)
    );
  }

  function removeItem(item) {
    setCart(prev =>
      prev.filter(c => !(c.id === item.id && c.size === item.size))
    );
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans">
      <header className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#d4a853] flex items-center justify-center text-lg">
              👟
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-[#e8e8e8] tracking-tight">
                Calzado Mayorista
              </h1>
              <span className="text-[10px] font-bold text-[#888] tracking-[0.15em] uppercase">
                Distribuidora Oficial
              </span>
            </div>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-[#333] bg-[#1a1a1a] text-[#e8e8e8] text-sm font-bold hover:bg-[#222] transition-all duration-200 cursor-pointer"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="bg-[#d4a853] text-[#0a0a0a] text-[11px] font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
            <span className="hidden sm:inline">Carrito</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-2.5 mb-6 flex-wrap">
          {[
            ["todos", "Todos"],
            ["adulto", "Adultos"],
            ["nino", "Niños"],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setCatFilter(v)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                catFilter === v
                  ? "bg-[#d4a853] text-[#0a0a0a]"
                  : "bg-[#1a1a1a] text-[#888] border border-[#222] hover:border-[#444] hover:text-[#e8e8e8]"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex gap-2 items-center mb-6 pb-6 border-b border-[#1a1a1a]">
          <span className="text-[10px] font-bold text-[#888] tracking-[0.08em] mr-1 uppercase shrink-0">
            Talle
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 flex-nowrap scrollbar-none">
            <button
              onClick={() => setSizeFilter(null)}
              className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                !sizeFilter
                  ? "bg-[#d4a853] text-[#0a0a0a]"
                  : "bg-[#1a1a1a] text-[#888] border border-[#222] hover:border-[#444]"
              }`}
            >
              Todos
            </button>
            {allSizes.map(s => (
              <button
                key={s}
                onClick={() => setSizeFilter(s)}
                className={`shrink-0 w-9 h-9 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  sizeFilter === s
                    ? "bg-[#d4a853] text-[#0a0a0a]"
                    : "bg-[#1a1a1a] text-[#888] border border-[#222] hover:border-[#444]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-semibold text-[#555] mb-6">
          {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
          {sizeFilter ? ` en talle ${sizeFilter}` : ""}
        </div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 text-[#555]"
            >
              <div className="text-5xl mb-4">🔍</div>
              <div className="text-base font-semibold">
                Sin productos para ese filtro
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
            >
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <CartDrawer
        cart={cart}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onChangeQty={changeQty}
        onRemove={removeItem}
        onSent={() => setCart([])}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#d4a853] text-[#0a0a0a] px-5 py-3 rounded-xl text-sm font-bold shadow-lg z-[999] text-center max-w-[90vw]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}