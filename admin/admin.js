(function(){

/* =========================================================
   DATA MENU (10 varian kopi ala cafe) — data default, tersimpan
   langsung di file ini supaya tidak butuh file lain.
   ========================================================= */
const Adm_PRODUCTS_DEFAULT = [
  {id:1, name:"Espresso Tunggal", cat:"Espresso", price:18000, oldPrice:null, img:"image/produk/produk-01-espresso-tunggal.jpg", desc:"Shot espresso murni dari biji arabika, pekat dan aromatik.", badge:null},
  {id:2, name:"Americano Dingin", cat:"Espresso", price:20000, oldPrice:null, img:"image/produk/produk-02-americano-dingin.jpg", desc:"Espresso dengan air dingin, ringan dan menyegarkan.", badge:null},
  {id:3, name:"Kopi Susu Gula Aren", cat:"Kopi Susu", price:22000, oldPrice:25000, img:"image/produk/produk-03-kopi-susu-gula-aren.jpg", desc:"Perpaduan kopi robusta, susu segar, dan gula aren asli.", badge:"Best Seller"},
  {id:4, name:"Cappuccino Klasik", cat:"Espresso", price:25000, oldPrice:null, img:"image/produk/produk-04-cappuccino-klasik.jpg", desc:"Espresso dengan foam susu lembut bertekstur creamy.", badge:null},
  {id:5, name:"Cafe Latte Vanilla", cat:"Espresso", price:26000, oldPrice:null, img:"image/produk/produk-05-cafe-latte-vanilla.jpg", desc:"Latte lembut dengan sentuhan sirup vanilla manis.", badge:null},
  {id:6, name:"V60 Manual Brew Arabika", cat:"Manual Brew", price:28000, oldPrice:null, img:"image/produk/produk-06-v60-manual-brew-arabika.jpg", desc:"Diseduh manual dengan V60, rasa fruity dan clean.", badge:"Baru"},
  {id:7, name:"Cold Brew 12 Jam", cat:"Manual Brew", price:24000, oldPrice:null, img:"image/produk/produk-07-cold-brew-12-jam.jpg", desc:"Diseduh dingin selama 12 jam, rendah asam dan smooth.", badge:null},
  {id:8, name:"Mocha Choco Hazelnut", cat:"Espresso", price:27000, oldPrice:30000, img:"image/produk/produk-08-mocha-choco-hazelnut.jpg", desc:"Espresso, coklat, dan hazelnut dalam satu tegukan manis.", badge:"Promo"},
  {id:9, name:"Es Kopi Kelapa", cat:"Kopi Susu", price:23000, oldPrice:null, img:"image/produk/produk-09-es-kopi-kelapa.jpg", desc:"Kopi susu dipadukan santan kelapa segar, creamy tropis.", badge:null},
  {id:10, name:"Croissant Butter Panggang", cat:"Pastry", price:15000, oldPrice:null, img:"image/produk/produk-10-croissant-butter-panggang.jpg", desc:"Croissant renyah berlapis mentega, teman setia ngopi.", badge:"Best Seller"},
];

/* =========================================================
   AUTH (simulasi — bukan keamanan sungguhan, untuk demo tugas)
   ========================================================= */
const Adm_ADMIN_PASSCODE = "admin123";

document.getElementById("admin_loginForm").addEventListener("submit", function(e){
  e.preventDefault();
  const val = document.getElementById("admin_adminPass").value;
  if(val === Adm_ADMIN_PASSCODE){
    sessionStorage.setItem("kopisenja_admin_auth", "1");
    Adm_enterAdmin();
  } else {
    document.getElementById("admin_loginError").style.display = "block";
  }
});

function Adm_enterAdmin(){
  document.getElementById("admin_loginGate").style.display = "none";
  document.getElementById("admin_adminShell").classList.add("active");
  Adm_refreshAll();
}

function Adm_adminLogout(){
  sessionStorage.removeItem("kopisenja_admin_auth");
  document.getElementById("admin_adminShell").classList.remove("active");
  document.getElementById("admin_loginGate").style.display = "flex";
  document.getElementById("admin_adminPass").value = "";
}

if(sessionStorage.getItem("kopisenja_admin_auth") === "1"){ Adm_enterAdmin(); }

/* =========================================================
   DATA ACCESS — produk & pesanan disimpan di localStorage
   supaya sinkron dengan kopi-senja.html (harus 1 folder yang sama)
   ========================================================= */
function Adm_loadProducts(){
  try{
    const saved = JSON.parse(localStorage.getItem("kopisenja_products"));
    if(Array.isArray(saved) && saved.length) return saved;
  }catch(e){}
  return JSON.parse(JSON.stringify(Adm_PRODUCTS_DEFAULT));
}
function Adm_saveProducts(list){ localStorage.setItem("kopisenja_products", JSON.stringify(list)); }

function Adm_loadOrders(){
  try{
    const saved = JSON.parse(localStorage.getItem("kopisenja_orders"));
    if(Array.isArray(saved)) return saved;
  }catch(e){
    console.warn("Gagal membaca localStorage (mode private/incognito?)", e);
  }
  return [];
}
function Adm_saveOrders(list){
  try{
    localStorage.setItem("kopisenja_orders", JSON.stringify(list));
  }catch(e){
    Adm_showToast("Gagal menyimpan data. Cek pengaturan browser (mode private/incognito bisa memblokir ini).");
  }
}

/* =========================================================
   EXPORT / IMPORT PESANAN — jalur cadangan kalau localStorage
   tidak ke-share antara file kopi-senja & admin (mis. saat
   dua file dibuka langsung lewat file:// tanpa server lokal,
   browser bisa menganggap keduanya origin berbeda).
   ========================================================= */
function Adm_exportOrdersJSON(){
  const data = JSON.stringify(Adm_loadOrders(), null, 2);
  const blob = new Blob([data], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kopisenja_orders_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  Adm_showToast("Pesanan diekspor ke file JSON.");
}

function Adm_importOrdersJSON(event){
  const file = event.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const incoming = JSON.parse(reader.result);
      if(!Array.isArray(incoming)) throw new Error("Format tidak valid");
      const existing = Adm_loadOrders();
      const byId = new Map(existing.map(o=>[o.id, o]));
      incoming.forEach(o=>{ if(o && o.id) byId.set(o.id, o); });
      const merged = Array.from(byId.values()).sort((a,b)=> new Date(b.date)-new Date(a.date));
      Adm_saveOrders(merged);
      Adm_refreshAll();
      Adm_showToast(`Berhasil impor ${incoming.length} pesanan.`);
    }catch(e){
      Adm_showToast("Gagal impor: file JSON tidak valid.");
    }finally{
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

let Adm_PRODUCTS = Adm_loadProducts();
let Adm_ORDERS = Adm_loadOrders();
if(!localStorage.getItem("kopisenja_products")) Adm_saveProducts(Adm_PRODUCTS);

/* =========================================================
   NAVIGATION
   ========================================================= */
const Adm_viewMeta = {
  dashboard: {title:"Dashboard", sub:"Ringkasan performa toko Kopi Senja"},
  orders: {title:"Pesanan", sub:"Semua pesanan yang masuk dari pelanggan"},
  products: {title:"Produk", sub:"Kelola menu yang tampil di halaman toko"},
};
function Adm_switchView(name){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  document.getElementById("view-"+name).classList.add("active");
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active", b.dataset.view===name));
  document.getElementById("admin_topbarTitle").textContent = Adm_viewMeta[name].title;
  document.getElementById("admin_topbarSub").textContent = Adm_viewMeta[name].sub;
  document.getElementById("admin_sidebar").classList.remove("open");
  Adm_refreshAll();
}

function Adm_refreshAll(){
  Adm_PRODUCTS = Adm_loadProducts();
  Adm_ORDERS = Adm_loadOrders();
  Adm_renderDashboard();
  Adm_renderOrders();
  Adm_renderProductsTable();
}

/* =========================================================
   DASHBOARD
   ========================================================= */
function Adm_renderDashboard(){
  const validOrders = Adm_ORDERS.filter(o=>o.status !== "Dibatalkan");
  const revenue = validOrders.reduce((s,o)=>s+o.total,0);
  const aov = validOrders.length ? Math.round(revenue/validOrders.length) : 0;

  document.getElementById("admin_statRevenue").textContent = "Rp"+revenue.toLocaleString('id-ID');
  document.getElementById("admin_statOrders").textContent = Adm_ORDERS.length;
  document.getElementById("admin_statAOV").textContent = "Rp"+aov.toLocaleString('id-ID');

  const todayStr = new Date().toDateString();
  const todayCount = Adm_ORDERS.filter(o=>new Date(o.date).toDateString()===todayStr).length;
  document.getElementById("admin_statOrdersSub").textContent = `${todayCount} pesanan hari ini`;

  // best seller
  const qtyMap = {};
  validOrders.forEach(o=> o.items.forEach(it=>{ qtyMap[it.id] = (qtyMap[it.id]||0) + it.qty; }));
  const ranked = Object.entries(qtyMap).sort((a,b)=>b[1]-a[1]);
  if(ranked.length){
    const top = Adm_PRODUCTS.find(p=>p.id==ranked[0][0]);
    document.getElementById("admin_statBestSeller").textContent = top ? top.name : "—";
    document.getElementById("admin_statBestSellerSub").textContent = `${ranked[0][1]} porsi terjual`;
  } else {
    document.getElementById("admin_statBestSeller").textContent = "Belum ada data";
    document.getElementById("admin_statBestSellerSub").textContent = "menunggu pesanan pertama";
  }

  // revenue last 7 days bar chart
  const days = [];
  for(let i=6;i>=0;i--){
    const d = new Date(); d.setDate(d.getDate()-i);
    days.push(d);
  }
  const dayRevenue = days.map(d=>{
    const key = d.toDateString();
    return validOrders.filter(o=>new Date(o.date).toDateString()===key).reduce((s,o)=>s+o.total,0);
  });
  const maxRev = Math.max(...dayRevenue, 1);
  const chart = document.getElementById("admin_revenueChart");
  chart.innerHTML = days.map((d,i)=>{
    const h = Math.max(4, Math.round((dayRevenue[i]/maxRev)*150));
    const label = d.toLocaleDateString('id-ID',{weekday:'short'});
    return `<div class="bar-col">
      <span class="bar-val">${dayRevenue[i]>0 ? (dayRevenue[i]/1000).toFixed(0)+'k' : ''}</span>
      <div class="bar-fill" style="height:${h}px;"></div>
      <span class="bar-label">${label}</span>
    </div>`;
  }).join("");

  // top 5 products list
  const listEl = document.getElementById("admin_topProductsList");
  if(!ranked.length){
    listEl.innerHTML = `<p style="color:var(--ink-soft); font-size:13.5px;">Belum ada penjualan tercatat. Data akan muncul setelah ada pesanan masuk dari halaman toko.</p>`;
  } else {
    listEl.innerHTML = ranked.slice(0,5).map((r,i)=>{
      const p = Adm_PRODUCTS.find(x=>x.id==r[0]);
      if(!p) return "";
      return `<div class="rank-item">
        <span class="rank-num">${i+1}</span>
        <img src="${p.img}" alt="${p.name}">
        <div class="rank-info">
          <div class="name">${p.name}</div>
          <div class="sub">${r[1]} porsi terjual</div>
        </div>
        <div class="rank-amt">Rp${(p.price*r[1]).toLocaleString('id-ID')}</div>
      </div>`;
    }).join("");
  }

  // conversion rate: orders vs orders+cancelled treated as sessions dummy multiplier
  const convBase = Adm_ORDERS.length ? Math.min(97, Math.round((validOrders.length / (Adm_ORDERS.length + Math.max(4, Adm_ORDERS.length*3))) * 100)) : 0;
  document.getElementById("admin_gaConv").textContent = Adm_ORDERS.length ? convBase + "%" : "—";
}

/* =========================================================
   Adm_ORDERS TABLE
   ========================================================= */
function Adm_renderOrders(){
  const q = document.getElementById("admin_orderSearch").value.trim().toLowerCase();
  const statusFilter = document.getElementById("admin_orderStatusFilter").value;
  let list = Adm_ORDERS.filter(o=>{
    const matchQ = !q || o.nama.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || (o.telp||"").includes(q);
    const matchStatus = statusFilter==="Semua" || o.status===statusFilter;
    return matchQ && matchStatus;
  });
  const tbody = document.getElementById("admin_ordersTbody");
  if(!list.length){
    tbody.innerHTML = `<tr class="empty-row"><td colspan="7">🧾 Belum ada pesanan yang cocok. Pesanan akan muncul di sini setelah pelanggan checkout di halaman toko.</td></tr>`;
    return;
  }
  const payLabel = {transfer:"Transfer Bank", ewallet:"E-Wallet/QRIS", cod:"COD"};
  tbody.innerHTML = list.map(o=>{
    const itemsSummary = o.items.map(it=>`${it.name} x${it.qty}`).join(", ");
    const dt = new Date(o.date);
    const timeStr = dt.toLocaleDateString('id-ID',{day:'2-digit',month:'short'}) + " " + dt.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
    return `<tr>
      <td data-label="ID"><span class="mono">${o.id}</span></td>
      <td data-label="Pelanggan"><strong>${o.nama}</strong><br><span style="font-size:11.5px; color:var(--ink-soft);">${o.telp}</span></td>
      <td data-label="Item" style="max-width:220px;">${itemsSummary}</td>
      <td data-label="Total"><strong>Rp${o.total.toLocaleString('id-ID')}</strong></td>
      <td data-label="Pembayaran">${payLabel[o.payMethod]||o.payMethod}</td>
      <td data-label="Waktu">${timeStr}</td>
      <td data-label="Status">
        <select class="status-select status-${o.status}" onchange="Adm_updateOrderStatus('${o.id}', this.value)">
          <option ${o.status==='Baru'?'selected':''}>Baru</option>
          <option ${o.status==='Diproses'?'selected':''}>Diproses</option>
          <option ${o.status==='Selesai'?'selected':''}>Selesai</option>
          <option ${o.status==='Dibatalkan'?'selected':''}>Dibatalkan</option>
        </select>
      </td>
    </tr>`;
  }).join("");
}

function Adm_updateOrderStatus(id, status){
  const o = Adm_ORDERS.find(x=>x.id===id);
  if(!o) return;
  o.status = status;
  Adm_saveOrders(Adm_ORDERS);
  Adm_showToast(`Status pesanan ${id} diubah ke "${status}"`);
  Adm_renderDashboard();
}

/* =========================================================
   Adm_PRODUCTS TABLE + CRUD
   ========================================================= */
function Adm_renderProductsTable(){
  const q = document.getElementById("admin_productSearch").value.trim().toLowerCase();
  const list = Adm_PRODUCTS.filter(p=>p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q));
  const tbody = document.getElementById("admin_productsTbody");
  if(!list.length){
    tbody.innerHTML = `<tr class="empty-row"><td colspan="5">Tidak ada menu yang cocok dengan pencarian.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(p=>`
    <tr>
      <td data-label="Menu">
        <div class="prod-cell">
          <img src="${p.img}" alt="${p.name}">
          <div><div class="pname">${p.name}</div><div class="pcat">${p.desc}</div></div>
        </div>
      </td>
      <td data-label="Kategori">${p.cat}</td>
      <td data-label="Harga">Rp${p.price.toLocaleString('id-ID')}${p.oldPrice?`<span class="price-old-sm">Rp${p.oldPrice.toLocaleString('id-ID')}</span>`:""}</td>
      <td data-label="Badge">${p.badge?`<span class="badge-tag">${p.badge}</span>`:"—"}</td>
      <td data-label="Aksi">
        <div class="row-actions">
          <button class="icon-btn" title="Edit" onclick="Adm_openProductModal(${p.id})">✏️</button>
          <button class="icon-btn danger" title="Hapus" onclick="Adm_askDeleteProduct(${p.id})">🗑️</button>
        </div>
      </td>
    </tr>
  `).join("");
}

let Adm_editingImgData = null;

function Adm_openProductModal(id){
  document.getElementById("admin_catList").innerHTML = [...new Set(Adm_PRODUCTS.map(p=>p.cat))].map(c=>`<option value="${c}">`).join("");
  Adm_editingImgData = null;
  if(id){
    const p = Adm_PRODUCTS.find(x=>x.id===id);
    document.getElementById("admin_productModalTitle").textContent = "Edit Menu";
    document.getElementById("admin_prodId").value = p.id;
    document.getElementById("admin_prodName").value = p.name;
    document.getElementById("admin_prodCat").value = p.cat;
    document.getElementById("admin_prodPrice").value = p.price;
    document.getElementById("admin_prodOldPrice").value = p.oldPrice || "";
    document.getElementById("admin_prodDesc").value = p.desc;
    document.getElementById("admin_prodBadge").value = p.badge || "";
    document.getElementById("admin_imgPreview").src = p.img;
    document.getElementById("admin_imgPreview").style.display = "block";
    Adm_editingImgData = p.img;
  } else {
    document.getElementById("admin_productModalTitle").textContent = "Tambah Menu";
    document.getElementById("admin_prodId").value = "";
    document.getElementById("admin_prodName").value = "";
    document.getElementById("admin_prodCat").value = "";
    document.getElementById("admin_prodPrice").value = "";
    document.getElementById("admin_prodOldPrice").value = "";
    document.getElementById("admin_prodDesc").value = "";
    document.getElementById("admin_prodBadge").value = "";
    document.getElementById("admin_imgPreview").style.display = "none";
    document.getElementById("admin_prodImageFile").value = "";
  }
  document.getElementById("admin_productModal").classList.add("open");
}

function Adm_handleImageUpload(e){
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(ev){
    Adm_editingImgData = ev.target.result;
    document.getElementById("admin_imgPreview").src = Adm_editingImgData;
    document.getElementById("admin_imgPreview").style.display = "block";
  };
  reader.readAsDataURL(file);
}

function Adm_saveProduct(){
  const name = document.getElementById("admin_prodName").value.trim();
  const cat = document.getElementById("admin_prodCat").value.trim();
  const price = parseInt(document.getElementById("admin_prodPrice").value, 10);
  const oldPriceRaw = document.getElementById("admin_prodOldPrice").value;
  const desc = document.getElementById("admin_prodDesc").value.trim();
  const badge = document.getElementById("admin_prodBadge").value || null;
  const idRaw = document.getElementById("admin_prodId").value;

  if(!name || !cat || !price || price<=0){
    Adm_showToast("Lengkapi nama, kategori, dan harga menu dulu ya 📝");
    return;
  }
  if(!Adm_editingImgData){
    Adm_showToast("Upload dulu foto menunya ☕");
    return;
  }

  const oldPrice = oldPriceRaw ? parseInt(oldPriceRaw,10) : null;

  if(idRaw){
    const p = Adm_PRODUCTS.find(x=>x.id===parseInt(idRaw,10));
    Object.assign(p, {name, cat, price, oldPrice, desc, badge, img: Adm_editingImgData});
    Adm_showToast(`"${name}" berhasil diperbarui`);
  } else {
    const newId = Adm_PRODUCTS.length ? Math.max(...Adm_PRODUCTS.map(p=>p.id))+1 : 1;
    Adm_PRODUCTS.push({id:newId, name, cat, price, oldPrice, desc, badge, img: Adm_editingImgData});
    Adm_showToast(`"${name}" berhasil ditambahkan ke menu`);
  }
  Adm_saveProducts(Adm_PRODUCTS);
  Adm_closeModal("productModal");
  Adm_renderProductsTable();
  Adm_renderDashboard();
}

let Adm_pendingDeleteId = null;
function Adm_askDeleteProduct(id){
  Adm_pendingDeleteId = id;
  const p = Adm_PRODUCTS.find(x=>x.id===id);
  document.getElementById("admin_confirmText").textContent = `"${p.name}" akan dihapus permanen dari katalog toko.`;
  document.getElementById("admin_confirmModal").classList.add("open");
}
function Adm_confirmDeleteProduct(){
  Adm_PRODUCTS = Adm_PRODUCTS.filter(p=>p.id!==Adm_pendingDeleteId);
  Adm_saveProducts(Adm_PRODUCTS);
  Adm_closeModal("confirmModal");
  Adm_renderProductsTable();
  Adm_renderDashboard();
  Adm_showToast("Menu berhasil dihapus");
}

function Adm_resetProductsToDefault(){
  if(!confirm("Kembalikan semua menu ke data default? Perubahan yang belum disimpan di tempat lain akan hilang.")) return;
  Adm_PRODUCTS = JSON.parse(JSON.stringify(Adm_PRODUCTS_DEFAULT));
  Adm_saveProducts(Adm_PRODUCTS);
  Adm_renderProductsTable();
  Adm_renderDashboard();
  Adm_showToast("Menu dikembalikan ke data default");
}

function Adm_closeModal(id){ document.getElementById(id).classList.remove("open"); }

/* =========================================================
   TOAST
   ========================================================= */
let Adm_toastTimer;
function Adm_showToast(msg){
  const t = document.getElementById("admin_toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(Adm_toastTimer);
  Adm_toastTimer = setTimeout(()=>t.classList.remove("show"), 2600);
}

/* refresh data automatically if another tab (the storefront) updates localStorage */
window.addEventListener("storage", (e)=>{
  if(["kopisenja_orders","kopisenja_products"].includes(e.key)) Adm_refreshAll();
});

/* BroadcastChannel — sync instan antar tab/halaman selama masih 1 origin
   yang sama (mis. dibuka lewat server lokal http://localhost/...).
   Ini lebih cepat & lebih reliable dibanding "storage" event. */
try{
  const syncChannel = new BroadcastChannel("kopisenja_sync");
  syncChannel.onmessage = (e)=>{
    if(e && e.data && ["orders","products"].includes(e.data.type)) Adm_refreshAll();
  };
}catch(e){
  console.warn("BroadcastChannel tidak didukung di browser ini, mengandalkan storage event + polling.");
}

/* refresh ulang begitu tab admin kembali aktif/difokuskan — jaga-jaga
   kalau ada perubahan yang lewat saat tab sedang tidak aktif */
window.addEventListener("focus", ()=>{
  if(sessionStorage.getItem("kopisenja_admin_auth") === "1") Adm_refreshAll();
});
document.addEventListener("visibilitychange", ()=>{
  if(document.visibilityState === "visible" && sessionStorage.getItem("kopisenja_admin_auth") === "1") Adm_refreshAll();
});

/* fallback polling — some browsers don't fire the "storage" event reliably
   between two file:// documents, so we also re-check every few seconds
   while the admin panel is open and authenticated. */
setInterval(()=>{
  if(sessionStorage.getItem("kopisenja_admin_auth") === "1"){
    const latestOrders = JSON.stringify(Adm_loadOrders());
    const latestProducts = JSON.stringify(Adm_loadProducts());
    if(latestOrders !== JSON.stringify(Adm_ORDERS) || latestProducts !== JSON.stringify(Adm_PRODUCTS)){
      Adm_refreshAll();
    }
  }
}, 3000);


window.Adm_adminLogout = Adm_adminLogout;
window.Adm_closeModal = Adm_closeModal;
window.Adm_confirmDeleteProduct = Adm_confirmDeleteProduct;
window.Adm_exportOrdersJSON = Adm_exportOrdersJSON;
window.Adm_handleImageUpload = Adm_handleImageUpload;
window.Adm_importOrdersJSON = Adm_importOrdersJSON;
window.Adm_openProductModal = Adm_openProductModal;
window.Adm_refreshAll = Adm_refreshAll;
window.Adm_renderOrders = Adm_renderOrders;
window.Adm_renderProductsTable = Adm_renderProductsTable;
window.Adm_resetProductsToDefault = Adm_resetProductsToDefault;
window.Adm_saveProduct = Adm_saveProduct;
window.Adm_showToast = Adm_showToast;
window.Adm_switchView = Adm_switchView;
window.Adm_askDeleteProduct = Adm_askDeleteProduct;
window.Adm_openAdminPanel = function(){
  document.getElementById('adminRoot').style.display = 'block';
};
window.Adm_closeAdminPanel = function(){
  document.getElementById('adminRoot').style.display = 'none';
};

})();
