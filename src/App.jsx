import { useState, useMemo } from "react";

const PRODUCTS = [
  { id:1, name:"Obsidian Chronograph", brand:"Aurel", price:1290, comparePrice:1599, category:"watches", rating:4.8, reviews:142, stock:8, tag:"Bestseller", images:["⌚"], desc:"Swiss movement, sapphire crystal, 200m water resistant. A timepiece built for those who refuse to settle.", colors:["Midnight","Rose Gold","Steel"], sizes:[] },
  { id:2, name:"Velvet Noir Blazer", brand:"Maison Karà", price:389, comparePrice:520, category:"fashion", rating:4.6, reviews:87, stock:12, tag:"New", images:["🧥"], desc:"Italian-cut double-breasted blazer in pure merino velvet. Unlined for effortless drape.", colors:["Black","Navy","Bordeaux"], sizes:["XS","S","M","L","XL"] },
  { id:3, name:"Carbon Shell Headphones", brand:"Resonance", price:449, comparePrice:null, category:"tech", rating:4.9, reviews:312, stock:5, tag:"Top Rated", images:["🎧"], desc:"Active noise cancellation, 40-hour battery, LDAC Hi-Res Audio. Sound engineered for perfection.", colors:["Matte Black","Chalk White"], sizes:[] },
  { id:4, name:"Côte d'Azur Fragrance", brand:"Maison Libre", price:195, comparePrice:null, category:"beauty", rating:4.7, reviews:203, stock:20, tag:"", images:["🧴"], desc:"Top notes of bergamot and sea salt. Heart of iris, dry down of warm sandalwood and white musk.", colors:["50ml","100ml"], sizes:[] },
  { id:5, name:"Titan Carry-On", brand:"Apex Travel", price:720, comparePrice:890, category:"travel", rating:4.5, reviews:65, stock:15, tag:"Sale", images:["🧳"], desc:"Aerospace-grade aluminum shell, TSA-approved locks, 360° spinner wheels. Built for first class.", colors:["Gunmetal","Champagne","Midnight"], sizes:[] },
  { id:6, name:"Marble Resin Desk Set", brand:"Studio Form", price:245, comparePrice:null, category:"home", rating:4.4, reviews:38, stock:9, tag:"New", images:["🗿"], desc:"Hand-cast in Italian Carrara marble resin. Pen holder, card tray, and letter opener.", colors:["White","Black Veined"], sizes:[] },
  { id:7, name:"Heritage Leather Wallet", brand:"Craftsmark", price:165, comparePrice:210, category:"fashion", rating:4.8, reviews:189, stock:30, tag:"", images:["👜"], desc:"Full-grain Horween leather, 8 card slots, RFID blocking. Develops a beautiful patina.", colors:["Tan","Espresso","Black"], sizes:[] },
  { id:8, name:"Graphite Smart Ring", brand:"Orbit", price:329, comparePrice:null, category:"tech", rating:4.3, reviews:56, stock:7, tag:"New", images:["💍"], desc:"Health monitoring, NFC payments, sleep tracking. Titanium body, 7-day battery.", colors:["Graphite","Gold","Silver"], sizes:["5","6","7","8","9","10"] },
];

const CATEGORIES = [
  { id:"all", label:"All", icon:"✦" },
  { id:"watches", label:"Watches", icon:"⌚" },
  { id:"fashion", label:"Fashion", icon:"🧥" },
  { id:"tech", label:"Tech", icon:"🎧" },
  { id:"beauty", label:"Beauty", icon:"🧴" },
  { id:"travel", label:"Travel", icon:"🧳" },
  { id:"home", label:"Home", icon:"🗿" },
];

const gold = "#C9A84C";
const goldLight = "#E8C870";
const dark = "#0D0D0F";
const surface = "#16161A";
const surface2 = "#1E1E24";
const border = "#2A2A35";
const text = "#F0EDE8";
const muted = "#888898";

const css = {
  app: { minHeight:"100vh", background:dark, color:text, fontFamily:"'Georgia', 'Times New Roman', serif", overflowX:"hidden" },
  nav: { background:`${dark}EE`, backdropFilter:"blur(16px)", borderBottom:`1px solid ${border}`, position:"sticky", top:0, zIndex:100, padding:"0 1.5rem" },
  navInner: { maxWidth:1280, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 },
  logo: { fontFamily:"Georgia, serif", fontSize:20, fontWeight:700, color:text, letterSpacing:"0.08em", cursor:"pointer" },
  logoAccent: { color:gold },
  navLinks: { display:"flex", gap:8, alignItems:"center" },
  navBtn: (active) => ({ background:active?`${gold}18`:"transparent", border:`1px solid ${active?gold:border}`, color:active?gold:muted, padding:"6px 14px", borderRadius:6, fontSize:13, cursor:"pointer", fontFamily:"'Helvetica Neue', sans-serif", letterSpacing:"0.05em", transition:"all 0.2s" }),
  cartBtn: { background:gold, color:dark, border:"none", padding:"8px 18px", borderRadius:6, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Helvetica Neue', sans-serif", letterSpacing:"0.05em", display:"flex", alignItems:"center", gap:6 },
};

function Nav({ view, setView, cartCount, setShowCart }) {
  return (
    <nav style={css.nav}>
      <div style={css.navInner}>
        <div style={css.logo} onClick={() => setView("home")}>
          ARC<span style={css.logoAccent}>•</span>ADE
        </div>
        <div style={{display:"flex", gap:6}}>
          {["home","shop"].map(v => (
            <button key={v} style={css.navBtn(view===v)} onClick={() => setView(v)}>
              {v.toUpperCase()}
            </button>
          ))}
        </div>
        <button style={css.cartBtn} onClick={() => setShowCart(true)}>
          <span>🛒</span> {cartCount > 0 ? `Cart (${cartCount})` : "Cart"}
        </button>
      </div>
    </nav>
  );
}

function StarRating({ rating }) {
  return (
    <span style={{ color:gold, fontSize:13, letterSpacing:2 }}>
      {"★".repeat(Math.round(rating))}{"☆".repeat(5-Math.round(rating))}
    </span>
  );
}

function PriceTag({ price, comparePrice }) {
  const disc = comparePrice ? Math.round((1 - price/comparePrice)*100) : 0;
  return (
    <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
      <span style={{ fontSize:22, fontWeight:700, color:gold, fontFamily:"'Helvetica Neue', sans-serif" }}>
        ${price.toLocaleString()}
      </span>
      {comparePrice && <>
        <span style={{ fontSize:14, color:muted, textDecoration:"line-through", fontFamily:"sans-serif" }}>${comparePrice.toLocaleString()}</span>
        <span style={{ fontSize:11, background:`${gold}20`, color:gold, padding:"2px 7px", borderRadius:12, fontFamily:"sans-serif", fontWeight:700 }}>-{disc}%</span>
      </>}
    </div>
  );
}

function ProductCard({ product, onClick, onAdd }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={() => onClick(product)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background:surface, border:`1px solid ${hover ? gold+"44" : border}`, borderRadius:12, overflow:"hidden", cursor:"pointer", transition:"all 0.3s", transform:hover?"translateY(-4px)":"none", boxShadow:hover?`0 20px 40px ${dark}AA`:"none" }}
    >
      <div style={{ background:surface2, height:200, display:"flex", alignItems:"center", justifyContent:"center", fontSize:72, position:"relative" }}>
        {product.images[0]}
        {product.tag && (
          <span style={{ position:"absolute", top:12, left:12, background:gold, color:dark, fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:12, fontFamily:"sans-serif", letterSpacing:"0.05em" }}>
            {product.tag}
          </span>
        )}
      </div>
      <div style={{ padding:"1rem 1.25rem" }}>
        <div style={{ fontSize:11, color:muted, letterSpacing:"0.1em", marginBottom:4, fontFamily:"sans-serif" }}>{product.brand.toUpperCase()}</div>
        <div style={{ fontSize:16, fontWeight:600, marginBottom:8, color:text }}>{product.name}</div>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
          <StarRating rating={product.rating} />
          <span style={{ fontSize:12, color:muted, fontFamily:"sans-serif" }}>({product.reviews})</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <PriceTag price={product.price} comparePrice={product.comparePrice} />
          <button
            onClick={e => { e.stopPropagation(); onAdd(product); }}
            style={{ background:"transparent", border:`1px solid ${gold}`, color:gold, padding:"7px 14px", borderRadius:6, fontSize:12, cursor:"pointer", fontFamily:"sans-serif", fontWeight:600, transition:"all 0.2s" }}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}

function HomePage({ setView, setSelectedProduct, cart, addToCart }) {
  const featured = PRODUCTS.filter(p => p.tag === "Bestseller" || p.tag === "Top Rated").slice(0, 4);
  return (
    <div>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg, ${dark} 0%, #1a1508 50%, ${dark} 100%)`, minHeight:520, display:"flex", alignItems:"center", position:"relative", overflow:"hidden", padding:"4rem 1.5rem" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:600, background:`${gold}06`, borderRadius:"50%", border:`1px solid ${gold}15` }} />
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:400, height:400, background:`${gold}06`, borderRadius:"50%", border:`1px solid ${gold}10` }} />
        <div style={{ maxWidth:1280, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ fontSize:11, color:gold, letterSpacing:"0.3em", marginBottom:16, fontFamily:"sans-serif" }}>CURATED LUXURY · DELIVERED</div>
          <h1 style={{ fontSize:"clamp(2.5rem,6vw,4.5rem)", fontWeight:700, lineHeight:1.1, marginBottom:24, maxWidth:640 }}>
            Objects of <br />
            <span style={{ color:gold, fontStyle:"italic" }}>Rare Distinction</span>
          </h1>
          <p style={{ fontSize:17, color:muted, marginBottom:36, maxWidth:480, lineHeight:1.7, fontFamily:"sans-serif" }}>
            A tightly edited collection of the world's finest goods — each piece selected for its extraordinary character.
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <button onClick={() => setView("shop")} style={{ background:gold, color:dark, border:"none", padding:"14px 32px", borderRadius:7, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"sans-serif", letterSpacing:"0.05em" }}>
              Shop Collection
            </button>
            <button style={{ background:"transparent", color:text, border:`1px solid ${border}`, padding:"14px 32px", borderRadius:7, fontSize:14, cursor:"pointer", fontFamily:"sans-serif", letterSpacing:"0.05em" }}>
              Our Story
            </button>
          </div>
        </div>
        <div style={{ position:"absolute", right:"5%", top:"50%", transform:"translateY(-50%)", fontSize:160, opacity:0.07, userSelect:"none" }}>⌚</div>
      </div>

      {/* Categories */}
      <div style={{ background:surface, borderBottom:`1px solid ${border}`, overflowX:"auto" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", padding:"0 1.5rem", gap:0 }}>
          {CATEGORIES.slice(1).map(cat => (
            <button key={cat.id} onClick={() => setView("shop")} style={{ background:"transparent", border:"none", borderBottom:`2px solid transparent`, color:muted, padding:"1rem 1.25rem", cursor:"pointer", fontFamily:"sans-serif", fontSize:13, letterSpacing:"0.05em", whiteSpace:"nowrap", display:"flex", flexDirection:"column", alignItems:"center", gap:4, transition:"all 0.2s" }}>
              <span style={{ fontSize:22 }}>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"3rem 1.5rem" }}>
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:"2rem" }}>
          <div>
            <div style={{ fontSize:11, color:gold, letterSpacing:"0.25em", marginBottom:8, fontFamily:"sans-serif" }}>HANDPICKED</div>
            <h2 style={{ fontSize:28, fontWeight:700, margin:0 }}>Featured Pieces</h2>
          </div>
          <button onClick={() => setView("shop")} style={{ background:"transparent", color:gold, border:"none", fontSize:14, cursor:"pointer", fontFamily:"sans-serif", letterSpacing:"0.05em" }}>
            View All →
          </button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:20 }}>
          {featured.map(p => (
            <ProductCard key={p.id} product={p} onClick={prod => { setSelectedProduct(prod); setView("product"); }} onAdd={addToCart} />
          ))}
        </div>
      </div>

      {/* Trust bar */}
      <div style={{ background:surface, borderTop:`1px solid ${border}`, borderBottom:`1px solid ${border}`, padding:"2rem 1.5rem" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:20, textAlign:"center" }}>
          {[
            { icon:"🛡️", title:"Authenticity Guaranteed", sub:"Every item verified" },
            { icon:"📦", title:"Free Shipping", sub:"On orders over $200" },
            { icon:"↩️", title:"30-Day Returns", sub:"No questions asked" },
            { icon:"💬", title:"White Glove Support", sub:"7 days a week" },
          ].map(item => (
            <div key={item.title}>
              <div style={{ fontSize:28, marginBottom:8 }}>{item.icon}</div>
              <div style={{ fontSize:14, fontWeight:600, marginBottom:4, color:text }}>{item.title}</div>
              <div style={{ fontSize:12, color:muted, fontFamily:"sans-serif" }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShopPage({ setSelectedProduct, setView, addToCart }) {
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [priceMax, setPriceMax] = useState(2000);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(p => {
      if (cat !== "all" && p.category !== cat) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
      if (p.price > priceMax) return false;
      return true;
    });
    if (sort === "low") list = [...list].sort((a,b) => a.price - b.price);
    else if (sort === "high") list = [...list].sort((a,b) => b.price - a.price);
    else if (sort === "rating") list = [...list].sort((a,b) => b.rating - a.rating);
    return list;
  }, [cat, sort, search, priceMax]);

  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"2rem 1.5rem", display:"grid", gridTemplateColumns:"220px 1fr", gap:32, alignItems:"start" }}>
      {/* Sidebar */}
      <div style={{ background:surface, border:`1px solid ${border}`, borderRadius:12, padding:"1.5rem", position:"sticky", top:80 }}>
        <div style={{ fontSize:11, color:gold, letterSpacing:"0.2em", marginBottom:16, fontFamily:"sans-serif" }}>CATEGORIES</div>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{ display:"block", width:"100%", textAlign:"left", background:cat===c.id?`${gold}15`:"transparent", border:`1px solid ${cat===c.id?gold:border}`, color:cat===c.id?gold:muted, padding:"9px 12px", borderRadius:7, fontSize:13, cursor:"pointer", marginBottom:6, fontFamily:"sans-serif", transition:"all 0.2s" }}>
            {c.icon} {c.label}
          </button>
        ))}
        <div style={{ marginTop:24, paddingTop:20, borderTop:`1px solid ${border}` }}>
          <div style={{ fontSize:11, color:gold, letterSpacing:"0.2em", marginBottom:12, fontFamily:"sans-serif" }}>MAX PRICE</div>
          <input type="range" min={100} max={2000} step={50} value={priceMax} onChange={e => setPriceMax(+e.target.value)} style={{ width:"100%", accentColor:gold }} />
          <div style={{ fontSize:13, color:text, fontFamily:"sans-serif", marginTop:6 }}>${priceMax.toLocaleString()}</div>
        </div>
      </div>

      {/* Products */}
      <div>
        <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap", alignItems:"center" }}>
          <input
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex:1, minWidth:180, background:surface, border:`1px solid ${border}`, color:text, padding:"9px 14px", borderRadius:7, fontSize:13, fontFamily:"sans-serif", outline:"none" }}
          />
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ background:surface, border:`1px solid ${border}`, color:text, padding:"9px 12px", borderRadius:7, fontSize:13, fontFamily:"sans-serif", cursor:"pointer" }}>
            <option value="featured">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <span style={{ fontSize:13, color:muted, fontFamily:"sans-serif" }}>{filtered.length} items</span>
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"4rem", color:muted, fontFamily:"sans-serif" }}>No products match your filters.</div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:20 }}>
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onClick={prod => { setSelectedProduct(prod); setView("product"); }} onAdd={addToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductPage({ product, addToCart, setView }) {
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0] || null);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"2.5rem 1.5rem" }}>
      <button onClick={() => setView("shop")} style={{ background:"transparent", border:"none", color:muted, fontSize:13, cursor:"pointer", fontFamily:"sans-serif", marginBottom:24, display:"flex", alignItems:"center", gap:6 }}>
        ← Back to Shop
      </button>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"start" }}>
        {/* Image */}
        <div>
          <div style={{ background:surface2, borderRadius:16, border:`1px solid ${border}`, height:420, display:"flex", alignItems:"center", justifyContent:"center", fontSize:140, marginBottom:16 }}>
            {product.images[0]}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ flex:1, background:surface2, borderRadius:10, border:`1px solid ${border}`, height:80, display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, cursor:"pointer" }}>
                {product.images[0]}
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div style={{ fontSize:11, color:gold, letterSpacing:"0.2em", marginBottom:8, fontFamily:"sans-serif" }}>{product.brand.toUpperCase()}</div>
          <h1 style={{ fontSize:30, fontWeight:700, marginBottom:12, lineHeight:1.2 }}>{product.name}</h1>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <StarRating rating={product.rating} />
            <span style={{ fontSize:13, color:muted, fontFamily:"sans-serif" }}>{product.rating} · {product.reviews} reviews</span>
          </div>
          <PriceTag price={product.price} comparePrice={product.comparePrice} />
          <p style={{ color:muted, lineHeight:1.7, marginTop:20, marginBottom:24, fontFamily:"sans-serif", fontSize:15 }}>{product.desc}</p>

          {/* Color */}
          {product.colors.length > 0 && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:12, color:muted, letterSpacing:"0.1em", marginBottom:10, fontFamily:"sans-serif" }}>
                {product.sizes.length > 0 ? "COLOR" : "OPTION"}: <span style={{ color:text }}>{color}</span>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {product.colors.map(c => (
                  <button key={c} onClick={() => setColor(c)} style={{ background:color===c?`${gold}20`:"transparent", border:`1px solid ${color===c?gold:border}`, color:color===c?gold:muted, padding:"7px 14px", borderRadius:6, fontSize:12, cursor:"pointer", fontFamily:"sans-serif" }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes.length > 0 && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:12, color:muted, letterSpacing:"0.1em", marginBottom:10, fontFamily:"sans-serif" }}>
                SIZE: <span style={{ color:text }}>{size}</span>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)} style={{ background:size===s?`${gold}20`:"transparent", border:`1px solid ${size===s?gold:border}`, color:size===s?gold:muted, width:44, height:44, borderRadius:6, fontSize:13, cursor:"pointer", fontFamily:"sans-serif" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Add */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:28 }}>
            <div style={{ display:"flex", alignItems:"center", border:`1px solid ${border}`, borderRadius:7, overflow:"hidden" }}>
              <button onClick={() => setQty(Math.max(1,qty-1))} style={{ background:"transparent", border:"none", color:text, width:40, height:48, cursor:"pointer", fontSize:18 }}>−</button>
              <span style={{ width:40, textAlign:"center", fontFamily:"sans-serif", fontSize:15 }}>{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock,qty+1))} style={{ background:"transparent", border:"none", color:text, width:40, height:48, cursor:"pointer", fontSize:18 }}>+</button>
            </div>
            <button onClick={handleAdd} style={{ flex:1, background:added?`${gold}90`:gold, color:dark, border:"none", padding:"14px 24px", borderRadius:7, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"sans-serif", letterSpacing:"0.05em", transition:"all 0.3s" }}>
              {added ? "✓ Added to Cart" : "Add to Cart"}
            </button>
          </div>
          <div style={{ marginTop:16, fontSize:12, color:muted, fontFamily:"sans-serif" }}>
            ✓ Only {product.stock} left in stock · Free shipping over $200
          </div>

          {/* Details */}
          <div style={{ marginTop:28, paddingTop:24, borderTop:`1px solid ${border}` }}>
            {[["SKU", `ARC-${String(product.id).padStart(4,"0")}`], ["Category", product.category], ["In Stock", product.stock + " units"]].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${border}20`, fontSize:13, fontFamily:"sans-serif" }}>
                <span style={{ color:muted }}>{k}</span>
                <span style={{ color:text, textTransform:"capitalize" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ show, onClose, cart, removeFromCart, updateQty, setView }) {
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const shipping = total >= 200 ? 0 : 25;
  const tax = Math.round(total * 0.08);

  if (!show) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:200 }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)" }} />
      <div style={{ position:"absolute", right:0, top:0, bottom:0, width:420, background:surface, borderLeft:`1px solid ${border}`, display:"flex", flexDirection:"column", overflowY:"auto" }}>
        <div style={{ padding:"1.5rem", borderBottom:`1px solid ${border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2 style={{ margin:0, fontSize:20 }}>Your Cart ({cart.length})</h2>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:muted, fontSize:22, cursor:"pointer" }}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, color:muted, fontFamily:"sans-serif" }}>
            <span style={{ fontSize:48 }}>🛒</span>
            <p>Your cart is empty</p>
            <button onClick={() => { onClose(); setView("shop"); }} style={{ background:gold, color:dark, border:"none", padding:"10px 24px", borderRadius:7, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"sans-serif" }}>Shop Now</button>
          </div>
        ) : (
          <>
            <div style={{ flex:1, overflowY:"auto", padding:"1rem 1.5rem" }}>
              {cart.map(item => (
                <div key={item.id} style={{ display:"flex", gap:14, padding:"14px 0", borderBottom:`1px solid ${border}` }}>
                  <div style={{ background:surface2, borderRadius:8, width:64, height:64, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, flexShrink:0 }}>{item.image}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:600, marginBottom:2 }}>{item.name}</div>
                    <div style={{ fontSize:12, color:muted, fontFamily:"sans-serif", marginBottom:8 }}>{item.brand}</div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", border:`1px solid ${border}`, borderRadius:5, overflow:"hidden" }}>
                        <button onClick={() => updateQty(item.id, item.qty-1)} style={{ background:"transparent", border:"none", color:text, width:28, height:28, cursor:"pointer" }}>−</button>
                        <span style={{ width:24, textAlign:"center", fontSize:13, fontFamily:"sans-serif" }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty+1)} style={{ background:"transparent", border:"none", color:text, width:28, height:28, cursor:"pointer" }}>+</button>
                      </div>
                      <span style={{ color:gold, fontWeight:700, fontFamily:"sans-serif" }}>${(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background:"transparent", border:"none", color:muted, cursor:"pointer", alignSelf:"flex-start", fontSize:16, paddingLeft:4 }}>✕</button>
                </div>
              ))}
            </div>
            <div style={{ padding:"1.5rem", borderTop:`1px solid ${border}` }}>
              {[["Subtotal", `$${total.toLocaleString()}`], ["Shipping", shipping===0?"Free":`$${shipping}`], ["Tax (8%)", `$${tax}`]].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:13, fontFamily:"sans-serif", padding:"5px 0", color:muted }}>
                  <span>{k}</span><span style={{ color:text }}>{v}</span>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:17, fontWeight:700, padding:"12px 0", borderTop:`1px solid ${border}`, marginTop:8 }}>
                <span>Total</span>
                <span style={{ color:gold }}>${(total + shipping + tax).toLocaleString()}</span>
              </div>
              <button onClick={() => { onClose(); setView("checkout"); }} style={{ width:"100%", background:gold, color:dark, border:"none", padding:"14px", borderRadius:7, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"sans-serif", letterSpacing:"0.05em", marginTop:12 }}>
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CheckoutPage({ cart, clearCart, setView }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:"", email:"", street:"", city:"", zip:"", card:"", expiry:"", cvv:"" });
  const [done, setDone] = useState(false);

  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const shipping = total >= 200 ? 0 : 25;
  const tax = Math.round(total * 0.08);
  const grand = total + shipping + tax;

  const upd = (k) => (e) => setForm(f => ({...f, [k]:e.target.value}));

  const inputStyle = { background:surface2, border:`1px solid ${border}`, color:text, padding:"11px 14px", borderRadius:7, fontSize:14, fontFamily:"sans-serif", width:"100%", boxSizing:"border-box", outline:"none" };

  if (done) return (
    <div style={{ maxWidth:500, margin:"0 auto", padding:"5rem 1.5rem", textAlign:"center" }}>
      <div style={{ fontSize:72, marginBottom:24 }}>🎉</div>
      <h2 style={{ fontSize:28, marginBottom:12, color:gold }}>Order Confirmed!</h2>
      <p style={{ color:muted, fontFamily:"sans-serif", lineHeight:1.7, marginBottom:32 }}>
        Thank you for your order. You'll receive a confirmation email at <strong style={{ color:text }}>{form.email || "your email"}</strong>. Your items will ship within 1-2 business days.
      </p>
      <div style={{ background:surface, border:`1px solid ${border}`, borderRadius:12, padding:"1.5rem", marginBottom:28, textAlign:"left" }}>
        <div style={{ fontSize:12, color:gold, letterSpacing:"0.15em", marginBottom:12, fontFamily:"sans-serif" }}>ORDER SUMMARY</div>
        {cart.map(i => (
          <div key={i.id} style={{ display:"flex", justifyContent:"space-between", fontSize:13, fontFamily:"sans-serif", padding:"4px 0", color:muted }}>
            <span>{i.name} × {i.qty}</span>
            <span style={{ color:text }}>${(i.price*i.qty).toLocaleString()}</span>
          </div>
        ))}
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:16, fontWeight:700, paddingTop:12, marginTop:8, borderTop:`1px solid ${border}` }}>
          <span>Total Paid</span>
          <span style={{ color:gold }}>${grand.toLocaleString()}</span>
        </div>
      </div>
      <button onClick={() => { clearCart(); setView("home"); }} style={{ background:gold, color:dark, border:"none", padding:"13px 32px", borderRadius:7, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"sans-serif" }}>
        Back to Home
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"2.5rem 1.5rem", display:"grid", gridTemplateColumns:"1fr 340px", gap:32, alignItems:"start" }}>
      <div>
        {/* Steps */}
        <div style={{ display:"flex", gap:0, marginBottom:32, background:surface2, borderRadius:10, overflow:"hidden", border:`1px solid ${border}` }}>
          {["Shipping","Payment","Review"].map((s,i) => (
            <button key={s} onClick={() => i < step-1 && setStep(i+1)} style={{ flex:1, padding:"12px", background:step===i+1?`${gold}20`:"transparent", borderRight:i<2?`1px solid ${border}`:"none", border:"none", color:step>i?gold:muted, fontSize:13, fontWeight:step===i+1?700:400, cursor:i<step-1?"pointer":"default", fontFamily:"sans-serif", letterSpacing:"0.05em", borderBottom:step===i+1?`2px solid ${gold}`:"none" }}>
              {i < step-1 ? "✓ " : `${i+1}. `}{s}
            </button>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 style={{ marginBottom:24, fontSize:22 }}>Shipping Information</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ fontSize:11, color:muted, letterSpacing:"0.1em", display:"block", marginBottom:6, fontFamily:"sans-serif" }}>FULL NAME</label>
                <input style={inputStyle} placeholder="Alexandra Renaud" value={form.name} onChange={upd("name")} />
              </div>
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ fontSize:11, color:muted, letterSpacing:"0.1em", display:"block", marginBottom:6, fontFamily:"sans-serif" }}>EMAIL</label>
                <input style={inputStyle} placeholder="alex@example.com" value={form.email} onChange={upd("email")} />
              </div>
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ fontSize:11, color:muted, letterSpacing:"0.1em", display:"block", marginBottom:6, fontFamily:"sans-serif" }}>STREET ADDRESS</label>
                <input style={inputStyle} placeholder="14 Rue de Rivoli" value={form.street} onChange={upd("street")} />
              </div>
              <div>
                <label style={{ fontSize:11, color:muted, letterSpacing:"0.1em", display:"block", marginBottom:6, fontFamily:"sans-serif" }}>CITY</label>
                <input style={inputStyle} placeholder="Paris" value={form.city} onChange={upd("city")} />
              </div>
              <div>
                <label style={{ fontSize:11, color:muted, letterSpacing:"0.1em", display:"block", marginBottom:6, fontFamily:"sans-serif" }}>ZIP CODE</label>
                <input style={inputStyle} placeholder="75001" value={form.zip} onChange={upd("zip")} />
              </div>
            </div>
            <button onClick={() => setStep(2)} style={{ background:gold, color:dark, border:"none", padding:"13px 32px", borderRadius:7, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"sans-serif", marginTop:24 }}>
              Continue to Payment →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ marginBottom:24, fontSize:22 }}>Payment Details</h2>
            <div style={{ background:surface2, border:`1px solid ${border}`, borderRadius:10, padding:"1rem 1.25rem", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:24 }}>🔒</span>
              <span style={{ fontSize:13, color:muted, fontFamily:"sans-serif" }}>Secured by Stripe · 256-bit TLS encryption · PCI DSS compliant</span>
            </div>
            <div style={{ display:"grid", gap:14 }}>
              <div>
                <label style={{ fontSize:11, color:muted, letterSpacing:"0.1em", display:"block", marginBottom:6, fontFamily:"sans-serif" }}>CARD NUMBER</label>
                <input style={inputStyle} placeholder="4242 4242 4242 4242" value={form.card} onChange={upd("card")} maxLength={19} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div>
                  <label style={{ fontSize:11, color:muted, letterSpacing:"0.1em", display:"block", marginBottom:6, fontFamily:"sans-serif" }}>EXPIRY DATE</label>
                  <input style={inputStyle} placeholder="MM / YY" value={form.expiry} onChange={upd("expiry")} maxLength={7} />
                </div>
                <div>
                  <label style={{ fontSize:11, color:muted, letterSpacing:"0.1em", display:"block", marginBottom:6, fontFamily:"sans-serif" }}>CVV</label>
                  <input style={inputStyle} placeholder="• • •" value={form.cvv} onChange={upd("cvv")} maxLength={4} type="password" />
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:12, marginTop:24 }}>
              <button onClick={() => setStep(1)} style={{ background:"transparent", color:muted, border:`1px solid ${border}`, padding:"12px 24px", borderRadius:7, fontSize:13, cursor:"pointer", fontFamily:"sans-serif" }}>← Back</button>
              <button onClick={() => setStep(3)} style={{ background:gold, color:dark, border:"none", padding:"13px 32px", borderRadius:7, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"sans-serif" }}>Review Order →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ marginBottom:24, fontSize:22 }}>Review Your Order</h2>
            <div style={{ background:surface, border:`1px solid ${border}`, borderRadius:12, padding:"1.5rem", marginBottom:20 }}>
              <div style={{ fontSize:11, color:gold, letterSpacing:"0.15em", marginBottom:14, fontFamily:"sans-serif" }}>SHIPPING TO</div>
              <p style={{ color:text, fontFamily:"sans-serif", fontSize:14, margin:0 }}>{form.name || "—"}<br />{form.street}, {form.city} {form.zip}</p>
            </div>
            <div style={{ background:surface, border:`1px solid ${border}`, borderRadius:12, padding:"1.5rem", marginBottom:24 }}>
              <div style={{ fontSize:11, color:gold, letterSpacing:"0.15em", marginBottom:14, fontFamily:"sans-serif" }}>ITEMS</div>
              {cart.map(i => (
                <div key={i.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderBottom:`1px solid ${border}` }}>
                  <span style={{ fontSize:28 }}>{i.image}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:600 }}>{i.name}</div>
                    <div style={{ fontSize:12, color:muted, fontFamily:"sans-serif" }}>Qty: {i.qty}</div>
                  </div>
                  <span style={{ color:gold, fontFamily:"sans-serif", fontWeight:700 }}>${(i.price*i.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:12 }}>
              <button onClick={() => setStep(2)} style={{ background:"transparent", color:muted, border:`1px solid ${border}`, padding:"12px 24px", borderRadius:7, fontSize:13, cursor:"pointer", fontFamily:"sans-serif" }}>← Back</button>
              <button onClick={() => setDone(true)} style={{ flex:1, background:gold, color:dark, border:"none", padding:"14px 24px", borderRadius:7, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"sans-serif", letterSpacing:"0.05em" }}>
                🔒 Place Order · ${grand.toLocaleString()}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div style={{ background:surface, border:`1px solid ${border}`, borderRadius:12, padding:"1.5rem", position:"sticky", top:80 }}>
        <div style={{ fontSize:11, color:gold, letterSpacing:"0.2em", marginBottom:16, fontFamily:"sans-serif" }}>ORDER SUMMARY</div>
        {cart.map(i => (
          <div key={i.id} style={{ display:"flex", gap:10, marginBottom:12 }}>
            <div style={{ background:surface2, borderRadius:8, width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{i.image}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>{i.name}</div>
              <div style={{ fontSize:12, color:muted, fontFamily:"sans-serif" }}>× {i.qty}</div>
            </div>
            <span style={{ fontSize:13, color:text, fontFamily:"sans-serif" }}>${(i.price*i.qty).toLocaleString()}</span>
          </div>
        ))}
        <div style={{ borderTop:`1px solid ${border}`, marginTop:12, paddingTop:12 }}>
          {[["Subtotal", `$${total.toLocaleString()}`], ["Shipping", shipping===0?"Free":`$${shipping}`], ["Tax", `$${tax}`]].map(([k,v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:13, fontFamily:"sans-serif", padding:"5px 0", color:muted }}>
              <span>{k}</span><span style={{ color:text }}>{v}</span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:17, fontWeight:700, paddingTop:12, marginTop:8, borderTop:`1px solid ${border}` }}>
            <span>Total</span>
            <span style={{ color:gold }}>${grand.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? {...i, qty: i.qty + qty} : i);
      return [...prev, { id:product.id, name:product.name, brand:product.brand, price:product.price, qty, image:product.images[0] }];
    });
  };

  const removeFromCart = id => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? {...i, qty} : i));
  };
  const clearCart = () => setCart([]);

  return (
    <div style={css.app}>
      <Nav view={view} setView={setView} cartCount={cart.reduce((s,i)=>s+i.qty,0)} setShowCart={setShowCart} />
      {view === "home" && <HomePage setView={setView} setSelectedProduct={setSelectedProduct} cart={cart} addToCart={addToCart} />}
      {view === "shop" && <ShopPage setSelectedProduct={setSelectedProduct} setView={setView} addToCart={addToCart} />}
      {view === "product" && selectedProduct && <ProductPage product={selectedProduct} addToCart={addToCart} setView={setView} />}
      {view === "checkout" && <CheckoutPage cart={cart} clearCart={clearCart} setView={setView} />}
      <CartDrawer show={showCart} onClose={() => setShowCart(false)} cart={cart} removeFromCart={removeFromCart} updateQty={updateQty} setView={setView} />
      <footer style={{ background:surface, borderTop:`1px solid ${border}`, padding:"2.5rem 1.5rem", marginTop:"auto" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:32 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:700, marginBottom:12, letterSpacing:"0.08em" }}>ARC<span style={{ color:gold }}>•</span>ADE</div>
            <p style={{ fontSize:13, color:muted, fontFamily:"sans-serif", lineHeight:1.7 }}>Curated luxury goods for the discerning collector.</p>
          </div>
          {[["Shop", ["New Arrivals","Bestsellers","Sale","Categories"]], ["Support", ["Track Order","Returns","Shipping","FAQ"]], ["Company", ["About","Press","Careers","Contact"]]].map(([title, links]) => (
            <div key={title}>
              <div style={{ fontSize:11, color:gold, letterSpacing:"0.2em", marginBottom:12, fontFamily:"sans-serif" }}>{title.toUpperCase()}</div>
              {links.map(l => <div key={l} style={{ fontSize:13, color:muted, fontFamily:"sans-serif", marginBottom:8, cursor:"pointer" }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ maxWidth:1280, margin:"2rem auto 0", paddingTop:"1.5rem", borderTop:`1px solid ${border}`, display:"flex", justifyContent:"space-between", fontSize:12, color:muted, fontFamily:"sans-serif", flexWrap:"wrap", gap:8 }}>
          <span>© 2026 Arcade Commerce. All rights reserved.</span>
          <span>Built with MERN Stack · MongoDB · Express · React · Node.js</span>
        </div>
      </footer>
    </div>
  );
}
