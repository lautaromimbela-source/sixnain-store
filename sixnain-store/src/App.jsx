import React, { useMemo, useState } from "react";

// ──────────────────────────────────────────────────────────────────────────────
// Sixnain — clon estilo Tienda Nube (sin Tienda Nube)
// • Stack: React + TailwindCSS (sin libs externas)
// • Incluye: Header con categorías, buscador, grilla de productos, ficha rápida
//   (modal), carrito lateral, badges de pago/envío, políticas y footer.
// • Todo es client-side. Los botones de pago son placeholders que podés vincular
//   a Mercado Pago, WhatsApp o links de compra.
// ──────────────────────────────────────────────────────────────────────────────

const BRAND = {
  name: "Sixnain",
  sub: "Streetwear argentino — boxy & baggy real",
  ig: "https://instagram.com/tu_marca",
  wa: "https://wa.me/5491112345678?text=Hola!%20Quiero%20comprar%20Sixnain",
  email: "hola@sixnain.com",
};

const CATEGORIES = ["Todos", "Remeras", "Buzos", "Pantalones", "Accesorios"];

const PRODUCTS = [
  {
    id: "sxn-r001",
    name: "Remera Boxy Sixnain",
    price: 24999,
    category: "Remeras",
    colors: ["Negro", "Blanco", "Gris"],
    sizes: ["S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200",
    badge: "Nuevo",
    desc: "Algodón heavy 24/1 • corte boxy real • prelavado anti-encogimiento.",
  },
  {
    id: "sxn-b001",
    name: "Buzo Oversize Essential",
    price: 49999,
    category: "Buzos",
    colors: ["Negro", "Arena"],
    sizes: ["S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200",
    badge: "Drop FW25",
    desc: "Franela premium • capucha doble • fit oversized con hombro caído.",
  },
  {
    id: "sxn-p001",
    name: "Pantalón Baggy Cargo",
    price: 59999,
    category: "Pantalones",
    colors: ["Negro", "Oliva"],
    sizes: ["S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1516082669438-2d4d8a0ae5a8?q=80&w=1200",
    desc: "Gabardina pesada • bolsillos cargo • pierna wide.",
  },
  {
    id: "sxn-a001",
    name: "Gorra Snapback Logo",
    price: 19999,
    category: "Accesorios",
    colors: ["Negro"],
    sizes: ["U"],
    img: "https://images.unsplash.com/photo-1520975940209-aad799ed87cd?q=80&w=1200",
    desc: "Visera plana • bordado frontal Sixnain.",
  },
  {
    id: "sxn-r002",
    name: "Remera Heavyweight",
    price: 28999,
    category: "Remeras",
    colors: ["Blanco", "Crema"],
    sizes: ["S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1548883354-7622d3dfd6b5?q=80&w=1200",
    desc: "Algodón peinado • cuello alto • caída recta.",
  },
];

function currency(n) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function SixnainStore() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("Todos");
  const [cart, setCart] = useState([]); // {id, name, price, img, size, color, qty}
  const [active, setActive] = useState(null); // producto activo para modal
  const [drawer, setDrawer] = useState(false);

  const list = useMemo(() => {
    return PRODUCTS.filter((p) => (cat === "Todos" ? true : p.category === cat))
      .filter((p) =>
        query.trim() ? p.name.toLowerCase().includes(query.toLowerCase()) : true
      );
  }, [query, cat]);

  const subtotal = cart.reduce((a, i) => a + i.price * i.qty, 0);

  function addToCart(p, { size, color } = {}) {
    const key = `${p.id}-${size ?? p.sizes?.[0] ?? "U"}-${color ?? p.colors?.[0] ?? ""}`;
    setCart((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          key,
          id: p.id,
          name: p.name,
          price: p.price,
          img: p.img,
          size: size ?? p.sizes?.[0] ?? "U",
          color: color ?? p.colors?.[0] ?? "",
          qty: 1,
        },
      ];
    });
    setDrawer(true);
  }

  function removeFromCart(key) {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }

  function updateQty(key, delta) {
    setCart((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <TopBar />
      <Header onSearch={setQuery} query={query} cartCount={cart.length} onOpenCart={() => setDrawer(true)} />
      <Nav cat={cat} setCat={setCat} />

      {/* Banner estilo tienda */}
      <section className="bg-neutral-100 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid md:grid-cols-3 gap-4 text-sm">
          <Badge title="3 cuotas sin interés" subtitle="con tarjetas seleccionadas" />
          <Badge title="Envíos a todo el país" subtitle="gratis desde $80.000" />
          <Badge title="Cambios fáciles" subtitle="10 días desde la compra" />
        </div>
      </section>

      {/* Catálogo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold">Catálogo</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p) => (
            <ProductCard key={p.id} p={p} onQuick={() => setActive(p)} onAdd={(opts) => addToCart(p, opts)} />
          ))}
        </div>
      </section>

      <Policies />
      <Footer />

      {active && (
        <QuickView p={active} onClose={() => setActive(null)} onAdd={(opts) => addToCart(active, opts)} />)
      }
      <CartDrawer
        open={drawer}
        onClose={() => setDrawer(false)}
        items={cart}
        subtotal={subtotal}
        onInc={(k) => updateQty(k, +1)}
        onDec={(k) => updateQty(k, -1)}
        onRemove={removeFromCart}
      />
    </div>
  );
}

function TopBar() {
  return (
    <div className="text-center text-xs bg-neutral-900 text-white py-2">Sixnain • Envíos a todo el país • Hecho en Argentina</div>
  );
}

function Header({ onSearch, query, cartCount, onOpenCart }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" className="font-black tracking-tight text-xl">sixnain<span className="text-neutral-400">.store</span></a>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#catalogo" className="hover:underline">Novedades</a>
          <a href="#catalogo" className="hover:underline">Colección</a>
          <a href="#catalogo" className="hover:underline">Ofertas</a>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar en Sixnain…"
            className="hidden sm:block w-56 bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
          />
          <button onClick={onOpenCart} className="relative px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-sm">
            Carrito
            {cartCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs rounded-full bg-neutral-900 text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function Nav({ cat, setCat }) {
  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-xl text-sm border ${
              cat === c ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-200 hover:bg-neutral-100"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </nav>
  );
}

function Badge({ title, subtitle }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-neutral-200">
      <div className="text-2xl">🛒</div>
      <div>
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-neutral-500 text-xs">{subtitle}</div>
      </div>
    </div>
  );
}

function ProductCard({ p, onQuick, onAdd }) {
  const [selSize, setSelSize] = useState(p.sizes?.[0] ?? "U");
  const [selColor, setSelColor] = useState(p.colors?.[0] ?? "");

  return (
    <article id="catalogo" className="group bg-white rounded-2xl overflow-hidden border border-neutral-200">
      <div className="relative">
        <img src={p.img} alt={p.name} className="aspect-square w-full object-cover" />
        {p.badge && (
          <span className="absolute left-3 top-3 bg-white/90 text-neutral-900 text-xs font-semibold px-2 py-1 rounded-full border border-neutral-200">
            {p.badge}
          </span>
        )}
        <button onClick={onQuick} className="absolute right-3 top-3 text-xs bg-neutral-900 text-white px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">
          Vista rápida
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold leading-tight line-clamp-1">{p.name}</h3>
        <div className="mt-1 text-sm text-neutral-500">{p.category}</div>
        <div className="mt-2 font-bold">{currency(p.price)}</div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {p.colors?.map((c) => (
            <button key={c} onClick={() => setSelColor(c)} className={`px-2 py-1 rounded-full border ${selColor === c ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-300"}`}>{c}</button>
          ))}
          {p.sizes?.map((s) => (
            <button key={s} onClick={() => setSelSize(s)} className={`px-2 py-1 rounded-full border ${selSize === s ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-300"}`}>{s}</button>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onAdd({ size: selSize, color: selColor })}
            className="flex-1 text-center bg-neutral-900 text-white py-2 rounded-xl font-semibold hover:opacity-90"
          >
            Agregar al carrito
          </button>
          <a href={BRAND.wa} target="_blank" className="px-3 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-100">
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

function QuickView({ p, onClose, onAdd }) {
  const [size, setSize] = useState(p.sizes?.[0] ?? "U");
  const [color, setColor] = useState(p.colors?.[0] ?? "");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden">
        <div className="grid sm:grid-cols-2">
          <img src={p.img} alt={p.name} className="w-full h-64 sm:h-full object-cover" />
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold">{p.name}</h3>
              <button onClick={onClose} className="text-neutral-500 hover:text-black">✕</button>
            </div>
            <div className="mt-1 text-sm text-neutral-500">{p.category}</div>
            <div className="mt-2 text-2xl font-extrabold">{currency(p.price)}</div>
            <p className="mt-3 text-sm text-neutral-700">{p.desc}</p>

            <div className="mt-4 space-y-3 text-sm">
              {p.colors?.length ? (
                <div className="flex gap-2 flex-wrap items-center"><span className="text-neutral-500">Color:</span>{p.colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)} className={`px-2 py-1 rounded-full border ${color === c ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-300"}`}>{c}</button>
                ))}</div>
              ) : null}
              {p.sizes?.length ? (
                <div className="flex gap-2 flex-wrap items-center"><span className="text-neutral-500">Talle:</span>{p.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)} className={`px-2 py-1 rounded-full border ${size === s ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-300"}`}>{s}</button>
                ))}</div>
              ) : null}
            </div>

            <div className="mt-5 flex gap-2">
              <button onClick={() => { onAdd({ size, color }); onClose(); }} className="flex-1 bg-neutral-900 text-white py-2 rounded-xl font-semibold">Agregar al carrito</button>
              <a href={BRAND.wa} target="_blank" className="px-3 py-2 rounded-xl border border-neutral-300">WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose, items, subtotal, onInc, onDec, onRemove }) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <aside className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white border-l border-neutral-200 transform transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-4 flex items-center justify-between border-b border-neutral-200">
          <h3 className="font-bold">Tu carrito</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-black">✕</button>
        </div>
        <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-auto">
          {items.length === 0 && <p className="text-sm text-neutral-600">Tu carrito está vacío.</p>}
          {items.map((i) => (
            <div key={i.key} className="flex gap-3 border border-neutral-200 rounded-xl p-2">
              <img src={i.img} alt={i.name} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{i.name}</div>
                <div className="text-xs text-neutral-500">Talle {i.size} · {i.color}</div>
                <div className="mt-1 font-bold">{currency(i.price)}</div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <button onClick={() => onDec(i.key)} className="px-2 border rounded-lg">−</button>
                  <span>{i.qty}</span>
                  <button onClick={() => onInc(i.key)} className="px-2 border rounded-lg">＋</button>
                  <button onClick={() => onRemove(i.key)} className="ml-auto text-neutral-500 hover:text-red-600">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center justify-between font-semibold">
            <span>Subtotal</span>
            <span>{currency(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">El envío se calcula en el checkout. Cambios dentro de 10 días.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <a href="#" className="text-center border border-neutral-300 rounded-xl py-2 text-sm">Seguir comprando</a>
            <a href="https://mpago.la/" target="_blank" className="text-center bg-neutral-900 text-white rounded-xl py-2 text-sm font-semibold">Ir a pagar</a>
          </div>
          <div className="mt-3 text-xs text-neutral-500">Podés reemplazar el botón por tu link de Mercado Pago, Tienda Nube o WhatsApp.</div>
        </div>
      </aside>
    </div>
  );
}

function Policies() {
  return (
    <section className="bg-neutral-50 border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-4 gap-6 text-sm">
        <div>
          <div className="font-semibold">Pagos</div>
          <ul className="mt-2 space-y-1 text-neutral-600">
            <li>Mercado Pago • Tarjeta • Débito</li>
            <li>Transferencia bancaria</li>
            <li>3 cuotas sin interés (bancos seleccionados)</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Envíos</div>
          <ul className="mt-2 space-y-1 text-neutral-600">
            <li>Andreani / Correo Argentino</li>
            <li>Gratis desde $80.000</li>
            <li>Pick-up en punto de retiro (coordinar)</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Cambios & Devoluciones</div>
          <p className="mt-2 text-neutral-600">Tenés 10 días corridos para cambios por talle/color. La prenda debe estar sin uso y con etiqueta.</p>
        </div>
        <div>
          <div className="font-semibold">Contacto</div>
          <ul className="mt-2 space-y-1 text-neutral-600">
            <li><a href={BRAND.ig} target="_blank" className="hover:underline">Instagram</a></li>
            <li><a href={BRAND.wa} target="_blank" className="hover:underline">WhatsApp</a></li>
            <li><a href={`mailto:${BRAND.email}`} className="hover:underline">{BRAND.email}</a></li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6 text-sm text-neutral-600">
        <div>
          <div className="font-bold text-neutral-900">Sixnain</div>
          <p className="mt-2">Ediciones limitadas • producción nacional</p>
        </div>
        <div>
          <div className="font-semibold text-neutral-900">Legales</div>
          <ul className="mt-2 space-y-1">
            <li>Términos y condiciones</li>
            <li>Política de privacidad</li>
            <li>Política de cambio y devolución</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-neutral-900">Newsletter</div>
          <form className="mt-2 flex gap-2" onSubmit={(e)=>{e.preventDefault(); alert("¡Gracias por unirte a Sixnain!");}}>
            <input type="email" required placeholder="tu@email.com" className="flex-1 bg-white border border-neutral-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-300" />
            <button className="bg-neutral-900 text-white px-4 rounded-xl">Suscribirme</button>
          </form>
        </div>
      </div>
      <div className="text-center text-xs text-neutral-500 mt-6">© {new Date().getFullYear()} Sixnain. Todos los derechos reservados.</div>
    </footer>
  );
}