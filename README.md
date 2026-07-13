☕ KOPI SENJA
============

> Proyek Pengembangan Platform E-Commerce Kedai Kopi — "Ngopi Ala Cafe, Kapan Aja"

Website katalog & pemesanan online untuk kedai kopi **Kopi Senja**, dilengkapi
keranjang belanja, alur checkout, simulasi metode pembayaran, dan panel admin
untuk mengelola menu serta pesanan — seluruhnya berjalan di sisi klien
(client-side) menggunakan `localStorage`, tanpa memerlukan server/database.

---

## 📑 Daftar Isi

1. [Identitas Proyek](#-identitas-proyek)
2. [Deskripsi Proyek](#-deskripsi-proyek)
3. [Fitur Utama](#-fitur-utama)
   - [Fitur Pelanggan (Storefront)](#a-fitur-pelanggan-storefront)
   - [Fitur Admin (Dashboard)](#b-fitur-admin-dashboard)
4. [Struktur Folder & Berkas](#-struktur-folder--berkas)
5. [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
6. [Cara Menjalankan Proyek](#-cara-menjalankan-proyek)
7. [Panduan Penggunaan](#-panduan-penggunaan)
   - [Sebagai Pelanggan](#sebagai-pelanggan)
   - [Sebagai Admin](#sebagai-admin)
8. [Daftar Menu / Data Produk](#-daftar-menu--data-produk)
9. [Penyimpanan Data (localStorage)](#-penyimpanan-data-localstorage)
10. [Alur Sistem](#-alur-sistem)
11. [Rencana Pengembangan Selanjutnya](#-rencana-pengembangan-selanjutnya)
12. [Catatan & Batasan](#-catatan--batasan)
13. [Lisensi](#-lisensi)

---

## 👤 Identitas Proyek

| Keterangan     | Detail                                   |
|----------------|-------------------------------------------|
| Nama Proyek    | Kopi Senja — Website E-Commerce Kedai Kopi |
| Nama Mahasiswa | *Rina Santiya*                  |
| NIM            | *209250151*                   |
| Semester | *Genap 2025/2026*                |
| Mata Kuliah    | *KOMPUTER APLIKASI IT II*  |
| Kelas | *ABI6*           |
| Institusi      | *International Women University*           |
| Link Website E-commerce | *https://rinasantiya.github.io/kopi-senja-/*  |
| Link Youtube | *                    |
| Link Github | *https://github.com/rinasantiya/kopi-senja-* |

>

---

## 📝 Deskripsi Proyek

**Kopi Senja** adalah simulasi platform e-commerce untuk kedai kopi berkonsep
"cafe kapan saja, di mana saja". Proyek ini dibangun sebagai studi kasus
pengembangan front-end web dengan pendekatan **Single Page Application (SPA)**
sederhana — seluruh halaman (beranda, katalog menu, keranjang, checkout, dan
panel admin) berjalan dalam satu berkas `index.html` yang saling terhubung
melalui JavaScript, tanpa reload halaman penuh.

Proyek ini mendemonstrasikan alur bisnis e-commerce dari sisi pelanggan
(melihat katalog → menambah ke keranjang → checkout → konfirmasi pesanan)
hingga sisi pengelola toko (memantau statistik penjualan, mengelola data
menu, dan memproses status pesanan) — lengkap dengan simulasi integrasi
**Google Analytics** untuk pelacakan metrik toko.

---

## ✨ Fitur Utama

### A. Fitur Pelanggan (Storefront)

- 🏠 **Beranda / Hero Section** — perkenalan brand, ajakan bertindak (CTA), dan statistik toko.
- 🔎 **Katalog Menu Interaktif**
  - Pencarian menu secara *realtime* berdasarkan nama.
  - Filter berdasarkan kategori (Espresso, Kopi Susu, Manual Brew, Pastry).
  - Pengurutan produk (termurah, termahal, terbaru, dsb).
  - Label badge otomatis, misalnya **Best Seller** dan **Promo**.
- 🖼️ **Detail Produk** — modal pop-up berisi gambar, deskripsi, dan pengatur jumlah pesanan.
- 🛒 **Keranjang Belanja (Cart Drawer)** — tambah/kurangi/hapus item, kalkulasi subtotal otomatis, tersimpan di `localStorage` sehingga tidak hilang saat halaman dimuat ulang.
- 💳 **Halaman Checkout**
  - Formulir data pelanggan (nama, telepon, email, alamat lengkap, kota, kode pos) lengkap dengan validasi.
  - Ringkasan pesanan (subtotal, ongkos antar, total akhir).
  - Simulasi metode pembayaran: **Transfer Bank**, **E-Wallet/QRIS**, dan **Bayar di Tempat (COD)**.
- ✅ **Konfirmasi Pesanan** — modal sukses setelah checkout berhasil disertai pesan terima kasih.
- 📢 **Ulasan Pembeli** — bagian testimoni pelanggan.
- 📱 **Responsive Design** — tampilan menyesuaikan perangkat mobile & desktop, termasuk menu hamburger.
- 🔔 **Notifikasi Toast** — umpan balik interaktif setiap ada aksi (tambah ke keranjang, dsb).

### B. Fitur Admin (Dashboard)

- 🔐 **Gerbang Login Admin** — akses panel dibatasi kode akses khusus admin.
- 📊 **Dashboard Ringkasan**
  - Total pendapatan (revenue) dari seluruh pesanan.
  - Jumlah pesanan & pesanan hari ini.
  - Rata-rata nilai pesanan (*Average Order Value*).
  - Menu terlaris (*best seller*).
  - Grafik pendapatan & daftar produk teratas.
  - Ringkasan metrik ala Google Analytics (*conversion rate*, dll).
- 📦 **Manajemen Pesanan**
  - Pencarian pesanan berdasarkan nama, ID, atau nomor HP.
  - Filter berdasarkan status pesanan.
  - Ekspor/impor data pesanan dalam format JSON (sebagai cadangan data).
- 🍩 **Manajemen Menu (CRUD Produk)**
  - Tambah menu baru lengkap dengan unggah gambar, kategori, harga, harga coret (diskon), deskripsi, dan badge promosi.
  - Edit & hapus menu dengan modal konfirmasi.
  - Pencarian menu di tabel admin.
- 🖥️ **Antarmuka Admin Terpisah** — memiliki tampilan (sidebar, topbar) dan gaya visual tersendiri dari halaman pelanggan.

---

## 🗂️ Struktur Folder & Berkas

```
kopi-senja/
├── admin/
│   └── admin.js              # Seluruh logika panel admin (dashboard, CRUD menu, kelola pesanan)
├── css/
│   └── style.css             # Seluruh gaya visual (storefront + admin) dalam satu berkas
├── image/
│   └── produk/                # Foto-foto menu (10 gambar, diekstrak dari data asli)
│       ├── produk-01-espresso-tunggal.jpg
│       ├── produk-02-americano-dingin.jpg
│       ├── produk-03-kopi-susu-gula-aren.jpg
│       ├── produk-04-cappuccino-klasik.jpg
│       ├── produk-05-cafe-latte-vanilla.jpg
│       ├── produk-06-v60-manual-brew-arabika.jpg
│       ├── produk-07-cold-brew-12-jam.jpg
│       ├── produk-08-mocha-choco-hazelnut.jpg
│       ├── produk-09-es-kopi-kelapa.jpg
│       └── produk-10-croissant-butter-panggang.jpg
├── js/
│   ├── data.js                # Data default 10 menu (nama, kategori, harga, gambar, deskripsi)
│   └── main.js                # Logika storefront (render produk, keranjang, checkout, cart)
├── index.html                 # Halaman utama (beranda, menu, checkout, panel admin tersemat)
└── README.md                  # Dokumentasi proyek (berkas ini)
```

> 💡 Struktur folder di atas mengikuti pola umum proyek web statis (mirip
> proyek referensi `admin/ css/ image/ js/`), sehingga memudahkan penilaian
> dan navigasi berkas oleh dosen/asisten.

---

## 🛠️ Teknologi yang Digunakan

| Teknologi           | Kegunaan                                             |
|----------------------|-------------------------------------------------------|
| **HTML5**            | Struktur & semantik halaman                          |
| **CSS3**             | Styling, layout grid/flexbox, responsive design       |
| **JavaScript (Vanilla / ES6)** | Logika interaktif (tanpa framework)         |
| **Web Storage API (`localStorage`)** | Penyimpanan data produk, keranjang, dan pesanan di browser |
| **Google Fonts** (`Fraunces`, `Work Sans`) | Tipografi antarmuka                    |
| **Google Analytics (gtag.js)** | Simulasi pelacakan metrik toko (dummy ID)      |

Tidak ada dependensi build tools, framework, atau server backend — proyek
ini murni **static website** yang dapat langsung dibuka dari browser.

---

## 🚀 Cara Menjalankan Proyek

### Opsi 1 — Langsung dibuka dari file (tercepat)
1. Unduh/`clone` repository ini.
2. Klik dua kali (atau buka dengan browser) berkas **`index.html`**.
3. Website akan langsung berjalan tanpa perlu instalasi tambahan.

### Opsi 2 — Menjalankan lewat local server (disarankan)
Beberapa fitur (seperti pemuatan gambar) bekerja lebih stabil jika dijalankan
lewat server lokal, bukan langsung dari `file://`.

```bash
# Menggunakan Python
python3 -m http.server 8000

# lalu buka di browser:
# http://localhost:8000
```

Atau menggunakan ekstensi **Live Server** di Visual Studio Code:
1. Buka folder proyek di VS Code.
2. Klik kanan `index.html` → **Open with Live Server**.

### Opsi 3 — GitHub Pages
1. Push repository ke GitHub.
2. Masuk ke **Settings → Pages**.
3. Pilih branch `main` dan folder `/ (root)`.
4. Website dapat diakses melalui URL GitHub Pages yang diberikan.

---

## 📖 Panduan Penggunaan

### Sebagai Pelanggan
1. Buka `index.html`, jelajahi menu di bagian **Menu**.
2. Gunakan kolom pencarian atau filter kategori untuk menemukan menu tertentu.
3. Klik kartu menu untuk melihat detail & mengatur jumlah pesanan.
4. Klik **Tambah ke Keranjang**, lalu buka ikon **Pesanan** di navbar untuk meninjau keranjang.
5. Klik **Checkout**, isi data pengiriman dan pilih metode pembayaran.
6. Klik tombol pemesanan untuk menyelesaikan transaksi — modal konfirmasi akan muncul.

### Sebagai Admin
1. Cari tombol/akses **Panel Admin** (biasanya tersembunyi di footer atau navigasi).
2. Masukkan **kode akses admin** pada gerbang login.
3. Setelah masuk, admin dapat:
   - Melihat ringkasan performa toko di **Dashboard**.
   - Mengelola daftar pesanan pelanggan di menu **Pesanan**.
   - Menambah, mengedit, atau menghapus menu di menu **Produk**.

> 🔑 **Catatan keamanan:** Kode akses admin ditanam langsung di kode sumber
> untuk keperluan simulasi/demo tugas kuliah. Untuk penggunaan produksi
> sungguhan, autentikasi semacam ini **wajib** dipindahkan ke backend yang aman.

---

## 🍵 Daftar Menu / Data Produk

| No | Nama Menu                  | Kategori     | Harga     | Keterangan     |
|----|------------------------------|--------------|-----------|-----------------|
| 1  | Espresso Tunggal             | Espresso     | Rp18.000  | —               |
| 2  | Americano Dingin              | Espresso     | Rp20.000  | —               |
| 3  | Kopi Susu Gula Aren           | Kopi Susu    | Rp22.000  | 🔥 Best Seller (diskon dari Rp25.000) |
| 4  | Cappuccino Klasik             | Espresso     | Rp25.000  | —               |
| 5  | Cafe Latte Vanilla            | Espresso     | Rp26.000  | —               |
| 6  | V60 Manual Brew Arabika       | Manual Brew  | Rp28.000  | —               |
| 7  | Cold Brew 12 Jam              | Manual Brew  | Rp24.000  | —               |
| 8  | Mocha Choco Hazelnut          | Espresso     | Rp27.000  | Promo (diskon dari Rp30.000) |
| 9  | Es Kopi Kelapa                | Kopi Susu    | Rp23.000  | —               |
| 10 | Croissant Butter Panggang     | Pastry       | Rp15.000  | —               |

Data menu tersimpan pada `js/data.js` dan dapat diubah kapan saja lewat
**Panel Admin** tanpa perlu mengedit kode secara manual.

---

## 💾 Penyimpanan Data (`localStorage`)

Karena proyek ini tidak memiliki backend/database, seluruh data disimpan di
`localStorage` browser dengan kunci berikut:

| Kunci `localStorage`     | Isi Data                                  |
|--------------------------|---------------------------------------------|
| `kopisenja_products`     | Daftar menu (hasil tambah/edit dari admin) |
| `kopisenja_cart`         | Isi keranjang belanja pelanggan            |
| `kopisenja_orders`       | Riwayat seluruh pesanan yang telah dibuat  |

> ⚠️ Data akan hilang jika `localStorage` browser dibersihkan (clear cache),
> dan bersifat lokal per-browser/per-perangkat (tidak tersinkron antar
> perangkat). Panel admin menyediakan fitur **ekspor/impor JSON** sebagai
> cadangan data.

---

## 🔄 Alur Sistem

```
Pelanggan membuka index.html
        │
        ▼
Melihat Katalog Menu  ──▶  Klik Detail Produk ──▶ Atur Jumlah ──▶ Tambah ke Keranjang
        │                                                              │
        ▼                                                              ▼
   Ulasan Pembeli                                                Keranjang (Cart Drawer)
                                                                        │
                                                                        ▼
                                                                    Checkout
                                                                        │
                                                     Isi Data + Pilih Pembayaran
                                                                        │
                                                                        ▼
                                                          Konfirmasi Pesanan (Sukses)
                                                                        │
                                                                        ▼
                                                     Data pesanan tersimpan ke localStorage
                                                                        │
                                                                        ▼
                                              Admin login ──▶ Panel Admin ──▶ Kelola Pesanan & Menu
```

---

## 🧭 Rencana Pengembangan Selanjutnya

- [ ] Integrasi backend & database sungguhan (mis. Node.js/Express + MySQL atau Firebase).
- [ ] Autentikasi admin yang aman (hashing password, sesi/token).
- [ ] Integrasi payment gateway asli (Midtrans/Xendit) menggantikan simulasi.
- [ ] Fitur lacak status pesanan bagi pelanggan (order tracking).
- [ ] Sistem akun/login pelanggan agar riwayat pesanan tidak bergantung pada satu perangkat.
- [ ] Optimasi gambar (kompresi & lazy-loading) untuk performa lebih baik.

---

## ⚠️ Catatan & Batasan

- Seluruh transaksi dan pembayaran bersifat **simulasi**, tidak ada koneksi ke payment gateway sungguhan.
- ID pengukuran Google Analytics (`GA_MEASUREMENT_ID`) masih berupa **placeholder** dan perlu diganti dengan ID asli bila ingin melacak trafik sungguhan.
- Karena data tersimpan di `localStorage`, proyek ini cocok untuk **demo/simulasi/tugas akademik**, bukan untuk transaksi produksi nyata.
- Disarankan menjalankan lewat *local server* (lihat [Cara Menjalankan Proyek](#-cara-menjalankan-proyek)) untuk pengalaman terbaik.

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan tugas akademik/pembelajaran dan bersifat
bebas digunakan, dimodifikasi, serta dikembangkan lebih lanjut untuk tujuan
non-komersial maupun edukasi.

---

<p align="center">Dibuat dengan ☕ dan semangat belajar — <strong>Kopi Senja</strong></p>
