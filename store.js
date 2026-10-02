/* =========================================================
   MENTA — datos compartidos entre la tienda y el panel (demo).
   En la versión real esto vive en una base de datos.
   ========================================================= */
(function () {
  var KEY = "menta_demo_v1";
  var U = function (id, w) { return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + (w || 800) + "&q=80"; };
  var DAY = 864e5, now = Date.now();

  var SEED = {
    settings: {
      name: "Menta",
      whatsapp: "59897226657",
      topbar: "Envío gratis en Montevideo desde US$ 300 · Hasta 12 cuotas · Garantía por escrito",
      slides: [
        { title: "Lo nuevo ya está en Menta", text: "La línea 17 llegó con stock limitado. Comprá online y recibilo en el día.", btn: "Ver la tienda", img: U("1491933382434-500287f9b54b", 2000) },
        { title: "Semi nuevos que parecen de caja", text: "Revisados en 30 puntos, con batería verificada y 6 meses de garantía.", btn: "Ver semi nuevos", img: U("1523206489230-c012c64b2b48", 2000) }
      ],
      shipMvd: 6, shipInt: 12, freeFrom: 300,
      bank: "BROU · Caja de ahorro en dólares 000123456-00001 · Menta Store",
      address: "Showroom en Pocitos, con agenda previa",
      hours: "Lunes a viernes 10 a 19 h · Sábados 10 a 14 h"
    },
    cats: [{ id: "iphone", name: "iPhone" }, { id: "audio", name: "Audio" }, { id: "reloj", name: "Relojes" }, { id: "acc", name: "Accesorios" }],
    products: [
      { id: "p1", cat: "iphone", name: "iPhone 17 Pro Max", estado: "nuevo", batt: 100, desc: "El más nuevo de la línea. Sellado en caja, con 12 meses de garantía.", image: U("1695048133142-1a20484d2569"), colors: ["Naranja", "Plata", "Azul profundo"], variants: [{ label: "256 GB", price: 1690, stock: 4 }, { label: "512 GB", price: 1890, stock: 2 }], off: 0, featured: true, active: true },
      { id: "p2", cat: "iphone", name: "iPhone 16 Pro", estado: "nuevo", batt: 100, desc: "Pantalla de 6,3 pulgadas y cámara de 48 MP. El más pedido del mes.", image: U("1616348436168-de43ad0db179"), colors: ["Titanio desierto", "Titanio negro", "Titanio blanco"], variants: [{ label: "128 GB", price: 1190, stock: 5 }, { label: "256 GB", price: 1290, stock: 3 }, { label: "512 GB", price: 1490, stock: 1 }], off: 0, featured: true, active: true },
      { id: "p3", cat: "iphone", name: "iPhone 16", estado: "nuevo", batt: 100, desc: "Colores nuevos y carga por USB-C. Sellado, con 12 meses de garantía.", image: U("1605236453806-6ff36851218e"), colors: ["Ultramar", "Rosa", "Negro", "Blanco"], variants: [{ label: "128 GB", price: 990, stock: 6 }, { label: "256 GB", price: 1090, stock: 4 }], off: 5, featured: false, active: true },
      { id: "p4", cat: "iphone", name: "iPhone 15 Pro Max", estado: "semi", batt: 96, desc: "Semi nuevo en estado impecable, sin marcas. Batería al 96%.", image: U("1632661674596-df8be070a5c5"), colors: ["Titanio natural", "Titanio azul"], variants: [{ label: "256 GB", price: 950, stock: 2 }, { label: "512 GB", price: 1050, stock: 1 }], off: 0, featured: true, active: true },
      { id: "p5", cat: "iphone", name: "iPhone 15", estado: "semi", batt: 94, desc: "Semi nuevo, como de caja. Batería al 94% y 6 meses de garantía.", image: U("1511707171634-5f897ff02aa9"), colors: ["Celeste", "Rosa", "Negro"], variants: [{ label: "128 GB", price: 690, stock: 3 }, { label: "256 GB", price: 770, stock: 2 }], off: 10, featured: false, active: true },
      { id: "p6", cat: "iphone", name: "iPhone 14 Pro", estado: "semi", batt: 91, desc: "Semi nuevo con pantalla siempre activa. Batería al 91%.", image: U("1678685888221-cda773a3dcdb"), colors: ["Morado oscuro", "Dorado", "Negro espacial"], variants: [{ label: "128 GB", price: 630, stock: 2 }, { label: "256 GB", price: 690, stock: 0 }], off: 0, featured: false, active: true },
      { id: "p7", cat: "iphone", name: "iPhone 14", estado: "semi", batt: 89, desc: "Semi nuevo, rendidor y en muy buen estado. Batería al 89%.", image: U("1591337676887-a217a6970a8a"), colors: ["Azul", "Morado", "Medianoche"], variants: [{ label: "128 GB", price: 520, stock: 3 }], off: 0, featured: false, active: true },
      { id: "p8", cat: "iphone", name: "iPhone 13", estado: "semi", batt: 87, desc: "La mejor relación precio y calidad. Batería al 87%.", image: U("1510557880182-3d4d3cba35a5"), colors: ["Rosa", "Medianoche", "Blanco estelar"], variants: [{ label: "128 GB", price: 420, stock: 4 }, { label: "256 GB", price: 480, stock: 1 }], off: 8, featured: false, active: true },
      { id: "p9", cat: "audio", name: "AirPods Pro", estado: "nuevo", batt: 100, desc: "Con cancelación de ruido y estuche de carga. Sellados.", image: U("1600294037681-c80b4cb5b434"), colors: [], variants: [{ label: "", price: 289, stock: 8 }], off: 0, featured: true, active: true },
      { id: "p10", cat: "audio", name: "AirPods 4", estado: "nuevo", batt: 100, desc: "Livianos y cómodos para todo el día. Sellados.", image: U("1588423771073-b8903fbb85b5"), colors: [], variants: [{ label: "", price: 179, stock: 6 }], off: 0, featured: false, active: true },
      { id: "p11", cat: "reloj", name: "Apple Watch SE", estado: "nuevo", batt: 100, desc: "Lo esencial para entrenar y estar conectado. Sellado.", image: U("1546868871-7041f2a55e12"), colors: ["Medianoche", "Blanco estelar"], variants: [{ label: "40 mm", price: 329, stock: 3 }, { label: "44 mm", price: 359, stock: 2 }], off: 0, featured: false, active: true },
      { id: "p12", cat: "reloj", name: "Apple Watch Series 10", estado: "nuevo", batt: 100, desc: "Pantalla más grande y diseño más fino. Sellado, 12 meses de garantía.", image: U("1579586337278-3befd40fd17a"), colors: ["Negro", "Plata", "Oro rosa"], variants: [{ label: "42 mm", price: 499, stock: 2 }, { label: "46 mm", price: 539, stock: 2 }], off: 0, featured: false, active: true },
      { id: "p13", cat: "acc", name: "Cargador rápido 20W", estado: "nuevo", batt: 100, desc: "Con cable USB-C incluido.", image: U("1583863788434-e58a36330cf0"), colors: [], variants: [{ label: "", price: 35, stock: 20 }], off: 0, featured: false, active: true },
      { id: "p14", cat: "acc", name: "Funda con MagSafe", estado: "nuevo", batt: 100, desc: "Silicona suave, para todos los modelos.", image: U("1601593346740-925612772716"), colors: ["Negro", "Lavanda", "Arena"], variants: [{ label: "", price: 29, stock: 15 }], off: 0, featured: false, active: true },
      { id: "p15", cat: "acc", name: "Vidrio templado", estado: "nuevo", batt: 100, desc: "Colocación sin cargo en el showroom.", image: U("1556656793-08538906a9f8"), colors: [], variants: [{ label: "", price: 12, stock: 40 }], off: 0, featured: false, active: true }
    ],
    coupons: [{ code: "HOLA10", pct: 10, active: true }, { code: "MENTA5", pct: 5, active: true }],
    orders: [
      { id: "o1", code: "MT-1042", created: now - 40 * 6e4, customer: { name: "Valentina Pérez", phone: "099 111 222" }, delivery: { type: "mvd", address: "Bv. España 2450 apto 302, Pocitos", cost: 0 }, pay: "transferencia", paid: false, items: [{ pid: "p2", name: "iPhone 16 Pro", variant: "256 GB", color: "Titanio negro", qty: 1, price: 1290 }, { pid: "p15", name: "Vidrio templado", variant: "", color: "", qty: 1, price: 12 }], subtotal: 1302, discount: 0, coupon: "", total: 1302, status: "Nuevo" },
      { id: "o2", code: "MT-1041", created: now - 5 * 36e5, customer: { name: "Martín Rodríguez", phone: "098 333 444" }, delivery: { type: "retiro", address: "", cost: 0 }, pay: "efectivo", paid: false, items: [{ pid: "p5", name: "iPhone 15", variant: "128 GB", color: "Negro", qty: 1, price: 621 }], subtotal: 621, discount: 0, coupon: "", total: 621, status: "Preparando" },
      { id: "o3", code: "MT-1040", created: now - DAY - 3 * 36e5, customer: { name: "Lucía Fernández", phone: "091 555 666" }, delivery: { type: "interior", address: "Agencia DAC, Paysandú", cost: 12 }, pay: "transferencia", paid: true, items: [{ pid: "p9", name: "AirPods Pro", variant: "", color: "", qty: 1, price: 289 }, { pid: "p13", name: "Cargador rápido 20W", variant: "", color: "", qty: 1, price: 35 }], subtotal: 324, discount: 32, coupon: "HOLA10", total: 304, status: "Enviado" },
      { id: "o4", code: "MT-1039", created: now - 2 * DAY, customer: { name: "Diego Acosta", phone: "094 777 888" }, delivery: { type: "mvd", address: "Canelones 1320, Centro", cost: 0 }, pay: "tarjeta", paid: true, items: [{ pid: "p4", name: "iPhone 15 Pro Max", variant: "256 GB", color: "Titanio natural", qty: 1, price: 950 }], subtotal: 950, discount: 0, coupon: "", total: 950, status: "Entregado" },
      { id: "o5", code: "MT-1038", created: now - 3 * DAY, customer: { name: "Camila Sosa", phone: "092 123 987" }, delivery: { type: "retiro", address: "", cost: 0 }, pay: "transferencia", paid: true, items: [{ pid: "p11", name: "Apple Watch SE", variant: "40 mm", color: "Medianoche", qty: 1, price: 329 }, { pid: "p14", name: "Funda con MagSafe", variant: "", color: "Lavanda", qty: 2, price: 29 }], subtotal: 387, discount: 0, coupon: "", total: 387, status: "Entregado" },
      { id: "o6", code: "MT-1037", created: now - 5 * DAY, customer: { name: "Federico Silva", phone: "095 456 321" }, delivery: { type: "mvd", address: "Av. Rivera 3100, Buceo", cost: 0 }, pay: "tarjeta", paid: true, items: [{ pid: "p1", name: "iPhone 17 Pro Max", variant: "256 GB", color: "Plata", qty: 1, price: 1690 }], subtotal: 1690, discount: 0, coupon: "", total: 1690, status: "Entregado" },
      { id: "o7", code: "MT-1036", created: now - 6 * DAY, customer: { name: "Ana Olivera", phone: "093 852 741" }, delivery: { type: "retiro", address: "", cost: 0 }, pay: "efectivo", paid: true, items: [{ pid: "p8", name: "iPhone 13", variant: "128 GB", color: "Rosa", qty: 1, price: 386 }], subtotal: 386, discount: 0, coupon: "", total: 386, status: "Entregado" }
    ],
    seq: 1042
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function load() { try { var raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) {} return clone(SEED); }
  function save(d) { localStorage.setItem(KEY, JSON.stringify(d)); }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) {} return clone(SEED); }
  function uid(p) { return (p || "x") + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function num(n) { return Math.round(Number(n) || 0).toLocaleString("es-UY"); }
  function money(n) { return "US$ " + num(n); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  /* precio de una variante con el descuento del producto aplicado */
  function price(p, i) { var v = p.variants[i || 0]; return Math.round(v.price * (1 - (p.off || 0) / 100)); }
  function stock(p) { return p.variants.reduce(function (a, v) { return a + (+v.stock || 0); }, 0); }
  var DELIVERY = { retiro: "Retiro en showroom", mvd: "Envío en Montevideo", interior: "Envío al interior" };
  var PAY = { transferencia: "Transferencia", efectivo: "Efectivo al recibir", tarjeta: "Tarjeta (link de pago)" };
  /* pasos que ve el cliente al seguir su pedido */
  function steps(o) {
    var last = o.delivery.type === "retiro" ? "Listo para retirar" : "Enviado";
    var idx = { "Nuevo": 0, "Preparando": 2, "Enviado": 3, "Listo para retirar": 3, "Entregado": 4 }[o.status];
    return [
      { t: "Pedido recibido", on: true },
      { t: "Pago confirmado", on: !!o.paid },
      { t: "Preparando tu pedido", on: idx >= 2 },
      { t: last, on: idx >= 3 },
      { t: "Entregado", on: idx >= 4 }
    ];
  }
  function compress(file, max, quality) {
    max = max || 1200; quality = quality || 0.8;
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          var s = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement("canvas");
          c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL("image/jpeg", quality));
        };
        img.onerror = reject; img.src = reader.result;
      };
      reader.onerror = reject; reader.readAsDataURL(file);
    });
  }
  function photo(src, label, cls) {
    return '<figure class="ph ' + (cls || "") + '"><span>' + esc(label) + "</span>" + (src ? '<img src="' + esc(src) + '" alt="' + esc(label) + '" loading="lazy" onerror="this.remove()">' : "") + "</figure>";
  }

  window.Store = { KEY: KEY, load: load, save: save, reset: reset, uid: uid, num: num, money: money, esc: esc, price: price, stock: stock, steps: steps, compress: compress, photo: photo, DELIVERY: DELIVERY, PAY: PAY };
})();
