# 📁 KaKeFa Facilities Dashboard — Master Document
> **Versi:** 1.0 Final &nbsp;|&nbsp; **Tarikh:** 1 Julai 2026  
> **Disediakan oleh:** Syakir (Developer / Super Admin)  
> **Untuk:** Unit Kemudahan Kewangan

---

# BAHAGIAN 1 — DOKUMENTASI DATA (ANALISIS EXCEL)

---

## 1.1 Latar Belakang

Fail `SUMMARY FACILITIES - LATEST.xlsm` adalah sistem tracking manual yang digunakan oleh unit ini untuk memantau semua permohonan kemudahan kewangan (bank financing) bagi syarikat-syarikat klien di bawah kendalian unit.

**Masalah semasa:**
- ❌ Data tersebar dalam banyak sheet, sukar diinterpretasi secara menyeluruh
- ❌ Tiada visualisasi / carta yang dinamik untuk pengurusan
- ❌ Formula `#REF!` menyebabkan beberapa nilai tidak tepat
- ❌ Data tidak boleh diakses dari luar komputer yang menyimpan fail
- ❌ Risiko kehilangan data (fail rosak, terlupa save, dll.)

**Penyelesaian:** Sistem web KaKeFa Facilities Dashboard

---

## 1.2 Struktur Fail Excel — 8 Sheet

| # | Nama Sheet | Fungsi | Bilangan Rekod |
|---|-----------|--------|---------------|
| 1 | **DASHBOARD** | Papan pemuka ringkasan (formula) | — |
| 2 | **DATABASE property** | Kemudahan berasaskan hartanah | ~32 rekod |
| 3 | **DONE** | Permohonan diluluskan & dicairkan | ~11 rekod |
| 4 | **PENDING** | Permohonan dalam proses / tertangguh | ~8 rekod |
| 5 | **TO REVIEW BY BOS** | Cadangan kemudahan perlu kelulusan bos | 2 kemudahan |
| 6 | **DECLINED** | Permohonan ditolak bank atau syarikat | ~27 rekod |
| 7 | **ENGINE** | Kadar BFR semua bank Malaysia | 20 bank |
| 8 | **ASSET** | Kemudahan berasaskan aset | 2 rekod |

---

## 1.3 Kolum Data (Struktur Utama)

Hampir semua sheet DONE, PENDING, DECLINED, DATABASE property berkongsi struktur kolum yang sama:

| Kolum | Penerangan | Contoh Nilai |
|-------|-----------|-------------|
| COMPANIES | Nama syarikat pemohon | MUAZ FORCE SDN BHD |
| YEAR OF APPLICATION | Tahun permohonan | 2022, 2024, 2026 |
| BANK | Bank yang memproses | Maybank, Affin Bank |
| BFR | Base Financing Rate bank | 6.40%, 6.56% |
| PROPERTY | Butiran hartanah (property sheet sahaja) | Shoplot Setapak RM 3.5J |
| TYPE OF FACILITY | Jenis kemudahan | TERM LOAN, OVERDRAFT, LETTER OF CREDIT |
| NAME OF FACILITY | Nama produk bank | CM Cash Line-i, PEMULIH GGS |
| COLLATERAL | Cagaran yang disediakan | 80% SJPP, 20% FD |
| PROFIT RATE | Kadar keuntungan / faedah | BFR + 1%, 3.75% |
| RATE/TENURE | Tempoh bayaran balik | 7 YEARS, MONTHLY / 5 YEARS |
| APPLICATION STATUS | Status semasa | DONE, IN PROGRESS, DECLINED, ON HOLD |
| APPLICATION DETAILS | Huraian status terkini | DISBURSED & READY TO USE |
| PROGRESS | Peratusan kemajuan | 10%, 50%, 100% |
| DATE DOCUMENT SEND | Tarikh dokumen dihantar ke bank | 09.06.2024 |
| DATE TO FOLLOW UP | Tarikh untuk follow up | — |
| DATE UPDATED | Tarikh rekod dikemaskini | 30.06.2026 |
| TOTAL REQUESTED (RM) | Jumlah dipohon | RM 2,000,000 |
| TOTAL APPROVED / OFFERED (RM) | Jumlah diluluskan / ditawarkan | RM 500,000 |

---

## 1.4 Status Permohonan & Maknanya

| Status | Maksud |
|--------|--------|
| `IN PROGRESS` | Dokumen sedang diproses di pihak bank |
| `ON HOLD` | Ditangguhkan — menunggu dokumen atau tindakan syarikat |
| `HOLD` | Ditangguhkan — menunggu keputusan / kelulusan bos |
| `PENDING` | Belum dimulakan / menunggu giliran |
| `DONE` | Diluluskan dan wang telah dicairkan |
| `DECLINED` | Ditolak (oleh bank atau syarikat) |
| `DECLINED BY BANK` | Ditolak pihak bank |
| `DECLINED BY COMPANY` | Ditarik balik oleh syarikat |

---

## 1.5 Jenis Kemudahan (Type of Facility)

| Jenis | Penerangan |
|-------|-----------|
| **TERM LOAN** | Pinjaman berjangka tetap, bayaran bulanan tetap |
| **OVERDRAFT (OD)** | Kemudahan kredit berputar, bayar balik bila ada dana |
| **LETTER OF CREDIT (LC)** | Kemudahan kredit perdagangan |
| **CAPITAL FINANCING / WCF** | Pembiayaan modal kerja |
| **ASSET FINANCING** | Pembiayaan pembelian aset (kenderaan, mesin) |
| **COLLABORATIVE FINANCING** | Program bersama SME Corp / Teraju |
| **TARGETED RELIEF & RECOVERY** | Program TRRF — bantuan pasca-COVID |

---

## 1.6 Sebab Penolakan (Decline Reasons)

| Sebab | Kekerapan |
|-------|-----------|
| RUN OUT OF FUND | Tinggi — dana program bank habis |
| DIDN'T PASS SCORING | Tidak lulus pemarkahan kredit |
| TAX FLYING ACTIVITIES | Isu cukai syarikat |
| NEGATIVE OBITDA / DSR | Kapasiti bayaran balik negatif |
| PROBLEM WITH DIRECTORS' CCRIS | Rekod kredit pengarah bermasalah |
| CONDUCT OF ACCOUNT X CANTIK | Kelakuan akaun tidak memuaskan |
| COLLATERAL USING SINKING FUND | Syarikat tolak terma cagaran |
| MANAGEMENT TURNOVER | Masalah pengurusan syarikat |

---

## 1.7 Senarai Syarikat Klien (~25 syarikat)

| Syarikat | Sektor |
|----------|--------|
| MUAZ FORCE SDN BHD | Keselamatan |
| MUAZ MAJU SDN BHD | Pelbagai |
| MUAZ MAJU ENTERPRISE | Perdagangan |
| MUAZ SERVICES | Perkhidmatan |
| AFRA SERVICES SDN BHD | Perkhidmatan |
| FIRST ALLIED SECURITY SERVICES SDN BHD | Keselamatan |
| COMMITTED SECURITY SDN BHD | Keselamatan |
| COMMITTED FIREARMS SDN BHD | Senjata Api |
| NELANG SECURITY SDN BHD | Keselamatan |
| PATRIOT PROTECTION & SECURITY SDN BHD | Keselamatan |
| TOUGH SECURITY SDN BHD | Keselamatan |
| ATLAS MOTIONS SDN BHD | Automotif |
| MSA SINAR ENTERPRISE | Perdagangan |
| GOLDEN IZZ ENTERPRISE | Perdagangan |
| SYAZA TRADING | Perdagangan |
| SULIMI | Perkhidmatan |
| AL BASSYASYAH ENTERPRISE | Perdagangan |
| ALRAZIA ENTERPRISE | Perdagangan |
| HERNEYNA ENTERPRISE | Perdagangan |
| NAFZA BAKTI ENTERPRISE | Perdagangan |
| BLUEPEARL ASM RESOURCES | Sumber |
| IRLY ENTERPRISE | Perdagangan |
| IZHORA KLADER TRADING | Perdagangan |
| RAZIA GLOBAL RESOURCES | Sumber |
| AA BERKAT MAJU ENTERPRISE | Perdagangan |

---

## 1.8 Bank yang Terlibat

| Bank | BFR Jul 2025 |
|------|-------------|
| BSN | 6.35% |
| Maybank | 6.40% |
| Alliance Bank | 6.42% |
| RHB Bank | 6.45% |
| Standard Chartered | 6.45% |
| AmBank | 6.45% |
| Bank Islam | 6.47% |
| Public Bank (PBB) | 6.47% |
| HSBC Bank | 6.49% |
| Agro Bank | 6.50% |
| MBSB Bank | 6.50% |
| OCBC Bank | 6.51% |
| Citibank | 6.55% |
| Affin Bank | 6.56% |
| Bank Muamalat | 6.56% |
| UOB Bank | 6.57% |
| Bank Rakyat | 6.58% |
| CIMB Bank | 6.60% |
| Hong Leong Bank | 6.64% |
| SME Bank | 6.75% |

> Semua bank telah turunkan BFR sebanyak **-0.25%** dari May 2023 ke Julai 2025.

---

## 1.9 Flow Kerja (Business Process)

```
[Syarikat perlukan pembiayaan]
           │
           ▼
[Unit kenalpasti bank & produk yang sesuai]
           │
           ▼
[Dokumen dikumpul & permohonan disediakan]
           │
           ▼
[Rekod dimasukkan → Status: IN PROGRESS]
           │
     ┌─────┼───────────┐
     ▼     ▼           ▼
  DONE  DECLINED    ON HOLD
(Lulus) (Ditolak) (Tertangguh)
                       │
                  Sebab ditolak:
                  - Bank: RUN OUT OF FUND
                  - Bank: DIDN'T PASS SCORING
                  - Bank: CCRIS / DSR issues
                  - Syarikat: tolak terma
```

---

## 1.10 Rekod Terkini Setiap Kategori

### DONE (Berjaya)
| Syarikat | Bank | Jenis | Dipohon | Diluluskan |
|----------|------|-------|---------|-----------|
| MUAZ FORCE SDN BHD | Standard Chartered | Term Loan | RM 2,000,000 | RM 2,000,000 |
| MUAZ FORCE SDN BHD | Bank Rakyat | Overdraft | RM 3,000,000 | RM 2,000,000 |
| MUAZ FORCE SDN BHD | Bank Rakyat | WCF | RM 2,000,000 | RM 2,000,000 |
| AFRA SERVICES SDN BHD | Bank Rakyat | Overdraft | RM 800,000 | RM 800,000 |
| FIRST ALLIED SECURITY | Bank Rakyat | Overdraft | RM 500,000 | RM 500,000 |
| FIRST ALLIED SECURITY | Maybank | Overdraft | RM 1,000,000 | RM 500,000 |
| NELANG SECURITY SDN BHD | MBSB Bank | Term Loan | RM 800,000 | RM 500,000 |
| MSA SINAR | SME Bank | Term Loan | RM 1,000,000 | RM 200,000 |
| MUAZ MAJU SDN BHD | Affin Bank | Overdraft | RM 5,000,000 | RM 2,500,000 |
| COMMITTED SECURITY SDN BHD | MBSB Bank | Term Loan | — | RM 550,000 |

### PENDING (Dalam Proses)
| Syarikat | Bank | Jenis | Status |
|----------|------|-------|--------|
| COMMITTED FIREARMS | Affin Bank | Letter of Credit | IN PROGRESS |
| COMMITTED FIREARMS | RHB Bank | Letter of Credit | IN PROGRESS |
| AFRA SERVICES | Maybank | Overdraft | IN PROGRESS |
| COMMITTED FIREARMS | Affin Bank | Term Loan | HOLD |
| SULIMI | Affin Bank | Term Loan | HOLD |
| MUAZ SERVICES | Affin Bank | Term Loan | HOLD |

---

---

# BAHAGIAN 2 — IMPLEMENTATION PLAN

---

## 2.1 Tujuan Sistem

Membina sistem web **production** yang menggantikan Excel sebagai alat pengurusan kemudahan kewangan — dengan visualisasi data, CRUD penuh, dan keselamatan data di cloud.

**Pengguna:**
| Peranan | Siapa | Kebenaran |
|---------|-------|-----------|
| **Super Admin** | Syakir (developer) | Semua akses + urus pengguna + backup |
| **Admin** | Ketua Unit | Tambah, edit, padam, kemaskini semua rekod |

---

## 2.2 Keputusan Teknikal (Final ✅)

| Aspek | Keputusan | Sebab |
|-------|-----------|-------|
| **Frontend** | HTML + CSS + Vanilla JavaScript | Tiada build step, mudah maintain, cepat load |
| **Charts** | **Apache ECharts** (CDN) | Modern, powerful, animated, free, enterprise-grade |
| **Database** | **Supabase** (PostgreSQL cloud) | **FREE**, fully managed, no server needed, real-time |
| **Auth / Login** | **Supabase Auth** | Built-in, secure, email + password |
| **Hosting** | **Netlify** (free) | Static site hosting, percuma, mudah deploy |
| **Bahasa UI** | **English** sepenuhnya | Keputusan pengguna |
| **Offline** | Tidak diperlukan | Internet pejabat sentiasa ada |
| **Backup** | Export CSV dari Supabase (built-in) | Supabase ada built-in table export |

> [!NOTE]
> **Kenapa ECharts dan bukan Chart.js?** Apache ECharts adalah chart library enterprise-grade yang digunakan oleh syarikat besar. Visual lebih moden, animation lebih smooth, dan lebih powerful untuk data-dense dashboard. 100% free, no license required.

---

## 2.3 Seni Bina Sistem

```
┌──────────────────────────────────────────────────────────────┐
│                  NETLIFY (hosting)                           │
│                                                             │
│   index.html  ──►  CSS / JS  ──►  ECharts (CDN)            │
│                              │                              │
│                              │ Supabase JS Client (CDN)     │
└──────────────────────────────┼──────────────────────────────┘
                               │ HTTPS API calls
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                  SUPABASE (backend - FREE)                   │
│                                                             │
│   Auth (Login)  ──►  Row Level Security  ──►  Database      │
│                                                             │
│   Tables: applications │ banks │ bos_review │ users         │
└──────────────────────────────────────────────────────────────┘
```

### Cara Kerja
1. **Kau & Ketua Unit** login ke custom web app (Netlify)
2. **Supabase Auth** verify credentials, return JWT token
3. **JS** fetch data dari Supabase REST API guna token
4. **ECharts** render charts dari data yang difetch
5. **RLS** pastikan hanya authenticated users boleh akses data


---

## 2.4 Skema Database (Supabase / PostgreSQL)

### Jadual `applications`
```sql
CREATE TABLE applications (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category         TEXT NOT NULL,       -- 'COMPANY' | 'PROPERTY' | 'ASSET'
  company          TEXT NOT NULL,
  year_application INTEGER,
  bank             TEXT,
  bfr              TEXT,
  property_detail  TEXT,               -- hanya untuk kategori PROPERTY
  type_facility    TEXT,
  name_facility    TEXT,
  collateral       TEXT,
  profit_rate      TEXT,
  rate_tenure      TEXT,
  status           TEXT NOT NULL,      -- DONE | IN PROGRESS | DECLINED | ON HOLD | HOLD | PENDING
  app_details      TEXT,
  progress         INTEGER DEFAULT 0, -- 0 - 100
  date_doc_sent    DATE,
  date_followup    DATE,
  date_updated     DATE,
  total_requested  NUMERIC DEFAULT 0,
  total_approved   NUMERIC DEFAULT 0,
  decline_reason   TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

### Jadual `banks`
```sql
CREATE TABLE banks (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE,
  bfr_current  NUMERIC,    -- BFR semasa (Jul 2025)
  bfr_previous NUMERIC,    -- BFR sebelum (May 2023)
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Jadual `bos_review`
```sql
CREATE TABLE bos_review (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bank_name      TEXT,
  type_facility  TEXT,
  name_facility  TEXT,
  loan_limit     TEXT,
  profit_rate    TEXT,
  tenure         TEXT,
  collateral     TEXT,
  takaful        TEXT,
  legal_fee      TEXT,
  total_offered  NUMERIC DEFAULT 0,
  status         TEXT DEFAULT 'PENDING REVIEW',
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)
```sql
-- Hanya pengguna yang log in boleh baca/tulis
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bos_review ENABLE ROW LEVEL SECURITY;

-- Policy: authenticated users sahaja
CREATE POLICY "Authenticated users only" ON applications
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## 2.5 Struktur Folder Projek

```
project_kakefa/
├── index.html              ← Entry point
├── css/
│   └── style.css           ← Design system + semua styles
├── js/
│   ├── supabase.js         ← Supabase client + helper functions
│   ├── auth.js             ← Login, logout, session management
│   ├── data.js             ← CRUD functions (applications, banks, bos)
│   ├── charts.js           ← Semua chart logic (ECharts)
│   ├── ui.js               ← DOM manipulation, modal, toast, filters
│   └── app.js              ← Main app logic + page routing
├── pages/
│   ├── login.html          ← Halaman login
│   (atau semua dalam index.html sebagai SPA)
└── SUMMARY FACILITIES - LATEST.xlsm  ← Fail asal (untuk rujukan)
```

---

## 2.6 Modul & Halaman Sistem

### 🔐 Login Page
- Form email + password
- Error message bila salah password
- Auto redirect ke dashboard bila dah login
- Session kekal (tidak perlu login semula bila reload)

### 🏠 Dashboard
- **6 KPI Cards:** Total Applications, Done, In Progress, Declined, Total Requested (RM), Total Approved (RM)
- **Chart 1:** Donut — Pecahan status semua permohonan
- **Chart 2:** Bar — Bilangan permohonan mengikut bank
- **Chart 3:** Horizontal Bar — Jumlah RM dipohon vs diluluskan (top 10 syarikat)
- **Chart 4:** Bar — Sebab penolakan (Decline Reasons)
- **Table:** 10 permohonan terkini (nama syarikat, bank, status, kemajuan)

### 📋 Applications (Permohonan)
- Table semua rekod dengan pagination
- Search (nama syarikat / bank)
- Filter: Status | Bank | Year | Category (Company/Property/Asset)
- Tambah permohonan baru (modal form)
- Edit permohonan (modal form pre-filled)
- Padam dengan dialog konfirmasi
- Progress bar visual setiap rekod

### 🏢 Companies (Syarikat)
- Grid kad semua syarikat
- Setiap kad: nama, bilangan Done / Pending / Declined
- Klik kad → filtered view semua permohonan syarikat tersebut

### 🏦 Banks & BFR
- Jadual 20 bank dengan BFR semasa vs sebelumnya
- Bar chart perbandingan BFR (tertinggi ke terendah)
- Edit BFR bila kadar berubah (admin sahaja)

### 📊 Reports (Laporan)
- Chart: Trend permohonan mengikut tahun (2022–2026)
- Chart: Pecahan jenis kemudahan (Term Loan, OD, LC, dll.)
- Chart: Success rate mengikut bank (%)
- Table: Ringkasan bank — dipohon vs diluluskan

### ✅ Bos Review (Semakan Bos)
- Kad setiap cadangan kemudahan bank
- Butiran lengkap: jenis, kadar, tenure, cagaran, takaful, fee
- Status review: Pending / Approved / Rejected

### ⚙️ Settings (Super Admin sahaja)
- Export semua data ke CSV
- Manage user accounts
- Lihat log aktiviti

---

## 2.7 UI / UX Design

| Aspek | Keputusan |
|-------|-----------|
| **Tema** | ☀️ **WHITE CORPORATE** — putih bersih, profesional, sesuai untuk corporate/government unit |
| **Warna utama** | White `#FFFFFF` + Blue `#2563EB` (Tailwind blue-600) |
| **Status colours** | Hijau (Done), Biru (Progress), Kuning (Hold), Merah (Declined) |
| **Font** | Inter (Google Fonts) |
| **Animasi** | Minimal — subtle transitions sahaja (MOTION_INTENSITY: 3) |
| **Responsive** | Desktop-first, tapi responsive hingga mobile |


---

---

# BAHAGIAN 3 — JADUAL HARIAN (18 HARI)

**Mula:** 1 Julai 2026 &nbsp;|&nbsp; **Tamat:** 21 Julai 2026

---

## Gambaran Keseluruhan Fasa

```
Hari  1 – 2  │ 🔍 R&D & Planning
Hari  3      │ 🛠️  Technical Setup (Supabase + Node.js + Projek)
Hari  4 – 5  │ 🎨  UI Foundation (Layout + Design System)
Hari  6 – 8  │ 📊  Dashboard
Hari  9 – 11 │ ⚙️  CRUD Permohonan
Hari 12 – 14 │ 📋  Modul Tambahan
Hari 15 – 16 │ ✨  Polish & UI Refinement
Hari 17      │ 🧪  Testing
Hari 18      │ 🚀  Deploy & Handover
```

---

## Hari 1 — 1 Julai 2026 (Rabu)
**Fokus: Analisis Data & Dokumentasi**

- [x] Baca dan analisis fail `SUMMARY FACILITIES - LATEST.xlsm`
- [x] Kenalpasti semua 8 sheet dan fungsi masing-masing
- [x] Catat semua kolum data, status, jenis kemudahan
- [x] Dokumentasikan senarai syarikat dan bank
- [x] Dokumentasi analisis Excel lengkap

**✅ Output: Dokumentasi analisis Excel siap**

---

## Hari 2 — 2 Julai 2026 (Khamis)
**Fokus: Perancangan Sistem**

- [x] Tentukan requirement sistem (tanya soalan kepada pengguna)
- [x] Tentukan tech stack (Vanilla JS + Supabase + Netlify)
- [x] Tentukan user roles (Super Admin + Admin)
- [x] Tentukan struktur database (skema Supabase)
- [x] Tentukan modul dan halaman sistem
- [x] Buat jadual harian 18 hari
- [x] Buat dokumen master ini

**✅ Output: Implementation plan + jadual harian + dokumen master siap**

---

## Hari 3 — 3 Julai 2026 (Jumaat)
**Fokus: Technical Setup**

**Tugasan untuk kau (manual):**
- [ ] Install Node.js — double-click `node-v22.16.0-x64.msi` di Downloads
- [x] Buat akaun Supabase di [supabase.com](https://supabase.com)
- [x] Buat projek baru: nama `kakefa-facilities`, region Singapore
- [x] Simpan Project URL + Anon Public Key

**Tugasan kita buat bersama:**
- [x] Buat semua jadual database di Supabase (SQL Editor)
- [x] Setup Row Level Security (RLS)
- [x] Seed data awal: 20 bank BFR
- [ ] Buat akaun Admin (ketua unit) di Supabase Auth — **buat manual di Supabase Auth > Users > Invite user**
- [x] Setup struktur folder projek
- [x] Buat `index.html` dan `js/supabase.js` asas
- [ ] Test koneksi ke Supabase berjaya

**✅ Output: Database siap, koneksi berfungsi**

> [!IMPORTANT]
> **Cara guna `setup_database.sql`:**
> 1. Buka [Supabase Dashboard](https://supabase.com) → Projek `kakefa-facilities`
> 2. Pergi ke **SQL Editor**
> 3. Buka file `setup_database.sql` dalam folder projek
> 4. Paste semua SQL → klik **Run**
> 5. Lepas tu pergi ke **Authentication > Users** → klik **Invite user** untuk buat akaun Admin

---

## Hari 4 — 6 Julai 2026 (Ahad)
**Fokus: Design System & Layout**

- [x] Buat `css/style.css` — design tokens LENGKAP (851 baris): variables, sidebar, topbar, cards, KPI, badges, tables, buttons, forms, modal, toast, progress bar, filters, company grid, responsive media queries ✅
- [x] Bina komponen Sidebar dengan semua nav links (dalam `js/app.js` renderShell)
- [x] Bina komponen Topbar (dalam `js/app.js` renderShell)
- [x] Setup page routing (hash-based, SPA style)
- [x] Bina halaman Login (form email + password) — DONE Hari 3
- [x] Integrate Supabase Auth — login/logout berfungsi — DONE Hari 3
- [x] Redirect ke Dashboard bila dah login — DONE Hari 3

**✅ Output: Layout utama + Login berfungsi ✅**

---

## Hari 5 — 7 Julai 2026 (Isnin)
**Fokus: Data Layer & Seed Data**

- [x] Buat `js/data.js` — semua CRUD functions (fetch, insert, update, delete)
- [x] Seed semua ~80 rekod dari Excel ke Supabase (batch insert via `setup_database.sql`)
  - [x] DONE: ~11 rekod
  - [x] PENDING: ~8 rekod
  - [x] DECLINED: ~27 rekod
  - [x] DATABASE property: ~32 rekod
  - [x] ASSET: 2 rekod
  - [x] BOS REVIEW: 2 rekod
- [ ] Test: semua data boleh di-fetch dengan betul — **lepas run SQL**
- [ ] Test: RLS berfungsi (hanya user login boleh akses) — **lepas run SQL**

**✅ Output: Semua data Excel ada dalam Supabase, fungsi CRUD asas berjalan**

> [!NOTE]
> Hari ni yang paling kritikal — backbone data. Luangkan masa masuk data dengan teliti.

---

## Hari 6 — 8 Julai 2026 (Selasa)
**Fokus: Dashboard — KPI Cards**

- [ ] Bina halaman Dashboard HTML structure
- [ ] Bina komponen KPI Card (reusable)
- [ ] Fetch data dari Supabase dan kira:
  - Total permohonan
  - Bilangan DONE, IN PROGRESS, DECLINED
  - Jumlah RM dipohon (total_requested)
  - Jumlah RM diluluskan (total_approved)
- [ ] Papar dalam 6 KPI cards dengan animasi counter
- [ ] Bina "Recent Applications" table (10 rekod terkini)

**✅ Output: Dashboard KPI Cards berfungsi dengan data sebenar**

---

## Hari 7 — 9 Julai 2026 (Rabu)
**Fokus: Dashboard — Chart Utama**

- [ ] Integrate Apache ECharts (CDN)
- [ ] Buat `js/charts.js`
- [ ] Chart 1: Donut — pecahan status (Done / In Progress / Declined / Hold)
- [ ] Chart 2: Bar — bilangan permohonan mengikut bank (sorted)
- [ ] Tooltip custom untuk setiap chart
- [ ] Warna chart konsisten dengan design system

**✅ Output: 2 chart utama siap dan interaktif**

---

## Hari 8 — 10 Julai 2026 (Khamis)
**Fokus: Dashboard — Chart Tambahan & Polish**

- [ ] Chart 3: Horizontal Bar — RM dipohon vs diluluskan (top 10 syarikat)
- [ ] Chart 4: Bar — Sebab penolakan (Decline Reasons — group & count)
- [ ] Polish keseluruhan Dashboard — spacing, warna, responsiveness
- [ ] Pastikan semua data update bila ada perubahan

**✅ MILESTONE 1: Dashboard lengkap dan cantik**

---

## Hari 9 — 11 Julai 2026 (Jumaat)
**Fokus: Buffer / Catch-Up**

- [ ] Semak semula semua chart — data betul?
- [ ] Betulkan sebarang bug atau isu UI di Dashboard
- [ ] Test di browser lain (Edge, Firefox)
- [ ] Dokumentasi ringkas apa yang dah siap

> [!TIP]
> Kalau Dashboard dah 100% siap, gunakan hari ini untuk mula halaman Applications.

---

## Hari 10 — 13 Julai 2026 (Isnin)
**Fokus: Halaman Applications — Table & Tambah**

- [ ] Bina halaman Applications — table semua rekod
- [ ] Columns: No, Syarikat, Tahun, Bank, Jenis, Nama Kemudahan, RM Dipohon, Status, Progress, Actions
- [ ] Bina modal form — Tambah Permohonan Baru (semua field)
- [ ] Simpan ke Supabase → refresh table
- [ ] Toast notification bila berjaya simpan

**✅ Output: Boleh tambah permohonan baru**

---

## Hari 11 — 14 Julai 2026 (Selasa)
**Fokus: Edit, Padam & Filter**

- [ ] Fungsi Edit — modal form pre-filled dengan data sedia ada
- [ ] Fungsi Padam — dialog konfirmasi sebelum delete
- [ ] Search bar — cari mengikut nama syarikat atau bank
- [ ] Filter dropdown: Status | Bank | Year | Category
- [ ] KPI Dashboard auto-update bila data berubah

**✅ Output: CRUD lengkap + carian/filter berfungsi**

---

## Hari 12 — 15 Julai 2026 (Rabu)
**Fokus: Halaman Companies & Banks**

- [ ] Halaman Companies — grid kad semua syarikat
- [ ] Setiap kad: nama, avatar initials, stat Done/Pending/Declined
- [ ] Klik kad → filtered view permohonan syarikat itu
- [ ] Halaman Banks & BFR — jadual 20 bank
- [ ] Bar chart perbandingan BFR
- [ ] Fungsi edit BFR (untuk Super Admin)

**✅ MILESTONE 2: Companies + Banks siap**

---

## Hari 13 — 16 Julai 2026 (Khamis)
**Fokus: Halaman Reports**

- [ ] Chart: Trend permohonan mengikut tahun (line/bar chart)
- [ ] Chart: Pecahan jenis kemudahan (donut)
- [ ] Chart: Success rate mengikut bank (%)
- [ ] Table: Ringkasan mengikut bank — total dipohon, diluluskan, % berjaya

**✅ Output: Halaman Reports siap**

---

## Hari 14 — 17 Julai 2026 (Jumaat)
**Fokus: Bos Review & Export**

- [ ] Halaman Bos Review — kad setiap cadangan kemudahan
- [ ] Butiran: jenis, limit, kadar, tenure, cagaran, takaful, legal fee
- [ ] Export data ke CSV (semua rekod atau filtered)
- [ ] Halaman Settings (Super Admin) — manage users

**✅ MILESTONE 3: Semua modul siap**

---

## Hari 15 — 18 Julai 2026 (Sabtu)
**Fokus: Buffer / Catch-Up**

- [ ] Selesaikan apa-apa yang belum siap dari hari 10–14
- [ ] Betulkan semua bug yang dijumpai
- [ ] Pastikan semua halaman boleh buka tanpa error
- [ ] Cross-check data dalam sistem vs Excel asal

---

## Hari 16 — 19 Julai 2026 (Ahad)
**Fokus: UI Polish & Micro-animations**

- [ ] Semak konsistensi warna status badge di semua halaman
- [ ] Tambah hover effects pada kad dan butang
- [ ] Tambah page transition animation (fade in)
- [ ] Pastikan empty states informatif (bila tiada data)
- [ ] Polish mobile responsiveness
- [ ] Semak typography dan spacing keseluruhan

**✅ Output: UI premium dan polished**

---

## Hari 17 — 20 Julai 2026 (Isnin)
**Fokus: Testing Menyeluruh**

- [ ] Test Login / Logout
- [ ] Test tambah, edit, padam setiap jenis rekod
- [ ] Test semua filter dan carian
- [ ] Test semua chart — data betul?
- [ ] Test export CSV
- [ ] Test di Chrome, Edge, Firefox
- [ ] Test di saiz mobile (375px) dan tablet (768px)
- [ ] Test dengan data edge case (nilai kosong, nilai besar)
- [ ] Fix semua bug

**✅ Output: Sistem bebas bug, sedia deploy**

---

## Hari 18 — 21 Julai 2026 (Selasa)
**Fokus: Deployment & Handover**

- [ ] Upload projek ke Netlify (drag & drop folder)
- [ ] Test sistem di URL Netlify yang diberikan
- [ ] Pastikan Supabase RLS berfungsi di production
- [ ] Buat akaun Admin untuk ketua unit
- [ ] Tulis panduan pengguna ringkas (cara login, tambah rekod, dll.)
- [ ] Serah sistem kepada ketua unit
- [ ] Buat demo ringkas cara guna sistem

**🎉 Output: Sistem LIVE di Netlify — Projek Selesai!**

---

## Ringkasan Mingguan

| Minggu | Tarikh | Fokus Utama | Milestone |
|--------|--------|-------------|-----------|
| **Minggu 1** | 1–5 Jul | R&D + Setup Teknikal + UI Foundation | Projek berjalan, login berfungsi |
| **Minggu 2** | 6–12 Jul | Dashboard + CRUD + Companies + Banks | Dashboard siap ✅, CRUD siap ✅, Companies+Banks siap ✅ |
| **Minggu 3** | 13–21 Jul | Reports + Polish + Testing + Deploy | Reports siap ✅, Bos Review siap ✅, Settings siap ✅ |

---

## Peraturan Kerja

1. **Satu hari, satu fokus** — jangan cuba buat banyak benda sekaligus
2. **Commit selepas setiap hari** — walaupun code belum sempurna
3. **Test selepas setiap fungsi baru** — jangan tunggu akhir baru test
4. **Data kritikal** — sentiasa verify data dalam sistem sama dengan Excel
5. **Jangan show kepada ketua unit** sebelum Hari 18 — tunjuk bila dah siap sepenuhnya

---

*Dokumen ini disediakan pada 1 Julai 2026. Kemaskini bila ada perubahan.*
