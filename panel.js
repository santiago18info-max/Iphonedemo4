/* =========================================================
   MENTA — panel de la tienda (demo: usuario demo / demo)
   ========================================================= */
(function () {
  var S = window.Store, $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var D = S.load(), DAY = 864e5;
  function persist() { S.save(D); }
  function toast(t) { var el = $("#toast"); el.textContent = t; el.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove("show"); }, 2300); }
  function ago(ts) { var m = Math.round((Date.now() - ts) / 6e4); if (m < 1) return "recién"; if (m < 60) return "hace " + m + " min"; var h = Math.round(m / 60); if (h < 24) return "hace " + h + " h"; return new Date(ts).toLocaleDateString("es-UY", { day: "numeric", month: "short" }); }
  function cls(st) { return st.split(" ")[0]; }
  function valid(o) { return o.status !== "Cancelado"; }

  /* ---------- login ---------- */
  function enter() { $("#login").hidden = true; $("#app").hidden = false; renderAll(); }
  try { if (sessionStorage.getItem("menta_auth") === "1") enter(); } catch (e) {}
  $("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (this.u.value.trim() === "demo" && this.p.value === "demo") { try { sessionStorage.setItem("menta_auth", "1"); } catch (er) {} enter(); }
    else $("#loginErr").hidden = false;
  });
  $("#logout").onclick = function () { try { sessionStorage.removeItem("menta_auth"); } catch (e) {} location.reload(); };

  /* ---------- navegación ---------- */
  function go(v) { $$("#nav button").forEach(function (b) { b.classList.toggle("on", b.dataset.v === v); }); $$(".view").forEach(function (s) { s.hidden = s.dataset.view !== v; }); window.scrollTo(0, 0); }
  $("#nav").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) go(b.dataset.v); });
  document.addEventListener("click", function (e) { var g = e.target.closest("[data-go]"); if (g) go(g.dataset.go); if (e.target.closest("[data-close]")) $("#pSheet").hidden = true; });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") $("#pSheet").hidden = true; });
  function renderAll() { renderHome(); renderOrders(); renderProducts(); renderCoupons(); renderSettings(); }

  /* ---------- inicio ---------- */
  function renderHome() {
    var h = new Date().getHours(); $("#hello").textContent = h < 12 ? "¡Buen día!" : h < 20 ? "¡Buenas tardes!" : "¡Buenas noches!";
    var month = D.orders.filter(function (o) { return valid(o) && Date.now() - o.created < 30 * DAY; });
    var sales = month.reduce(function (a, o) { return a + o.total; }, 0);
    $("#kSales").textContent = S.money(sales); $("#kOrders").textContent = month.length; $("#kAvg").textContent = month.length ? S.money(sales / month.length) : "—";
    $("#kPend").textContent = D.orders.filter(function (o) { return o.status === "Nuevo" || o.status === "Preparando"; }).length;
    var nNew = D.orders.filter(function (o) { return o.status === "Nuevo"; }).length, em = $("#newCount"); em.hidden = !nNew; em.textContent = nNew;
    // gráfico de 7 días
    var days = [], t0 = new Date(); t0.setHours(0, 0, 0, 0);
    for (var i = 6; i >= 0; i--) { var d = new Date(t0.getTime() - i * DAY); days.push({ d: d, v: 0 }); }
    D.orders.filter(valid).forEach(function (o) { var d = new Date(o.created); d.setHours(0, 0, 0, 0); var x = days.find(function (y) { return y.d.getTime() === d.getTime(); }); if (x) x.v += o.total; });
    var max = Math.max.apply(null, days.map(function (x) { return x.v; })) || 1, names = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
    $("#chart").innerHTML = days.map(function (x, n) { return '<div class="bar' + (n === 6 ? " today" : "") + '"><b>' + (x.v ? S.num(x.v) : "") + '</b><i style="height:' + Math.round(x.v / max * 78) + '%"></i><small>' + (n === 6 ? "hoy" : names[x.d.getDay()]) + "</small></div>"; }).join("");
    $("#chartTot").textContent = S.money(days.reduce(function (a, x) { return a + x.v; }, 0));
    // stock bajo
    var low = [];
    D.products.filter(function (p) { return p.active; }).forEach(function (p) { p.variants.forEach(function (v) { if (v.stock <= 2) low.push({ n: p.name + (v.label ? " " + v.label : ""), s: v.stock }); }); });
    low.sort(function (a, b) { return a.s - b.s; });
    $("#lowStock").innerHTML = low.length ? low.slice(0, 6).map(function (l) { return '<div class="li"><span>' + S.esc(l.n) + '</span><b class="low">' + (l.s <= 0 ? "Sin stock" : "Quedan " + l.s) + "</b></div>"; }).join("") : '<p class="none">Todo con stock suficiente.</p>';
    // últimos pedidos
    var rec = D.orders.slice().sort(function (a, b) { return b.created - a.created; }).slice(0, 5);
    $("#recent").innerHTML = rec.length ? rec.map(function (o) { return '<div class="li"><span><b>' + o.code + "</b> · " + S.esc(o.customer.name) + " <small>· " + S.money(o.total) + " · " + ago(o.created) + '</small></span><span class="pillst st-' + cls(o.status) + '">' + o.status + "</span></div>"; }).join("") : '<p class="none">Todavía no hay pedidos.</p>';
    // más vendidos
    var cnt = {};
    D.orders.filter(valid).forEach(function (o) { o.items.forEach(function (i) { cnt[i.name] = (cnt[i.name] || 0) + i.qty; }); });
    var top = Object.keys(cnt).sort(function (a, b) { return cnt[b] - cnt[a]; }).slice(0, 5);
    $("#top").innerHTML = top.length ? top.map(function (n) { return '<div class="li"><span>' + S.esc(n) + "</span><b>" + cnt[n] + (cnt[n] === 1 ? " venta" : " ventas") + "</b></div>"; }).join("") : '<p class="none">Sin ventas todavía.</p>';
  }

  /* ---------- pedidos ---------- */
  var oFilter = "Activos", FILTERS = ["Activos", "Nuevo", "Preparando", "En camino", "Entregado", "Cancelado", "Todos"];
  function oMatch(o, f) {
    if (f === "Todos") return true;
    if (f === "Activos") return o.status !== "Entregado" && o.status !== "Cancelado";
    if (f === "En camino") return o.status === "Enviado" || o.status === "Listo para retirar";
    return o.status === f;
  }
  function nextOf(o) {
    if (o.status === "Nuevo") return ["Preparando", "Empezar a preparar"];
    if (o.status === "Preparando") return o.delivery.type === "retiro" ? ["Listo para retirar", "Listo para retirar"] : ["Enviado", "Marcar enviado"];
    if (o.status === "Enviado" || o.status === "Listo para retirar") return ["Entregado", "Marcar entregado"];
    return null;
  }
  function waClient(o) {
    var n = String(o.customer.phone).replace(/\D/g, "").replace(/^0/, ""), first = o.customer.name.split(" ")[0];
    var msg = { "Nuevo": "recibimos tu pedido " + o.code + ". En breve lo empezamos a preparar.", "Preparando": "estamos preparando tu pedido " + o.code + ".", "Enviado": "tu pedido " + o.code + " ya está en camino.", "Listo para retirar": "tu pedido " + o.code + " ya está listo para retirar en el showroom.", "Entregado": "gracias por tu compra. Si te gustó la experiencia, nos ayuda mucho una reseña." }[o.status] || "te escribimos por tu pedido " + o.code + ".";
    return "https://wa.me/598" + n + "?text=" + encodeURIComponent("¡Hola " + first + "! Te escribimos de Menta: " + msg);
  }
  function orderCard(o) {
    var nx = nextOf(o), act = "";
    if (valid(o) && !o.paid) act += '<button class="btn btn-line btn-sm" data-paid="' + o.id + '">Marcar pago recibido</button>';
    if (nx) act += '<button class="btn btn-dark btn-sm" data-next="' + o.id + '">' + nx[1] + "</button>";
    if (valid(o)) act += '<a class="btn btn-line btn-sm" target="_blank" rel="noopener" href="' + waClient(o) + '">Avisar por WhatsApp</a>';
    if (o.status === "Nuevo" || o.status === "Preparando") act += '<button class="btn btn-sm cancel" data-cancel="' + o.id + '">Cancelar</button>';
    return '<article class="order is-' + cls(o.status) + '"><div class="o-top"><b>' + o.code + '</b><span class="pillst st-' + cls(o.status) + '">' + o.status + "</span></div>" +
      '<div class="o-who">' + S.esc(o.customer.name) + "<small>" + S.esc(o.customer.phone) + " · " + ago(o.created) + "</small></div>" +
      '<ul class="o-items">' + o.items.map(function (i) { var d = [i.variant, i.color].filter(Boolean).join(" · "); return "<li><span>" + i.qty + "× " + S.esc(i.name) + (d ? "<small>" + S.esc(d) + "</small>" : "") + "</span><b>" + S.money(i.price * i.qty) + "</b></li>"; }).join("") + "</ul>" +
      '<div class="o-meta"><span>' + S.DELIVERY[o.delivery.type] + (o.delivery.address ? ": " + S.esc(o.delivery.address) : "") + (o.delivery.cost ? " (" + S.money(o.delivery.cost) + ")" : "") + "</span><span>" + S.PAY[o.pay] + (o.coupon ? " · cupón " + S.esc(o.coupon) + " (-" + S.money(o.discount) + ")" : "") + "</span></div>" +
      '<div class="o-tot"><span class="paid' + (o.paid ? "" : " no") + '">' + (o.paid ? "Pago recibido" : "Pago pendiente") + "</span><b>" + S.money(o.total) + "</b></div>" + (act ? '<div class="o-act">' + act + "</div>" : "") + "</article>";
  }
  function renderOrders() {
    $("#oChips").innerHTML = FILTERS.map(function (f) { return '<button data-f="' + f + '" class="' + (f === oFilter ? "on" : "") + '">' + f + " (" + D.orders.filter(function (o) { return oMatch(o, f); }).length + ")</button>"; }).join("");
    var list = D.orders.filter(function (o) { return oMatch(o, oFilter); }).sort(function (a, b) { return b.created - a.created; });
    $("#orders").innerHTML = list.length ? list.map(orderCard).join("") : '<p class="empty">No hay pedidos en esta vista.</p>';
  }
  $("#oChips").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) { oFilter = b.dataset.f; renderOrders(); } });
  $("#orders").addEventListener("click", function (e) {
    var b = e.target.closest("[data-next],[data-paid],[data-cancel]"); if (!b) return;
    var id = b.dataset.next || b.dataset.paid || b.dataset.cancel, o = D.orders.find(function (x) { return x.id === id; });
    if (b.dataset.next) { o.status = nextOf(o)[0]; toast(o.code + " → " + o.status); }
    else if (b.dataset.paid) { o.paid = true; toast("Pago de " + o.code + " registrado"); }
    else {
      if (!confirm("¿Cancelar el pedido " + o.code + "? El stock vuelve a la tienda.")) return;
      o.items.forEach(function (i) { var p = D.products.find(function (x) { return x.id === i.pid; }); if (!p) return; var v = p.variants[i.vi] && p.variants[i.vi].label === i.variant ? p.variants[i.vi] : p.variants.find(function (x) { return x.label === i.variant; }); if (v) v.stock = (+v.stock || 0) + i.qty; });
      o.status = "Cancelado"; toast("Pedido " + o.code + " cancelado");
    }
    persist(); renderOrders(); renderHome(); renderProducts();
  });

  /* ---------- productos ---------- */
  function catName(id) { var c = D.cats.find(function (x) { return x.id === id; }); return c ? c.name : ""; }
  function renderProducts() {
    var q = $("#pq").value.trim().toLowerCase();
    var list = D.products.filter(function (p) { return !q || p.name.toLowerCase().indexOf(q) > -1; });
    $("#ptable").innerHTML = list.length ? list.map(function (p) {
      var st = S.stock(p), from = Math.min.apply(null, p.variants.map(function (v, i) { return S.price(p, i); }));
      return '<div class="prow' + (p.active ? "" : " off") + '"><button class="p-main" data-edit="' + p.id + '"><div class="thumb">' + S.photo(p.image, p.name) + "</div><div><h4>" + S.esc(p.name) + "</h4><small>" + catName(p.cat) + " · " + (p.estado === "semi" ? "Semi nuevo" : "Nuevo") + (p.off ? " · -" + p.off + "%" : "") + "</small></div></button>" +
        '<span class="p-price">' + (p.variants.length > 1 ? "desde " : "") + S.money(from) + '</span><span class="p-stock' + (st <= 2 ? " low" : "") + '">' + (st <= 0 ? "Sin stock" : st + " en stock") + '</span><button class="sw' + (p.active ? " on" : "") + '" data-sw="' + p.id + '" role="switch" aria-checked="' + p.active + '" aria-label="Visible: ' + S.esc(p.name) + '"></button><button class="edit" data-edit="' + p.id + '">Editar</button></div>';
    }).join("") : '<p class="none" style="padding:20px">No hay productos con ese nombre.</p>';
  }
  $("#pq").addEventListener("input", renderProducts);
  $("#ptable").addEventListener("click", function (e) {
    var sw = e.target.closest("[data-sw]");
    if (sw) { var p = D.products.find(function (x) { return x.id === sw.dataset.sw; }); p.active = !p.active; persist(); renderProducts(); renderHome(); toast(p.name + (p.active ? " visible en la tienda" : " oculto de la tienda")); return; }
    var ed = e.target.closest("[data-edit]"); if (ed) openProd(ed.dataset.edit);
  });
  var editing = null, newImg = null;
  $("#pCat").innerHTML = D.cats.map(function (c) { return '<option value="' + c.id + '">' + S.esc(c.name) + "</option>"; }).join("");
  function varRow(v) { return '<div class="vrow"><input class="vl" placeholder="Ej: 128 GB" value="' + S.esc(v.label) + '" aria-label="Opción"><input class="vp" type="number" min="0" placeholder="Precio US$" value="' + (v.price === "" ? "" : v.price) + '" aria-label="Precio"><input class="vs" type="number" min="0" placeholder="Stock" value="' + (v.stock === "" ? "" : v.stock) + '" aria-label="Stock"><button type="button" class="vdel" aria-label="Quitar opción">&times;</button></div>'; }
  function openProd(id) {
    var f = $("#pForm"), p = id ? D.products.find(function (x) { return x.id === id; }) : { name: "", desc: "", cat: D.cats[0].id, estado: "nuevo", batt: 100, colors: [], variants: [{ label: "", price: "", stock: "" }], off: 0, featured: false, active: true, image: "" };
    editing = id || null; newImg = null;
    $("#pTitle").textContent = id ? "Editar producto" : "Nuevo producto";
    f.name.value = p.name; f.desc.value = p.desc; f.cat.value = p.cat; f.estado.value = p.estado; f.batt.value = p.batt; f.colors.value = p.colors.join(", "); f.off.value = p.off || 0;
    f.featured.checked = !!p.featured; f.active.checked = !!p.active;
    $("#pThumb").innerHTML = S.photo(p.image, p.name || "Foto");
    $("#vars").innerHTML = '<div class="vrow vhead"><span>Opción</span><span>Precio US$</span><span>Stock</span><span></span></div>' + p.variants.map(varRow).join("");
    $("#delProd").hidden = !id; $("#pSheet").hidden = false; $("#pForm").scrollTop = 0;
  }
  $("#addProd").onclick = function () { openProd(null); };
  $("#addVar").onclick = function () { $("#vars").insertAdjacentHTML("beforeend", varRow({ label: "", price: "", stock: "" })); };
  $("#vars").addEventListener("click", function (e) { var b = e.target.closest(".vdel"); if (!b) return; if ($$("#vars .vrow:not(.vhead)").length < 2) { toast("Tiene que quedar al menos una opción"); return; } b.parentNode.remove(); });
  $("#pFile").addEventListener("change", function () { var file = this.files[0]; if (!file) return; S.compress(file, 900).then(function (d) { newImg = d; $("#pThumb").innerHTML = S.photo(d, "Foto"); }); });
  $("#pForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = this, p = editing ? D.products.find(function (x) { return x.id === editing; }) : { id: S.uid("p"), image: "" };
    var vars = $$("#vars .vrow:not(.vhead)").map(function (r) { return { label: $(".vl", r).value.trim(), price: +$(".vp", r).value || 0, stock: Math.max(0, parseInt($(".vs", r).value, 10) || 0) }; });
    if (vars.some(function (v) { return v.price <= 0; })) { toast("Poné un precio en cada opción"); return; }
    if (vars.length > 1 && vars.some(function (v) { return !v.label; })) { toast("Poné un nombre a cada opción"); return; }
    p.name = f.name.value.trim(); p.desc = f.desc.value.trim(); p.cat = f.cat.value; p.estado = f.estado.value; p.batt = Math.min(100, +f.batt.value || 100);
    p.colors = f.colors.value.split(",").map(function (c) { return c.trim(); }).filter(Boolean); p.variants = vars; p.off = Math.min(90, Math.max(0, +f.off.value || 0));
    p.featured = f.featured.checked; p.active = f.active.checked; if (newImg) p.image = newImg;
    if (!editing) D.products.unshift(p);
    try { persist(); } catch (er) { toast("La foto es muy pesada, probá con otra"); return; }
    $("#pSheet").hidden = true; renderProducts(); renderHome(); toast("Producto guardado");
  });
  $("#delProd").onclick = function () {
    if (!editing || !confirm("¿Eliminar este producto?")) return;
    D.products = D.products.filter(function (x) { return x.id !== editing; }); persist();
    $("#pSheet").hidden = true; renderProducts(); renderHome(); toast("Producto eliminado");
  };

  /* ---------- cupones ---------- */
  function renderCoupons() {
    $("#cList").innerHTML = D.coupons.length ? D.coupons.map(function (c, i) {
      var used = D.orders.filter(function (o) { return o.coupon === c.code && valid(o); }).length;
      return '<div class="c-row"><span><code>' + S.esc(c.code) + "</code><br><small class=\"muted\">" + used + (used === 1 ? " uso" : " usos") + '</small></span><b class="pct">-' + c.pct + '%</b><button class="sw' + (c.active ? " on" : "") + '" data-csw="' + i + '" role="switch" aria-checked="' + c.active + '" aria-label="Activo"></button><button class="del" data-cdel="' + i + '">Borrar</button></div>';
    }).join("") : '<p class="none">Todavía no creaste cupones.</p>';
  }
  $("#cForm").addEventListener("submit", function (e) {
    e.preventDefault(); var f = this, code = f.code.value.trim().toUpperCase().replace(/\s/g, ""), pct = Math.min(90, Math.max(1, +f.pct.value || 0));
    if (!code) return;
    if (D.coupons.some(function (c) { return c.code === code; })) { toast("Ya existe un cupón con ese código"); return; }
    D.coupons.unshift({ code: code, pct: pct, active: true }); persist(); f.reset(); renderCoupons(); toast("Cupón " + code + " creado");
  });
  $("#cList").addEventListener("click", function (e) {
    var s = e.target.closest("[data-csw]"), d = e.target.closest("[data-cdel]");
    if (s) { var c = D.coupons[+s.dataset.csw]; c.active = !c.active; persist(); renderCoupons(); }
    if (d && confirm("¿Borrar este cupón?")) { D.coupons.splice(+d.dataset.cdel, 1); persist(); renderCoupons(); }
  });

  /* ---------- ajustes ---------- */
  var slideImgs = {};
  function renderSettings() {
    var f = $("#setForm"), s = D.settings; slideImgs = {};
    $("#slidesEd").innerHTML = "<h3>Banner principal</h3>" + s.slides.map(function (sl, i) {
      return '<div class="slide-ed"><div class="img-row"><div class="thumb" id="sThumb' + i + '">' + S.photo(sl.img, "Banner") + '</div><label class="btn btn-line btn-sm">Cambiar imagen ' + (i + 1) + '<input type="file" accept="image/*" class="sFile" data-i="' + i + '" hidden></label></div>' +
        '<label class="fld">Título<input class="sTitle" value="' + S.esc(sl.title) + '"></label><label class="fld">Texto<input class="sText" value="' + S.esc(sl.text) + '"></label><label class="fld">Texto del botón<input class="sBtn" value="' + S.esc(sl.btn) + '"></label></div>';
    }).join("");
    ["shipMvd", "shipInt", "freeFrom", "topbar", "bank", "whatsapp", "hours", "address"].forEach(function (k) { f[k].value = s[k]; });
  }
  $("#slidesEd").addEventListener("change", function (e) {
    if (!e.target.classList.contains("sFile")) return;
    var i = e.target.dataset.i, file = e.target.files[0]; if (!file) return;
    S.compress(file, 1600, .78).then(function (d) { slideImgs[i] = d; $("#sThumb" + i).innerHTML = S.photo(d, "Banner"); });
  });
  $("#setForm").addEventListener("submit", function (e) {
    e.preventDefault(); var f = this, s = D.settings;
    $$(".slide-ed").forEach(function (el, i) { s.slides[i].title = $(".sTitle", el).value.trim(); s.slides[i].text = $(".sText", el).value.trim(); s.slides[i].btn = $(".sBtn", el).value.trim() || "Ver la tienda"; if (slideImgs[i]) s.slides[i].img = slideImgs[i]; });
    ["topbar", "bank", "hours", "address"].forEach(function (k) { s[k] = f[k].value.trim(); });
    ["shipMvd", "shipInt", "freeFrom"].forEach(function (k) { s[k] = Math.max(0, +f[k].value || 0); });
    s.whatsapp = f.whatsapp.value.replace(/\D/g, "");
    try { persist(); } catch (er) { toast("La imagen es muy pesada, probá con otra"); return; }
    toast("Cambios guardados. Ya se ven en la tienda.");
  });
  $("#resetBtn").onclick = function () { if (!confirm("¿Restablecer todos los datos de la demo?")) return; D = S.reset(); renderAll(); toast("Datos restablecidos"); };

  /* pedidos nuevos desde la tienda (otra pestaña) */
  window.addEventListener("storage", function (e) {
    if (e.key !== S.KEY) return;
    var before = D.orders.length; D = S.load();
    if ($("#app").hidden) return;
    renderHome(); renderOrders(); renderProducts(); renderCoupons();
    if (D.orders.length > before) toast("¡Entró un pedido nuevo!");
  });
})();
