/* =========================================================
   MENTA — tienda online (plan Completo)
   Carrito, compra en 3 pasos, cupones, stock real y
   seguimiento de pedidos. Todo se administra desde panel.html
   ========================================================= */
(function () {
  var S = window.Store, $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var D = S.load(), cfg = D.settings, CART = "menta_cart";
  var TINT = { iphone: "sky", audio: "peach", reloj: "mint", acc: "sand" };
  function wa(msg) { return "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(msg); }
  function toast(t) { var el = $("#toast"); el.textContent = t; el.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove("show"); }, 2300); }
  function ls(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function prod(id) { return D.products.find(function (p) { return p.id === id; }); }
  function visible() { return D.products.filter(function (p) { return p.active; }); }

  /* ---------- textos del panel ---------- */
  $("#topbar").textContent = cfg.topbar;
  $("#perkShip").textContent = "Gratis en Montevideo desde " + S.money(cfg.freeFrom);
  $("#contactTxt").textContent = cfg.address + ". " + cfg.hours + ".";

  /* ---------- banner ---------- */
  var slide = 0, timer;
  $("#slides").innerHTML = cfg.slides.map(function (s, i) {
    return '<div class="slide' + (i === 0 ? " on" : "") + '">' + S.photo(s.img, s.title).replace('loading="lazy"', i === 0 ? "" : 'loading="lazy"') +
      '<div class="container slide-in"><span class="slide-tag">' + (i === 0 ? "Recién llegado" : "Semi nuevos") + "</span><h1>" + S.esc(s.title) + "</h1><p>" + S.esc(s.text) + '</p><a href="#tienda" class="btn btn-white" data-slide="' + i + '">' + S.esc(s.btn) + "</a></div></div>";
  }).join("");
  $("#dots").innerHTML = cfg.slides.map(function (s, i) { return '<button aria-label="Banner ' + (i + 1) + '" data-i="' + i + '" class="' + (i === 0 ? "on" : "") + '"></button>'; }).join("");
  function go(i) { slide = (i + cfg.slides.length) % cfg.slides.length; $$(".slide").forEach(function (s, n) { s.classList.toggle("on", n === slide); }); $$("#dots button").forEach(function (b, n) { b.classList.toggle("on", n === slide); }); }
  function auto() { clearInterval(timer); if (cfg.slides.length > 1) timer = setInterval(function () { go(slide + 1); }, 6500); }
  $("#dots").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) { go(+b.dataset.i); auto(); } });
  $("#slides").addEventListener("click", function (e) { var a = e.target.closest("[data-slide]"); if (a && +a.dataset.slide === 1) { F.estado = "semi"; $("#fEstado").value = "semi"; render(); } });
  auto();

  /* ---------- catálogo ---------- */
  var F = { cat: "todos", estado: "", q: "", sort: "rel" };
  function from(p) { return Math.min.apply(null, p.variants.map(function (v, i) { return S.price(p, i); })); }
  function card(p, n) {
    var st = S.stock(p), semi = p.estado === "semi", multi = p.variants.length > 1;
    return '<article class="prod' + (st ? "" : " is-out") + '" data-id="' + p.id + '" tabindex="0" style="animation-delay:' + (n || 0) * 40 + 'ms"><div class="prod-media">' + S.photo(p.image, p.name, "t-" + TINT[p.cat]) +
      '<div class="badges">' + (!st ? '<span class="tag out">Sin stock</span>' : "") + (p.off ? '<span class="tag off">-' + p.off + "%</span>" : "") + (semi ? '<span class="tag semi">Semi nuevo</span>' : "") + (st && st <= 2 ? '<span class="tag">Últimas ' + st + "</span>" : "") + "</div></div>" +
      '<div class="prod-body"><h3>' + S.esc(p.name) + '</h3><span class="prod-sub">' + (semi ? "Batería " + p.batt + "%" : "Nuevo · sellado") + (multi ? " · " + p.variants.length + " opciones" : "") + "</span>" +
      '<div class="prod-foot"><span class="price">' + (multi ? "<small>Desde</small>" : "") + "<b>" + S.money(from(p)) + "</b>" + (p.off ? "<s>" + S.money(Math.min.apply(null, p.variants.map(function (v) { return v.price; }))) + "</s>" : "") + '</span><span class="add" aria-hidden="true">+</span></div></div></article>';
  }
  function renderCats() {
    var tints = ["sky", "peach", "mint", "sand"];
    $("#cats").innerHTML = D.cats.map(function (c, i) { var n = visible().filter(function (p) { return p.cat === c.id; }).length; return '<button class="cat t-' + tints[i % 4] + '" data-cat="' + c.id + '"><span><b>' + S.esc(c.name) + "</b><small>" + n + (n === 1 ? " producto" : " productos") + "</small></span><i>→</i></button>"; }).join("");
    $("#chips").innerHTML = [{ id: "todos", name: "Todo" }].concat(D.cats).map(function (c) { return '<button data-cat="' + c.id + '" class="' + (F.cat === c.id ? "on" : "") + '">' + S.esc(c.name) + "</button>"; }).join("");
  }
  function render() {
    var list = visible().filter(function (p) { return (F.cat === "todos" || p.cat === F.cat) && (!F.estado || p.estado === F.estado) && (!F.q || p.name.toLowerCase().indexOf(F.q) > -1); });
    if (F.sort === "rel") list.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });
    if (F.sort === "asc") list.sort(function (a, b) { return from(a) - from(b); });
    if (F.sort === "desc") list.sort(function (a, b) { return from(b) - from(a); });
    $("#grid").innerHTML = list.map(card).join("");
    $("#grid").hidden = !list.length; $("#empty").hidden = list.length > 0;
    $("#count").textContent = list.length + (list.length === 1 ? " producto" : " productos");
    $$("#chips button").forEach(function (b) { b.classList.toggle("on", b.dataset.cat === F.cat); });
  }
  function renderOffers() {
    var o = visible().filter(function (p) { return p.off > 0; });
    $("#ofertas").hidden = !o.length; $("#offerGrid").innerHTML = o.map(card).join("");
  }
  function setCat(c) { F.cat = c; render(); }
  $("#cats").addEventListener("click", function (e) { var b = e.target.closest(".cat"); if (b) { setCat(b.dataset.cat); $("#tienda").scrollIntoView({ behavior: "smooth" }); } });
  $("#chips").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) setCat(b.dataset.cat); });
  $("#q").addEventListener("input", function () { F.q = this.value.trim().toLowerCase(); render(); });
  $("#fEstado").addEventListener("change", function () { F.estado = this.value; render(); });
  $("#sort").addEventListener("change", function () { F.sort = this.value; render(); });
  document.addEventListener("click", function (e) { var c = e.target.closest(".prod"); if (c) openProd(c.dataset.id); });
  document.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target.classList && e.target.classList.contains("prod")) openProd(e.target.dataset.id); });
  renderCats(); render(); renderOffers();

  /* ---------- ficha ---------- */
  var cur = null, P = { v: 0, c: 0, q: 1 };
  function openProd(id) {
    cur = prod(id); if (!cur) return;
    var first = cur.variants.findIndex(function (v) { return v.stock > 0; });
    P = { v: first < 0 ? 0 : first, c: 0, q: 1 };
    $("#pmMedia").innerHTML = S.photo(cur.image, cur.name, "t-" + TINT[cur.cat]).replace(' loading="lazy"', "");
    paintProd(); show("#pm"); $("#pm .modal").scrollTop = 0;
  }
  function paintProd() {
    var p = cur, v = p.variants[P.v], semi = p.estado === "semi", pr = S.price(p, P.v);
    $("#pmTags").innerHTML = '<span class="tag' + (semi ? " semi" : "") + '">' + (semi ? "Semi nuevo · batería " + p.batt + "%" : "Nuevo · sellado") + "</span>" + (p.off ? '<span class="tag off">-' + p.off + "%</span>" : "");
    $("#pmName").textContent = p.name; $("#pmDesc").textContent = p.desc;
    $("#pmColorWrap").hidden = !p.colors.length;
    $("#pmColors").innerHTML = p.colors.map(function (c, i) { return '<button data-i="' + i + '" class="' + (i === P.c ? "on" : "") + '">' + S.esc(c) + "</button>"; }).join("");
    $("#pmVarWrap").hidden = p.variants.length < 2;
    $("#pmVars").innerHTML = p.variants.map(function (x, i) { return '<button data-i="' + i + '" class="' + (i === P.v ? "on" : "") + (x.stock > 0 ? "" : " no") + '">' + S.esc(x.label) + "</button>"; }).join("");
    $("#pmPrice").textContent = S.money(pr); $("#pmOld").textContent = p.off ? S.money(v.price) : "";
    var st = $("#pmStock"); st.className = v.stock <= 2 ? "low" : "";
    st.textContent = v.stock <= 0 ? "Sin stock" : v.stock <= 2 ? "¡Quedan " + v.stock + "!" : "En stock";
    $("#pmCuotas").textContent = "o 12 cuotas de " + S.money(pr * 1.18 / 12) + " con tarjeta";
    if (P.q > v.stock) P.q = Math.max(1, v.stock);
    $("#pmQty").textContent = P.q;
    var add = $("#pmAdd"); add.disabled = v.stock <= 0; add.textContent = v.stock <= 0 ? "Sin stock" : "Agregar al carrito · " + S.money(pr * P.q);
  }
  $("#pmColors").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) { P.c = +b.dataset.i; paintProd(); } });
  $("#pmVars").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) { P.v = +b.dataset.i; P.q = 1; paintProd(); } });
  $("#pmMinus").onclick = function () { if (P.q > 1) { P.q--; paintProd(); } };
  $("#pmPlus").onclick = function () { if (P.q < cur.variants[P.v].stock) { P.q++; paintProd(); } else toast("No hay más stock de esta opción"); };
  $("#pmAdd").onclick = function () {
    var ex = cart.find(function (l) { return l.pid === cur.id && l.v === P.v && l.c === P.c; }), max = cur.variants[P.v].stock;
    if (ex) ex.qty = Math.min(max, ex.qty + P.q); else cart.push({ pid: cur.id, v: P.v, c: P.c, qty: P.q });
    saveCart(); hide(); toast("Agregado al carrito");
    var b = $("#cartBtn"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
  };

  /* ---------- carrito y compra ---------- */
  var cart = ls(CART, []).filter(function (l) { var p = prod(l.pid); return p && p.active && p.variants[l.v]; });
  var step = 0, coupon = null, form = { name: "", phone: "", delivery: "retiro", address: "", pay: "transferencia" }, lastOrder = null;
  function saveCart() { lsSet(CART, cart); var n = cart.reduce(function (a, l) { return a + l.qty; }, 0), c = $("#cartCount"); c.hidden = !n; c.textContent = n; }
  function lineInfo(l) { var p = prod(l.pid); return { p: p, label: [p.variants[l.v].label, p.colors[l.c]].filter(Boolean).join(" · "), price: S.price(p, l.v) }; }
  function totals() {
    var sub = cart.reduce(function (a, l) { return a + lineInfo(l).price * l.qty; }, 0);
    var disc = coupon ? Math.round(sub * coupon.pct / 100) : 0, base = sub - disc;
    var ship = form.delivery === "mvd" ? (base >= cfg.freeFrom ? 0 : +cfg.shipMvd) : form.delivery === "interior" ? +cfg.shipInt : 0;
    return { sub: sub, disc: disc, ship: ship, total: base + ship };
  }
  function sumHtml(withShip) {
    var t = totals();
    return '<div class="sum"><div><span>Subtotal</span><span>' + S.money(t.sub) + "</span></div>" + (t.disc ? '<div class="neg"><span>Cupón ' + S.esc(coupon.code) + " (-" + coupon.pct + "%)</span><span>- " + S.money(t.disc) + "</span></div>" : "") +
      (withShip ? "<div><span>Envío</span><span>" + (t.ship ? S.money(t.ship) : "Gratis") + "</span></div>" : "") + '<div class="tot"><span>Total</span><span>' + S.money(withShip ? t.total : t.sub - t.disc) + "</span></div></div>";
  }
  function renderDrawer() {
    var body = $("#dBody");
    $("#dTitle").textContent = ["Tu carrito", "Datos y entrega", "Pago", "¡Pedido confirmado!"][step];
    $("#dSteps").hidden = step === 3 || !cart.length && step === 0;
    $$("#dSteps li").forEach(function (li, i) { li.classList.toggle("on", i <= step); });
    if (step === 3) {
      body.innerHTML = '<div class="done"><div class="ok">✓</div><h4>Gracias, ' + S.esc(lastOrder.customer.name.split(" ")[0]) + '</h4><div class="code">' + lastOrder.code + "</div><p>Guardá este número para seguir tu pedido.</p>" +
        (lastOrder.pay === "transferencia" ? '<p class="note"><b>Datos para transferir ' + S.money(lastOrder.total) + ":</b><br>" + S.esc(cfg.bank) + "</p>" : lastOrder.pay === "tarjeta" ? '<p class="note">Te enviamos el link de pago por WhatsApp en unos minutos.</p>' : '<p class="note">Pagás en efectivo cuando recibís tu pedido.</p>') +
        '<a class="btn btn-accent btn-block" target="_blank" rel="noopener" href="' + wa("¡Hola Menta! Acabo de hacer el pedido " + lastOrder.code + " por " + S.money(lastOrder.total) + ".") + '">Avisar por WhatsApp</a><button class="btn btn-line btn-block" id="goTrack">Seguir mi pedido</button></div>';
      return;
    }
    if (!cart.length) { body.innerHTML = '<div class="d-empty"><p>Tu carrito está vacío</p><a href="#tienda" class="btn btn-dark" data-close>Ver la tienda</a></div>'; return; }
    if (step === 0) {
      body.innerHTML = cart.map(function (l, i) {
        var x = lineInfo(l);
        return '<div class="d-item">' + S.photo(x.p.image, "", "t-" + TINT[x.p.cat]) + "<div><h5>" + S.esc(x.p.name) + "</h5><small>" + S.esc(x.label) + '</small><span class="qty" data-i="' + i + '"><button data-d="-1" aria-label="Menos">−</button><b>' + l.qty + '</b><button data-d="1" aria-label="Más">+</button></span></div><span class="dp">' + S.money(x.price * l.qty) + "</span></div>";
      }).join("") + '<form class="coupon" id="cForm"><input id="cCode" placeholder="Cupón de descuento" aria-label="Cupón" value="' + (coupon ? S.esc(coupon.code) : "") + '"><button class="btn btn-line btn-sm">Aplicar</button></form>' + sumHtml(false) +
        '<button class="btn btn-dark btn-block" data-step="1">Continuar</button><p class="muted" style="font-size:.8rem;text-align:center;margin-top:10px">Probá el cupón HOLA10</p>';
      return;
    }
    if (step === 1) {
      var ships = [["retiro", "Retiro en showroom", "Gratis"], ["mvd", "Envío en Montevideo", (totals().sub - totals().disc) >= cfg.freeFrom ? "Gratis" : S.money(cfg.shipMvd)], ["interior", "Envío al interior por agencia", S.money(cfg.shipInt)]];
      body.innerHTML = '<form id="f1"><h4 class="d-h">Tus datos</h4><label class="fld">Nombre y apellido<input name="name" required autocomplete="name" value="' + S.esc(form.name) + '"></label><label class="fld">Celular<input name="phone" required inputmode="tel" autocomplete="tel" placeholder="09X XXX XXX" value="' + S.esc(form.phone) + '"></label>' +
        '<h4 class="d-h">Entrega</h4><div class="choice">' + ships.map(function (s) { return "<label" + (form.delivery === s[0] ? ' class="on"' : "") + "><span><input type=\"radio\" name=\"delivery\" value=\"" + s[0] + '"' + (form.delivery === s[0] ? " checked" : "") + ">" + s[1] + "</span><small>" + s[2] + "</small></label>"; }).join("") + "</div>" +
        '<label class="fld" id="addrFld"' + (form.delivery === "retiro" ? " hidden" : "") + '>Dirección o agencia<input name="address" value="' + S.esc(form.address) + '" placeholder="Calle, número, apto y barrio"></label>' +
        '<div id="sum1">' + sumHtml(true) + '</div><div class="d-actions"><button type="button" class="btn btn-line" data-step="0">Volver</button><button class="btn btn-dark">Continuar al pago</button></div></form>';
      return;
    }
    var pays = [["transferencia", "Transferencia bancaria", "Te mostramos los datos"], ["efectivo", "Efectivo al recibir", "Pagás al retirar o recibir"], ["tarjeta", "Tarjeta de crédito", "Link de pago, hasta 12 cuotas"]];
    body.innerHTML = '<form id="f2"><h4 class="d-h">¿Cómo querés pagar?</h4><div class="choice">' + pays.map(function (s) { return "<label" + (form.pay === s[0] ? ' class="on"' : "") + "><span><input type=\"radio\" name=\"pay\" value=\"" + s[0] + '"' + (form.pay === s[0] ? " checked" : "") + ">" + s[1] + "</span><small>" + s[2] + "</small></label>"; }).join("") + "</div>" +
      '<p class="note">' + S.esc(form.name) + " · " + S.esc(form.phone) + "<br>" + S.DELIVERY[form.delivery] + (form.address ? ": " + S.esc(form.address) : "") + "</p>" + sumHtml(true) +
      '<div class="d-actions"><button type="button" class="btn btn-line" data-step="1">Volver</button><button class="btn btn-accent">Confirmar pedido</button></div></form>';
  }
  $("#dBody").addEventListener("click", function (e) {
    var q = e.target.closest(".qty button");
    if (q) {
      var i = +q.parentNode.dataset.i, l = cart[i], max = prod(l.pid).variants[l.v].stock;
      if (+q.dataset.d > 0 && l.qty >= max) { toast("No hay más stock de esta opción"); return; }
      l.qty += +q.dataset.d; if (l.qty < 1) cart.splice(i, 1);
      saveCart(); renderDrawer(); return;
    }
    var s = e.target.closest("[data-step]"); if (s) { step = +s.dataset.step; renderDrawer(); $("#dBody").scrollTop = 0; return; }
    if (e.target.closest("#goTrack")) { hide(); openTrack(lastOrder.code); }
  });
  $("#dBody").addEventListener("change", function (e) {
    if (e.target.type === "radio") $$("label", e.target.closest(".choice")).forEach(function (l) { l.classList.toggle("on", l.contains(e.target)); });
    if (e.target.name === "delivery") { form.delivery = e.target.value; $("#addrFld").hidden = form.delivery === "retiro"; $("#sum1").innerHTML = sumHtml(true); }
    if (e.target.name === "pay") form.pay = e.target.value;
  });
  $("#dBody").addEventListener("submit", function (e) {
    e.preventDefault(); var f = e.target;
    if (f.id === "cForm") {
      var code = $("#cCode").value.trim().toUpperCase(), c = S.load().coupons.find(function (x) { return x.code === code && x.active; });
      if (!code) { coupon = null; renderDrawer(); return; }
      if (!c) { toast("Ese cupón no es válido"); return; }
      coupon = c; renderDrawer(); toast("Cupón aplicado: -" + c.pct + "%"); return;
    }
    if (f.id === "f1") {
      form.name = f.name.value.trim(); form.phone = f.phone.value.trim(); form.address = f.address.value.trim();
      if (form.delivery !== "retiro" && !form.address) { toast("Escribí la dirección de entrega"); f.address.focus(); return; }
      step = 2; renderDrawer(); $("#dBody").scrollTop = 0; return;
    }
    if (f.id === "f2") placeOrder();
  });
  function placeOrder() {
    var data = S.load(), ok = true;
    cart.forEach(function (l) { var p = data.products.find(function (x) { return x.id === l.pid; }); if (!p || !p.variants[l.v] || p.variants[l.v].stock < l.qty) ok = false; });
    if (!ok) { D = data; toast("Algún producto se quedó sin stock. Revisá tu carrito."); cart = cart.filter(function (l) { var p = prod(l.pid); return p && p.variants[l.v] && p.variants[l.v].stock > 0; }); cart.forEach(function (l) { l.qty = Math.min(l.qty, prod(l.pid).variants[l.v].stock); }); saveCart(); step = 0; renderDrawer(); render(); return; }
    var t = totals();
    cart.forEach(function (l) { data.products.find(function (x) { return x.id === l.pid; }).variants[l.v].stock -= l.qty; });
    data.seq = (data.seq || 1000) + 1;
    lastOrder = { id: S.uid("o"), code: "MT-" + data.seq, created: Date.now(), customer: { name: form.name, phone: form.phone }, delivery: { type: form.delivery, address: form.delivery === "retiro" ? "" : form.address, cost: t.ship }, pay: form.pay, paid: false,
      items: cart.map(function (l) { var x = lineInfo(l); return { pid: l.pid, vi: l.v, name: x.p.name, variant: x.p.variants[l.v].label, color: x.p.colors[l.c] || "", qty: l.qty, price: x.price }; }),
      subtotal: t.sub, discount: t.disc, coupon: coupon ? coupon.code : "", total: t.total, status: "Nuevo" };
    data.orders.unshift(lastOrder); S.save(data); D = data;
    cart = []; coupon = null; saveCart(); step = 3; renderDrawer(); render(); renderOffers();
  }
  $("#cartBtn").onclick = function () { if (step === 3) step = 0; renderDrawer(); show("#drawer"); };
  saveCart();

  /* ---------- seguimiento ---------- */
  function openTrack(code) { $("#tOut").innerHTML = ""; $("#tCode").value = code || ""; show("#track"); if (code) findOrder(code); }
  function findOrder(code) {
    var o = S.load().orders.find(function (x) { return x.code.toUpperCase() === code.trim().toUpperCase(); });
    if (!o) { $("#tOut").innerHTML = '<p class="t-err">No encontramos un pedido con ese número.</p>'; return; }
    if (o.status === "Cancelado") { $("#tOut").innerHTML = '<div class="t-card"><h4>Pedido ' + o.code + "</h4><small>Este pedido fue cancelado. Si tenés dudas, escribinos.</small></div>"; return; }
    $("#tOut").innerHTML = '<div class="t-card"><h4>Pedido ' + o.code + " · " + S.money(o.total) + "</h4><small>" + S.DELIVERY[o.delivery.type] + " · " + o.items.reduce(function (a, i) { return a + i.qty; }, 0) + ' producto(s)</small><ol class="t-steps">' + S.steps(o).map(function (s) { return '<li class="' + (s.on ? "on" : "") + '">' + s.t + "</li>"; }).join("") + "</ol></div>";
  }
  $("#trackBtn").onclick = function () { openTrack(""); };
  $("#tForm").addEventListener("submit", function (e) { e.preventDefault(); findOrder($("#tCode").value); });

  /* ---------- general ---------- */
  function show(id) { $(id).hidden = false; document.body.style.overflow = "hidden"; }
  function hide() { $$(".overlay").forEach(function (o) { o.hidden = true; }); document.body.style.overflow = ""; }
  document.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) hide(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") hide(); });
  $$(".js-wa").forEach(function (a) { a.href = wa(a.dataset.msg); a.target = "_blank"; a.rel = "noopener"; });
  $("#year").textContent = new Date().getFullYear();
  var burger = $("#burger"), menu = $("#menu");
  burger.onclick = function () { var o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); };
  menu.addEventListener("click", function (e) { if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); } });
  // si el panel cambia algo en otra pestaña, la tienda se actualiza
  window.addEventListener("storage", function (e) { if (e.key === S.KEY && $$(".overlay").every(function (o) { return o.hidden; })) location.reload(); });
})();
