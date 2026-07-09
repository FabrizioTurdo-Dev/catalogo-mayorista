import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, ShoppingCart, Settings, LogOut, ExternalLink, Plus, X, Trash2,
  Check, Truck, AlertCircle, Search, Upload, Image as ImageIcon,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatPrice, ALL_SIZES_ADULTO, ALL_SIZES_NINO } from "../data/store";
import { supabase } from "../config/supabase";

function Badge({ status }) {
  const styles = {
    pendiente:  "bg-amber-500/10 text-amber-400 border-amber-500/30",
    confirmado: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    enviado:    "bg-blue-500/10 text-blue-400 border-blue-500/30",
    cancelado:  "bg-red-500/10 text-red-400 border-red-500/30",
  };
  return (
    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border capitalize ${styles[status] || styles.pendiente}`}>
      {status}
    </span>
  );
}

function Input({ label, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[11px] font-bold text-[#888] uppercase tracking-[0.05em]">{label}</label>}
      <input
        {...props}
        className={`w-full px-3 py-2.5 rounded-xl border border-[#333] bg-[#0a0a0a] text-[#e8e8e8] text-sm font-medium outline-none transition-colors duration-200 placeholder:text-[#555] focus:border-[#d4a853] ${className}`}
      />
    </div>
  );
}

function Select({ label, children, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[11px] font-bold text-[#888] uppercase tracking-[0.05em]">{label}</label>}
      <select
        {...props}
        className="w-full px-3 py-2.5 rounded-xl border border-[#333] bg-[#0a0a0a] text-[#e8e8e8] text-sm font-medium outline-none cursor-pointer transition-colors focus:border-[#d4a853]"
      >
        {children}
      </select>
    </div>
  );
}

function Btn({ children, variant = "primary", small, className = "", ...props }) {
  const variants = {
    primary: "bg-[#d4a853] text-[#0a0a0a] hover:bg-[#e8c97a]",
    ghost:   "bg-transparent text-[#888] border border-[#333] hover:border-[#555] hover:text-[#e8e8e8]",
    danger:  "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20",
    green:   "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20",
  };
  return (
    <button
      {...props}
      className={`${small ? "px-3 py-1.5 text-[12px]" : "px-5 py-2.5 text-sm"} rounded-xl font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-[0.97] ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200] p-5"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#121212] rounded-2xl w-full border border-[#222] shadow-2xl"
        style={{ maxWidth: wide ? 720 : 480, maxHeight: "90vh" }}
      >
        <div className="overflow-y-auto max-h-[90vh]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] sticky top-0 bg-[#121212] z-10">
            <h2 className="text-base font-extrabold text-[#e8e8e8]">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#222] flex items-center justify-center text-[#888] hover:bg-[#333] hover:text-[#e8e8e8] transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProductForm({ product, onSave, onCancel }) {
  const isEdit = !!product?.id;
  const [form, setForm] = useState({
    name:   product?.name   || "",
    brand:  product?.brand  || "",
    cat:    product?.cat    || "adulto",
    price:  product?.price  || "",
    tag:    product?.tag    || "",
    active: product?.active !== false,
    emoji:  product?.emoji  || "👟",
    stock:  product?.stock  || {},
    image:  product?.image  || null,
  });
  const [imgPreview, setImgPreview] = useState(product?.image || null);
  const fileRef = useRef();

  const sizePool = form.cat === "adulto" ? ALL_SIZES_ADULTO : ALL_SIZES_NINO;

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  function toggleSize(s) {
    setForm(f => {
      const st = { ...f.stock };
      s in st ? delete st[s] : (st[s] = 0);
      return { ...f, stock: st };
    });
  }

  function setStock(s, val) {
    setForm(f => ({ ...f, stock: { ...f.stock, [s]: Math.max(0, parseInt(val) || 0) } }));
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setImgPreview(ev.target.result); set("image", ev.target.result); };
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    if (!form.name || !form.brand || !form.price) return alert("Completá nombre, marca y precio");
    onSave({ ...form, id: product?.id || null, price: Number(form.price) });
  }

  const activeSizes = Object.keys(form.stock).map(Number).sort((a, b) => a - b);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-4 items-start">
        <div
          onClick={() => fileRef.current.click()}
          className="w-[100px] h-[100px] rounded-xl border-2 border-dashed border-[#333] bg-[#0a0a0a] flex items-center justify-center cursor-pointer overflow-hidden shrink-0 hover:border-[#d4a853] transition-colors duration-200"
        >
          {imgPreview ? (
            <img src={imgPreview} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl">{form.emoji}</span>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
        <div className="flex-1 flex flex-col gap-3">
          <Btn small variant="ghost" onClick={() => fileRef.current.click()}>
            <Upload size={14} /> Subir foto
          </Btn>
          <div className="flex gap-1.5 flex-wrap">
            {["👟", "👠", "👡", "👞", "🥿", "⚡", "🎨"].map(e => (
              <button
                key={e}
                onClick={() => set("emoji", e)}
                className={`text-lg rounded-lg px-2 py-1 cursor-pointer transition-all ${
                  form.emoji === e
                    ? "bg-[#d4a853] text-[#0a0a0a]"
                    : "bg-[#1a1a1a] text-[#888] border border-[#333] hover:border-[#555]"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Nombre *" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Runner Pro" />
        <Input label="Marca *" value={form.brand} onChange={e => set("brand", e.target.value)} placeholder="Nike" />
        <Input label="Precio *" type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="12500" />
        <Select label="Categoría" value={form.cat} onChange={e => { set("cat", e.target.value); set("stock", {}); }}>
          <option value="adulto">Adultos</option>
          <option value="nino">Niños</option>
        </Select>
        <Input label="Tag (etiqueta)" value={form.tag} onChange={e => set("tag", e.target.value)} placeholder="Nuevo, Oferta…" />
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[#888] uppercase tracking-[0.05em]">Estado</label>
          <div className="flex gap-2 mt-0.5">
            {[true, false].map(v => (
              <button
                key={String(v)}
                onClick={() => set("active", v)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
                  form.active === v
                    ? "bg-[#d4a853] text-[#0a0a0a]"
                    : "bg-[#1a1a1a] text-[#888] border border-[#333] hover:border-[#555]"
                }`}
              >
                {v ? "✓ Activo" : "✗ Oculto"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="text-[11px] font-bold text-[#888] uppercase tracking-[0.05em] block mb-2.5">
          Talles y stock
        </label>
        <div className="flex gap-1.5 flex-wrap mb-3">
          {sizePool.map(s => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={`px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-all ${
                s in form.stock
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold"
                  : "bg-[#1a1a1a] text-[#555] border border-[#333] hover:border-[#555]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {activeSizes.length > 0 && (
          <div className="bg-[#0a0a0a] rounded-xl p-3">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
              {activeSizes.map(s => (
                <div key={s} className="flex flex-col gap-1">
                  <label className="text-[11px] text-[#888] font-bold text-center">T.{s}</label>
                  <input
                    type="number" min="0" value={form.stock[s]}
                    onChange={e => setStock(s, e.target.value)}
                    className={`w-full px-2 py-1.5 rounded-lg border text-sm text-center outline-none bg-[#1a1a1a] ${
                      form.stock[s] === 0
                        ? "border-red-500/30 text-red-400"
                        : "border-[#333] text-[#e8e8e8]"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-end pt-3 border-t border-[#222]">
        <Btn variant="ghost" onClick={onCancel}>Cancelar</Btn>
        <Btn onClick={handleSubmit}>{isEdit ? "Guardar cambios" : "Crear producto"}</Btn>
      </div>
    </div>
  );
}

function ProductsSection() {
  const { products, setProducts } = useApp();
  const [modal, setModal] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("id", { ascending: false });
      if (!error && data) setProducts(data);
      else console.error("Error al traer productos:", error);
    }
    fetchProducts();
  }, [setProducts]);

  async function saveProduct(formData) {
    if (formData.id) {
      const { data, error } = await supabase
        .from("productos")
        .update({
          name: formData.name, brand: formData.brand, cat: formData.cat,
          price: formData.price, tag: formData.tag, active: formData.active,
          emoji: formData.emoji, stock: formData.stock, image: formData.image,
        })
        .eq("id", formData.id)
        .select();
      if (error) return alert(`Error al actualizar: ${error.message}`);
      setProducts(prev => prev.map(p => p.id === formData.id ? data[0] : p));
    } else {
      const { data, error } = await supabase
        .from("productos")
        .insert([{
          name: formData.name, brand: formData.brand, cat: formData.cat,
          price: formData.price, tag: formData.tag, active: formData.active,
          emoji: formData.emoji, stock: formData.stock, image: formData.image,
        }])
        .select();
      if (error) return alert(`Error al guardar: ${error.message}`);
      setProducts(prev => [data[0], ...prev]);
    }
    setModal(null);
  }

  async function deleteProduct(id) {
    if (window.confirm("¿Eliminar este producto permanentemente?")) {
      const { error } = await supabase.from("productos").delete().eq("id", id);
      if (error) return alert(`Error al eliminar: ${error.message}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  }

  async function toggleActive(product) {
    const next = !product.active;
    const { error } = await supabase.from("productos").update({ active: next }).eq("id", product.id);
    if (error) return alert(`Error al cambiar estado: ${error.message}`);
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, active: next } : p));
  }

  const sizes = (p) => Object.keys(p.stock || {}).map(Number).sort((a, b) => a - b);
  const totalStock = (p) => Object.values(p.stock || {}).reduce((s, v) => s + v, 0);
  const activeCount = products.filter(p => p.active).length;
  const zeroStock = products.reduce((s, p) => s + Object.values(p.stock || {}).filter(v => v === 0).length, 0);
  const adultCount = products.filter(p => p.cat === "adulto").length;
  const ninoCount = products.filter(p => p.cat === "nino").length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-extrabold text-[#e8e8e8]">Productos</h2>
          <p className="text-xs text-[#888]">{products.length} cargados en base de datos</p>
        </div>
        <Btn onClick={() => setModal("new")}>
          <Plus size={16} /> Nuevo producto
        </Btn>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", val: products.length, icon: <Package size={18} />, color: "text-[#d4a853]" },
          { label: "Activos", val: activeCount, icon: <Check size={18} />, color: "text-emerald-400" },
          { label: "Stock 0", val: zeroStock, icon: <AlertCircle size={18} />, color: "text-red-400" },
          { label: "Adulto / Niño", val: `${adultCount} / ${ninoCount}`, icon: <ImageIcon size={18} />, color: "text-blue-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#121212] rounded-xl border border-[#222] p-4">
            <div className={`${s.color} mb-1`}>{s.icon}</div>
            <div className="text-xl font-extrabold text-[#e8e8e8]">{s.val}</div>
            <div className="text-[11px] text-[#888]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#121212] rounded-2xl border border-[#222] overflow-hidden">
        {products.length === 0 ? (
          <div className="py-16 text-center text-[#555]">
            <Package size={40} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No hay productos aún. ¡Creá el primero!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#0a0a0a]">
                  {["Producto", "Categoría", "Precio", "Talles / Stock", "Estado", ""].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-[#888] uppercase tracking-[0.05em] border-b border-[#222]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#0a0a0a]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-lg overflow-hidden">
                          {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : p.emoji}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#e8e8e8]">{p.name}</div>
                          <div className="text-[11px] text-[#888]">{p.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#888]">{p.cat === "adulto" ? "👟 Adulto" : "🧒 Niño"}</td>
                    <td className="px-4 py-3 text-sm font-bold text-[#d4a853]">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {sizes(p).map(s => (
                          <span
                            key={s}
                            className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              p.stock[s] === 0
                                ? "bg-red-500/10 text-red-400"
                                : "bg-emerald-500/10 text-emerald-400"
                            }`}
                          >
                            {s}: {p.stock[s]}
                          </span>
                        ))}
                      </div>
                      <div className="text-[10px] text-[#555] mt-0.5">{totalStock(p)} pares</div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(p)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                          p.active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-[#1a1a1a] text-[#555] border border-[#333]"
                        }`}
                      >
                        {p.active ? "● Activo" : "○ Oculto"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <Btn small variant="ghost" onClick={() => setModal(p)}>Editar</Btn>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <Modal title={modal === "new" ? "Nuevo producto" : `Editar: ${modal.name}`} onClose={() => setModal(null)} wide>
            <ProductForm product={modal === "new" ? null : modal} onSave={saveProduct} onCancel={() => setModal(null)} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrdersSection() {
  const { orders, setOrders } = useApp();
  const [filter, setFilter] = useState("todos");

  function setStatus(id, status) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }

  function sendWA(order) {
    const msg = `Hola ${order.client}! ✅ Confirmamos tu pedido #${order.id}:\n\n` +
      order.items.map(i => `• ${i.name} talle ${i.size} x${i.qty}`).join("\n") +
      `\n\nTotal: ${formatPrice(order.total)}\nTe avisamos cuando esté listo para envío. 👟`;
    window.open(`https://wa.me/${order.phone}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  const counts = {
    todos: orders.length,
    pendiente:  orders.filter(o => o.status === "pendiente").length,
    confirmado: orders.filter(o => o.status === "confirmado").length,
    enviado:    orders.filter(o => o.status === "enviado").length,
  };
  const filtered = filter === "todos" ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-extrabold text-[#e8e8e8]">Pedidos</h2>
        <p className="text-xs text-[#888]">{orders.length} pedidos en total · Los pedidos se guardan en memoria por sesión</p>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.entries(counts).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
              filter === k
                ? "bg-[#d4a853] text-[#0a0a0a]"
                : "bg-[#1a1a1a] text-[#888] border border-[#333] hover:border-[#555]"
            }`}
          >
            {k.charAt(0).toUpperCase() + k.slice(1)} ({v})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#555] text-sm">
            {orders.length === 0
              ? "Los pedidos aparecerán acá cuando los clientes completen su compra"
              : "No hay pedidos en esta categoría"}
          </div>
        )}
        {filtered.map(order => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#121212] rounded-xl border border-[#222] p-5"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2.5 mb-0.5">
                  <span className="text-base font-extrabold text-[#e8e8e8]">{order.client}</span>
                  <Badge status={order.status} />
                </div>
                <div className="text-[11px] text-[#888]">Pedido #{order.id} · {order.date}</div>
              </div>
              <div className="text-lg font-extrabold text-[#d4a853]">{formatPrice(order.total)}</div>
            </div>
            <div className="flex gap-1.5 flex-wrap mb-3">
              {order.items.map((item, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-1 rounded-lg bg-[#1a1a1a] text-[#888] border border-[#333]"
                >
                  {item.name} t.{item.size} ×{item.qty}
                </span>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <Btn small variant="green" onClick={() => sendWA(order)}>
                <Check size={13} /> Confirmar por WA
              </Btn>
              {order.status === "pendiente" && (
                <Btn small variant="success" onClick={() => setStatus(order.id, "confirmado")}>
                  ✓ Confirmar
                </Btn>
              )}
              {order.status === "confirmado" && (
                <Btn small variant="ghost" onClick={() => setStatus(order.id, "enviado")}>
                  <Truck size={13} /> Marcar enviado
                </Btn>
              )}
              {order.status !== "cancelado" && (
                <Btn small variant="danger" onClick={() => setStatus(order.id, "cancelado")}>
                  Cancelar
                </Btn>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SettingsSection() {
  const [cfg, setCfg] = useState({
    shopName: "Calzado Mayorista", phone: "5491155667788",
    minOrder: 3, currency: "ARS",
    welcomeMsg: "Hola! Gracias por elegirnos. Revisá nuestro catálogo mayorista 👟",
  });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setCfg(c => ({ ...c, [k]: v }));

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <h2 className="text-lg font-extrabold text-[#e8e8e8] mb-5">Configuración</h2>
      <div className="flex flex-col gap-4">
        <div className="bg-[#121212] rounded-xl border border-[#222] p-6">
          <h3 className="text-sm font-extrabold text-[#e8e8e8] mb-4">🏪 Datos del negocio</h3>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nombre" value={cfg.shopName} onChange={e => set("shopName", e.target.value)} />
            <Input label="Teléfono WhatsApp" value={cfg.phone} onChange={e => set("phone", e.target.value)} placeholder="5491155667788" />
            <Input label="Pedido mínimo (pares)" type="number" value={cfg.minOrder} onChange={e => set("minOrder", e.target.value)} />
            <Select label="Moneda" value={cfg.currency} onChange={e => set("currency", e.target.value)}>
              <option value="ARS">ARS – Peso argentino</option>
              <option value="USD">USD – Dólar</option>
              <option value="BRL">BRL – Real</option>
            </Select>
          </div>
          <div className="mt-3 px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20">
            ⚠️ Para que el teléfono de WhatsApp cambie en el catálogo, editá también <code className="text-[#e8e8e8]">SELLER_PHONE</code> en <code className="text-[#e8e8e8]">src/data/store.js</code>
          </div>
        </div>

        <div className="bg-[#121212] rounded-xl border border-[#222] p-6">
          <h3 className="text-sm font-extrabold text-[#e8e8e8] mb-4"><span className="text-emerald-400">●</span> Mensajes WhatsApp</h3>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#888] uppercase tracking-[0.05em]">Mensaje de bienvenida</label>
              <textarea
                value={cfg.welcomeMsg}
                onChange={e => set("welcomeMsg", e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-[#333] bg-[#0a0a0a] text-[#e8e8e8] text-sm outline-none transition-colors focus:border-[#d4a853] resize-vertical placeholder:text-[#555]"
              />
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
              <strong>Preview:</strong> "{cfg.welcomeMsg}"
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-3">
          {saved && <span className="text-sm text-emerald-400 font-semibold">✓ Guardado</span>}
          <Btn onClick={handleSave}>Guardar cambios</Btn>
        </div>
      </div>
    </div>
  );
}

const NAV = [
  { id: "products", label: "Productos", icon: Package },
  { id: "orders",   label: "Pedidos",   icon: ShoppingCart },
  { id: "settings", label: "Config",    icon: Package },
];

function AdminApp() {
  const { orders } = useApp();
  const [page, setPage] = useState("products");
  const pending = orders.filter(o => o.status === "pendiente").length;

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] font-sans">
      <aside className="w-[220px] bg-[#121212] border-r border-[#222] flex flex-col px-3 py-5 sticky top-0 h-screen shrink-0">
        <div className="px-2 mb-6">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#d4a853] flex items-center justify-center text-sm">👟</div>
            <div>
              <div className="text-sm font-extrabold text-[#e8e8e8] tracking-tight">Admin</div>
              <div className="text-[11px] text-[#888]">Calzado Mayorista</div>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(n => {
            const Icon = n.icon;
            return (
              <button
                key={n.id}
                onClick={() => setPage(n.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer text-left ${
                  page === n.id
                    ? "bg-[#d4a853]/10 text-[#d4a853]"
                    : "text-[#888] hover:bg-[#1a1a1a] hover:text-[#e8e8e8]"
                }`}
              >
                <Icon size={16} />
                <span>{n.label}</span>
                {n.id === "orders" && pending > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                    {pending}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <a
          href="/#/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-[#555] hover:text-[#888] hover:bg-[#1a1a1a] transition-all duration-200 no-underline"
        >
          <ExternalLink size={14} />
          Ver catálogo
        </a>
      </aside>

      <main className="flex-1 overflow-auto py-7 px-8">
        {page === "products" && <ProductsSection />}
        {page === "orders"   && <OrdersSection />}
        {page === "settings" && <SettingsSection />}
      </main>
    </div>
  );
}

const ADMIN_USER = "admin";
const ADMIN_PASS = "calzado2025";

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [form, setForm] = useState({ user: "", pass: "" });
  const [error, setError] = useState(false);

  function handleLogin() {
    if (form.user === ADMIN_USER && form.pass === ADMIN_PASS) {
      setLoggedIn(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#121212] rounded-2xl border border-[#222] p-8 w-[360px] shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#d4a853]/20 flex items-center justify-center text-3xl mx-auto mb-4">
              👟
            </div>
            <h1 className="text-lg font-extrabold text-[#e8e8e8]">Panel Admin</h1>
            <p className="text-xs text-[#888] mt-1">Calzado Mayorista</p>
          </div>

          <div className="flex flex-col gap-3">
            <Input
              label="Usuario"
              value={form.user}
              onChange={e => setForm(f => ({ ...f, user: e.target.value }))}
              placeholder="Usuario"
            />
            <Input
              label="Contraseña"
              type="password"
              value={form.pass}
              onChange={e => setForm(f => ({ ...f, pass: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
            />

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-400 text-center"
                >
                  Usuario o contraseña incorrectos
                </motion.p>
              )}
            </AnimatePresence>

            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-xl bg-[#d4a853] text-[#0a0a0a] font-bold text-sm hover:bg-[#e8c97a] transition-all duration-200 cursor-pointer active:scale-[0.98] mt-1"
            >
              Ingresar →
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <AdminApp />;
}