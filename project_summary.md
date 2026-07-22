# Kak Efa Facilities Dashboard — Ringkasan Keseluruhan Projek

**Kak Efa Facilities Dashboard** ialah sebuah sistem pengurusan & analitik permohonan kemudahan pembiayaan kewangan (*financing facilities*) gred korporat B2B yang direka khas untuk memantau, menganalisis, dan mengurus keseluruhan permohonan pembiayaan syarikat mengikut partner bank, kadar BFR, cadangan pengurusan (*Boss Review*), serta kawalan akses pengguna (*RBAC*).

---

## 🛠️ 1. Teknologi & Seni Bina Sistem

| Komponen | Teknologi |
| :--- | :--- |
| **Seni Bina Utama** | Single Page Application (SPA) — Vanilla JavaScript (ES6+), HTML5 |
| **Penggayaan (CSS)** | Custom Vanilla CSS3 — System Theme: **White Corporate / Linear B2B** (`tasteskill.dev`) |
| **Pangkalan Data & Auth** | Supabase (PostgreSQL, Supabase Auth, Row Level Security) |
| **Carta & Analitik** | Apache ECharts 5.x |
| **Pengujian (Testing)** | Playwright End-to-End (E2E) Test Suite (8 Test Cases) |
| **Peluapan (Export)** | CSV Data Export & Executive PDF Printable Report (`window.print`) |

---

## 📱 2. Modul-Modul Utama Sistem (7 Modul Teras)

### 📊 Modul 1: Dashboard (Papan Pemuka Eksekutif)
- **Insight Alert Banner**: Banner amaran dinamik (*"Decline rate exceeds completion rate"*) yang muncul secara automatik apabila kadar permohonan ditolak melebihi permohonan selesai.
- **Pipeline Metric Block**: Kad berangkai 4-lajur (*Total Applications*, *Done*, *In Progress*, *Declined*) berserta penyerlahan warna merah (*Declined ↗*).
- **Funding and Approval Overview**: Meter Donut SVG peratusan kelulusan (`% approved`) berserta bar perbandingan *Requested vs Approved* (`RM`).
- **Application Status Distribution**: Multi-color stacked progress bar mengikut status (*Done*, *In Progress*, *Hold*, *Declined*, *Pending*) berserta peratusan petunjuk.
- **Applications by Partner Bank**: Bar kemajuan bank utama berserta butang kembangan dinamik (*Show X more banks*).
- **Top Companies — Requested vs Approved**: Senarai syarikat utama dengan dual progress bar & angka RM monospaced.
- **Decline Reasons Analysis**: Analisis sebab penolakan permohonan kewangan.
- **Recent Applications**: Jadual 5 aplikasi terkini berserta lencana status & pautan `View all →`.

### 📋 Modul 2: Applications (Pengurusan Permohonan)
- Pengurusan penuh permohonan kemudahan pembiayaan.
- Bar penapis (*filter bar*) teras: Carian teks dinamik, dropdown *Status*, *Bank*, *Year*, dan *Category*.
- Operasi CRUD Penuh (Tambah, Kemaskini, Lihat Butiran, Padam).
- Pengurusan automatik *Hold Reason* dan *Decline Reason*.
- Jadual data responsif 100% lebar skrin (*density 6*) tanpa *horizontal scroll* pada zoom 100%.

### 🏢 Modul 3: Companies (Pengurusan Syarikat)
- Grid kad syarikat (*Company Cards Grid*) memaparkan avatar logo awal syarikat, lencana peratusan kelulusan, dan statistik jumlah dipohon vs diluluskan.
- Interaksi penapis klik terus ke senarai aplikasi syarikat berkaitan.

### 🏦 Modul 4: Banks & BFR (Bank & Kadar BFR)
- Pengurusan kadar Base Financing Rate (BFR) semasa dan terdahulu mengikut bank partner.
- Carta ECharts bersebelahan: *BFR Comparison Rate* & *Bank Success Rate*.
- Jadual pengurusan CRUD Bank.

### 📈 Modul 5: Reports & Analytics (Laporan & Analitik)
- Kad ringkasan kewangan eksekutif (*Total Apps*, *Total Requested*, *Total Approved*, *Overall Approval Rate %*).
- Carta trend aplikasi mengikut tahun & pecahan jenis fasiliti.
- **Eksport CSV**: Muat turun keseluruhan data permohonan dalam bentuk CSV.
- **Eksport Laporan PDF**: Penjanaan laporan cetakan PDF eksekutif gred B2B (*tasteskill.dev White Corporate format*) dengan susunan yang bersih dan profesional.

### 👔 Modul 6: Boss Review (Ulasan Pengurusan / Cadangan)
- Kad ulasan cadangan pembiayaan bank yang memerlukan penilaian & keputusan pihak pengurusan tinggi.
- Butang tindakan keputusan pantas (*Approve*, *Reject*, *Edit*, *Delete*).
- Borang cadangan merangkumi *Loan Limit*, *Profit Rate*, *Tenure*, *Collateral*, *Takaful*, *Legal Fee*, dan *Total Offered*.

### ⚙️ Modul 7: Settings & RBAC (Tetapan & Kawalan Akses)
- **Profil Pengguna**: Paparan akaun pengguna semasa & butang log keluar.
- **User Account Management**: Kawalan peranan (*Role Switching*) antara `super_admin` dan `staff`.
- **Page Access Control**: Kawalan akses halaman untuk peranan *staff*.
- **Dashboard Chart Visibility**: Kawalan paparan carta dashboard untuk peranan *staff*.

---

## 🔒 3. Pangkalan Data & Keselamatan (Supabase Schema)

1. `applications`: Menyimpan maklumat permohonan (syarikat, bank, kategori, amaun dipohon/diluluskan, status, *hold_reason*, *decline_reason*, dsb.).
2. `banks`: Menyimpan maklumat bank partner & kadar BFR semasa/terdahulu.
3. `bos_review`: Menyimpan cadangan pembiayaan untuk kelulusan pihak pengurusan.
4. `profiles`: Menyimpan peranan pengguna (`super_admin` / `staff`).
5. `page_permissions`: Menyimpan kebenaran akses modul untuk peranan *staff*.
6. `chart_visibility`: Menyimpan kebenaran paparan carta untuk peranan *staff*.

---

## 🧪 4. Keputusan Ujian Automatik (Playwright E2E)

Kesemua 8 senario ujian automatik End-to-End telah disahkan lulus 100%:

```bash
  ✓ Test Case 1: Authentication Failures & UI
  ✓ Test Case 2: Successful Login & Dashboard KPI Check
  ✓ Test Case 3: Navigation via Sidebar
  ✓ Test Case 4: Applications CRUD Operations
  ✓ Test Case 5: Banks & BFR Update
  ✓ Test Case 6: Bos Review Flow
  ✓ Test Case 7: RBAC Configuration (Super Admin view)
  ✓ Test Case 8: RBAC Verification (Staff view and limits)

  8 passed (33.9s)
```

---

## 🎨 5. Sistem Reka Bentuk (Design System Highlights)

- **White Corporate Aesthetics**: Mengaplikasikan kemahiran `design-taste-frontend` (`tasteskill.dev`) untuk penampilan B2B yang bersih, moden, dan profesional.
- **Tipografi Tabular**: Menggunakan fon monospaced (`JetBrains Mono`) untuk angka mata wang (`RM`), peratusan, dan kaunter supaya saiz data kekal tersusun.
- **Lencana Status Pastel**: Lencana bermaklumat berserta *status dot* (`.badge-dot`) berwarna hijau (*Done*), biru (*In Progress*), kuning (*Hold/Pending*), dan merah (*Declined*).
