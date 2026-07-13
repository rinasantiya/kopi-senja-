/* =========================================================
   DATA MENU — dimuat dari localStorage bila Admin sudah pernah
   mengubahnya, kalau belum pakai PRODUCTS_DEFAULT dari kopisenja-data.js
   ========================================================= */
function loadProducts(){
  try{
    const saved = JSON.parse(localStorage.getItem("kopisenja_products"));
    if(Array.isArray(saved) && saved.length) return saved;
  }catch(e){}
  return PRODUCTS_DEFAULT;
}
let PRODUCTS = loadProducts();

let activeCategory = "Semua";
let cart = JSON.parse(localStorage.getItem("kopisenja_cart") || "[]");

/* =========================================================
   RENDER: CATEGORY CHIPS
   ========================================================= */
function renderCategoryChips(){
  const cats = ["Semua", ...new Set(PRODUCTS.map(p=>p.cat))];
  const wrap = document.getElementById("categoryChips");
  wrap.innerHTML = cats.map(c=>
    `<button class="chip-filter ${c===activeCategory?'active':''}" onclick="setCategory('${c}')">${c}</button>`
  ).join("");
}
function setCategory(c){ activeCategory = c; renderCategoryChips(); renderProducts(); }

/* =========================================================
   RENDER: PRODUCT GRID (filter + search + sort)
   ========================================================= */
function renderProducts(){
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  const sort = document.getElementById("sortSelect").value;
  let list = PRODUCTS.filter(p=>{
    const matchCat = activeCategory === "Semua" || p.cat === activeCategory;
    const matchQ = p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
    return matchCat && matchQ;
  });
  if(sort==="price-asc") list.sort((a,b)=>a.price-b.price);
  if(sort==="price-desc") list.sort((a,b)=>b.price-a.price);
  if(sort==="name-asc") list.sort((a,b)=>a.name.localeCompare(b.name));

  const grid = document.getElementById("productGrid");
  if(list.length===0){
    grid.innerHTML = `<div class="empty-state">😕 Menu yang kamu cari nggak ketemu. Coba kata kunci lain ya!</div>`;
    return;
  }
  grid.innerHTML = list.map(p=>`
    <div class="card" data-id="${p.id}">
      <div class="card-media">
        ${p.badge ? `<span class="card-badge">${p.badge}</span>`:""}
        ${p.oldPrice ? `<span class="card-discount">-${Math.round((1-p.price/p.oldPrice)*100)}%</span>`:""}
        <img src="${p.img}" alt="${p.name}" loading="lazy">
      </div>
      <div class="card-body">
        <span class="card-cat">${p.cat}</span>
        <h3>${p.name}</h3>
        <p class="card-desc">${p.desc}</p>
        <div class="price-row">
          <span class="price-tag">Rp${p.price.toLocaleString('id-ID')}</span>
          ${p.oldPrice ? `<span class="price-old">Rp${p.oldPrice.toLocaleString('id-ID')}</span>`:""}
        </div>
        <div class="card-actions">
          <button class="btn-sm btn-detail" onclick="openDetail(${p.id})">Detail</button>
          <button class="btn-sm btn-add" onclick="addToCart(${p.id},1)">+ Pesan</button>
        </div>
      </div>
    </div>
  `).join("");
  observeCards();
}

/* fade-in on scroll */
function observeCards(){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in-view"); obs.unobserve(e.target);} });
  }, {threshold:.1});
  document.querySelectorAll(".card").forEach(c=>obs.observe(c));
}

/* =========================================================
   PRODUCT DETAIL MODAL
   ========================================================= */
let detailQty = 1;
function openDetail(id){
  const p = PRODUCTS.find(x=>x.id===id);
  detailQty = 1;
  document.getElementById("detailModalBody").innerHTML = `
    <div class="detail-media"><img src="${p.img}" alt="${p.name}"></div>
    <span class="card-cat">${p.cat}</span>
    <h2 style="margin:6px 0;">${p.name}</h2>
    <p style="color:var(--ink-soft); font-size:14.5px; font-family:'Work Sans';">${p.desc}</p>
    <div class="price-row" style="margin:10px 0;">
      <span class="price-tag" style="font-size:24px;">Rp${p.price.toLocaleString('id-ID')}</span>
      ${p.oldPrice ? `<span class="price-old">Rp${p.oldPrice.toLocaleString('id-ID')}</span>`:""}
    </div>
    <div class="detail-qty">
      <button class="qty-btn" onclick="changeDetailQty(-1)">-</button>
      <span class="qty-val" id="detailQtyVal">1</span>
      <button class="qty-btn" onclick="changeDetailQty(1)">+</button>
    </div>
    <button class="btn btn-primary" style="width:100%;" onclick="addToCart(${p.id}, detailQty); closeModal('detailModal');">Tambah ke Pesanan</button>
  `;
  document.getElementById("detailModal").classList.add("open");
  gtag('event','view_item',{item_id:p.id, item_name:p.name});
}
function changeDetailQty(delta){
  detailQty = Math.max(1, detailQty+delta);
  document.getElementById("detailQtyVal").textContent = detailQty;
}
function closeModal(id){ document.getElementById(id).classList.remove("open"); }

/* =========================================================
   CART LOGIC (localStorage)
   ========================================================= */
function saveCart(){ localStorage.setItem("kopisenja_cart", JSON.stringify(cart)); }

function addToCart(id, qty){
  const p = PRODUCTS.find(x=>x.id===id);
  const existing = cart.find(c=>c.id===id);
  if(existing){ existing.qty += qty; } else { cart.push({id:p.id, name:p.name, price:p.price, img:p.img, qty}); }
  saveCart();
  updateCartUI();
  showToast(`${p.name} ditambahkan ke pesanan ☕`);
  gtag('event','add_to_cart',{item_id:p.id, item_name:p.name, quantity:qty, value:p.price*qty});
}

function updateQty(id, delta){
  const item = cart.find(c=>c.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0) cart = cart.filter(c=>c.id!==id);
  saveCart();
  updateCartUI();
}

function removeItem(id){
  cart = cart.filter(c=>c.id!==id);
  saveCart();
  updateCartUI();
  showToast("Item dihapus dari pesanan");
}

function cartTotal(){ return cart.reduce((sum,c)=>sum+c.price*c.qty,0); }

function updateCartUI(){
  const count = cart.reduce((s,c)=>s+c.qty,0);
  document.getElementById("cartCount").textContent = count;

  const container = document.getElementById("cartItemsContainer");
  if(cart.length===0){
    container.innerHTML = `<div class="cart-empty">Belum ada pesanan.<br>Yuk pilih menu favoritmu! ☕</div>`;
  } else {
    container.innerHTML = cart.map(c=>`
      <div class="cart-item">
        <img class="thumb" src="${c.img}" alt="${c.name}">
        <div class="cart-item-info">
          <h4>${c.name}</h4>
          <div class="unit-price">Rp${c.price.toLocaleString('id-ID')} / gelas</div>
          <div class="qty-controls">
            <button onclick="updateQty(${c.id},-1)">-</button>
            <span>${c.qty}</span>
            <button onclick="updateQty(${c.id},1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeItem(${c.id})">Hapus</button>
        </div>
        <div class="cart-item-total">Rp${(c.price*c.qty).toLocaleString('id-ID')}</div>
      </div>
    `).join("");
  }
  document.getElementById("cartTotalAmt").textContent = `Rp${cartTotal().toLocaleString('id-ID')}`;
  document.getElementById("checkoutBtn").disabled = cart.length===0;
  renderCheckoutSummary();
}

function openCart(){ document.getElementById("cartDrawer").classList.add("open"); document.getElementById("cartDim").classList.add("open"); }
function closeCart(){ document.getElementById("cartDrawer").classList.remove("open"); document.getElementById("cartDim").classList.remove("open"); }

/* =========================================================
   PAGE NAVIGATION: home <-> checkout
   ========================================================= */
function goCheckout(){
  if(cart.length===0) return;
  closeCart();
  document.getElementById("homePage").classList.add("hidden");
  document.getElementById("checkoutPage").classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
  gtag('event','begin_checkout',{value:cartTotal(), items:cart.length});
}
function goHome(){
  document.getElementById("homePage").classList.remove("hidden");
  document.getElementById("checkoutPage").classList.remove("active");
  window.scrollTo({top:0, behavior:"smooth"});
}

function saveOrder(order){
  order.id = "KS" + Date.now().toString().slice(-8);
  order.date = new Date().toISOString();
  order.status = "Diproses";
  try{
    const orders = JSON.parse(localStorage.getItem("kopisenja_orders") || "[]");
    orders.unshift(order);
    localStorage.setItem("kopisenja_orders", JSON.stringify(orders));
  }catch(e){
    console.warn("Gagal menyimpan ke localStorage (mode private/incognito?)", e);
  }
  /* beri tahu tab/halaman admin lain (kalau origin-nya sama) supaya
     langsung refresh tanpa nunggu polling */
  try{
    new BroadcastChannel("kopisenja_sync").postMessage({type:"orders"});
  }catch(e){}
  return order;
}

const ONGKIR = 8000;
function renderCheckoutSummary(){
  const listEl = document.getElementById("checkoutItemsList");
  if(!listEl) return;
  listEl.innerHTML = cart.map(c=>`
    <div class="summary-line"><span>${c.name} x${c.qty}</span><span>Rp${(c.price*c.qty).toLocaleString('id-ID')}</span></div>
  `).join("");
  const subtotal = cartTotal();
  const total = cart.length ? subtotal+ONGKIR : 0;
  document.getElementById("sumSubtotal").textContent = `Rp${subtotal.toLocaleString('id-ID')}`;
  document.getElementById("sumOngkir").textContent = cart.length ? `Rp${ONGKIR.toLocaleString('id-ID')}` : "Rp0";
  document.getElementById("sumTotal").textContent = `Rp${total.toLocaleString('id-ID')}`;
}

/* =========================================================
   PAYMENT METHOD SELECT UI
   ========================================================= */
document.addEventListener("click", (e)=>{
  const el = e.target.closest(".pay-method");
  if(!el) return;
  document.querySelectorAll(".pay-method").forEach(m=>m.classList.remove("selected"));
  el.classList.add("selected");
});

/* =========================================================
   FORM VALIDATION + SIMULASI PEMBAYARAN
   ========================================================= */
function validateField(id, condition){
  const grp = document.getElementById("grp-"+id);
  if(condition){ grp.classList.remove("error"); return true; }
  grp.classList.add("error"); return false;
}

function simulatePayment(){
  if(cart.length===0){ showToast("Pesanan kamu masih kosong."); return; }

  const nama = document.getElementById("nama").value.trim();
  const telp = document.getElementById("telp").value.trim();
  const email = document.getElementById("email").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  const kota = document.getElementById("kota").value.trim();
  const pos = document.getElementById("pos").value.trim();

  let ok = true;
  ok = validateField("nama", nama.length>=3) && ok;
  ok = validateField("telp", /^0[0-9]{9,13}$/.test(telp)) && ok;
  ok = validateField("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) && ok;
  ok = validateField("alamat", alamat.length>=8) && ok;
  ok = validateField("kota", kota.length>=2) && ok;
  ok = validateField("pos", /^[0-9]{5}$/.test(pos)) && ok;

  if(!ok){ showToast("Lengkapi data dengan benar dulu ya 📝"); return; }

  const payMethod = document.querySelector('input[name="pay"]:checked').value;
  const total = cartTotal()+ONGKIR;

  gtag('event','purchase',{value:total, currency:'IDR', payment_type:payMethod, items:cart.length});

  const savedOrder = saveOrder({nama, telp, email, alamat, kota, pos, payMethod, subtotal:cartTotal(), ongkir:ONGKIR, total, items:cart.map(c=>({id:c.id, name:c.name, price:c.price, qty:c.qty}))});

  document.getElementById("successMsg").textContent =
    `Terima kasih, ${nama}! Pesanan senilai Rp${total.toLocaleString('id-ID')} via ${payMethod==='transfer'?'Transfer Bank':payMethod==='ewallet'?'E-Wallet/QRIS':'COD'} sedang diseduh. No. Pesanan: ${savedOrder.id} (simpan untuk cek status).`;
  document.getElementById("successModal").classList.add("open");

  cart = [];
  saveCart();
  updateCartUI();
  document.getElementById("checkoutForm").reset();
}

/* =========================================================
   MOBILE NAV + TOAST
   ========================================================= */
function toggleMobileNav(){ document.getElementById("navLinks").classList.toggle("open"); }
function closeMobileNav(){ document.getElementById("navLinks").classList.remove("open"); }

let toastTimer;
function showToast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove("show"), 2400);
}

/* =========================================================
   INIT
   ========================================================= */
renderCategoryChips();
renderProducts();
updateCartUI();

function openAdminPanel(){
  var root = document.getElementById('adminRoot');
  if(root){ root.classList.add('open'); root.style.display = 'block'; }
  document.body.style.overflow = 'hidden';
}
function closeAdminPanel(){
  var root = document.getElementById('adminRoot');
  if(root){ root.classList.remove('open'); root.style.display = 'none'; }
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function(e){
  var root = document.getElementById('adminRoot');
  if(e.key === 'Escape' && root && root.classList.contains('open')){ closeAdminPanel(); }
});
