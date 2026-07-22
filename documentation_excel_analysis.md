# 📊 Dokumentasi Analisis Fail Excel — SUMMARY FACILITIES

> **Fail:** `SUMMARY FACILITIES - LATEST.xlsm`  
> **Tujuan:** Memahami struktur data dan flow kerja untuk dijadikan asas pembangunan sistem visualisasi

---

## 1. Gambaran Keseluruhan (Overview)

Fail Excel ini adalah **sistem pengurusan kemudahan kewangan (Facilities Management)** yang digunakan oleh unit ini untuk menjejaki semua permohonan pinjaman/kemudahan bank bagi syarikat-syarikat di bawah kendalian mereka.

Fail ini mengandungi **8 sheet** yang berfungsi seperti berikut:

| # | Nama Sheet | Fungsi |
|---|-----------|--------|
| 1 | **DASHBOARD** | Papan pemuka ringkasan status semua permohonan |
| 2 | **DATABASE property** | Rekod permohonan kemudahan berasaskan *hartanah (property)* |
| 3 | **DONE** | Rekod permohonan yang telah **berjaya diluluskan & dicairkan** |
| 4 | **PENDING** | Rekod permohonan yang masih **dalam proses / tertangguh** |
| 5 | **TO REVIEW BY BOS** | Cadangan kemudahan dari bank yang perlu **kelulusan bos** |
| 6 | **DECLINED** | Rekod permohonan yang telah **ditolak** (oleh bank atau syarikat) |
| 7 | **ENGINE** | Jadual kadar BFR (Base Financing Rate) semua bank di Malaysia |
| 8 | **ASSET** | Rekod permohonan kemudahan berasaskan *aset* |

---

## 2. Struktur Data Setiap Sheet

### 🟢 Sheet: DONE (Kemudahan Diluluskan)
**Tarikh kemaskini:** 30.06.2026

**Kolum data:**
| Kolum | Keterangan |
|-------|-----------|
| COMPANIES | Nama syarikat pemohon |
| YEAR OF APPLICATION | Tahun permohonan |
| BANK | Bank yang memproses permohonan |
| BFR | Base Financing Rate bank berkenaan |
| TYPE OF FACILITY | Jenis kemudahan (Term Loan, Overdraft, Capital Financing) |
| NAME OF FACILITY | Nama produk kemudahan (contoh: PEMULIH GGS, CM Cash Line-i) |
| COLLATERAL | Cagaran yang disediakan (FD, SJPP, Sinking Fund) |
| PROFIT RATE | Kadar keuntungan / faedah |
| RATE/TENURE | Kadar & tempoh bayaran balik |
| APPLICATION STATUS | Status: **DONE / DECLINED** |
| APPLICATION DETAILS | Keterangan terperinci status |
| PROGRESS | Peratusan kemajuan (%) |
| DATE DOCUMENT SEND | Tarikh dokumen dihantar |
| DATE TO FOLLOW UP | Tarikh susulan |
| DATE UPDATED | Tarikh kemaskini |
| TOTAL REQUESTED (RM) | Jumlah yang dipohon |
| TOTAL APPROVED (RM) | Jumlah yang diluluskan |

**Rekod selesai (contoh data):**
- MUAZ FORCE SDN BHD → Standard Chartered → Term Loan PEMULIH → RM 2,000,000 diluluskan
- MUAZ FORCE SDN BHD → Bank Rakyat → Overdraft RM 2,000,000 diluluskan (RM 3,000,000 dipohon)
- MUAZ FORCE SDN BHD → Bank Rakyat → WCF RM 2,000,000 diluluskan
- AFRA SERVICES SDN BHD → Bank Rakyat → OD RM 800,000 diluluskan
- FIRST ALLIED SECURITY SERVICES → Bank Rakyat → OD RM 500,000 diluluskan
- FIRST ALLIED SECURITY SERVICES → Maybank → OD RM 500,000 diluluskan (RM 1,000,000 dipohon)
- NELANG SECURITY SDN BHD → MBSB Bank → Term Loan RM 500,000 diluluskan (RM 800,000 dipohon)
- MSA SINAR → SME Bank → Term Loan RM 200,000 diluluskan (RM 1,000,000 dipohon)
- MUAZ MAJU SDN BHD → Affin Bank → OD RM 2,500,000 diluluskan (RM 5,000,000 dipohon)
- COMMITTED SECURITY SDN BHD → MBSB Bank → Term Loan RM 550,000 diluluskan

---

### 🟡 Sheet: PENDING (Dalam Proses)
**Tarikh kemaskini:** 17.11.2025

**Kolum data** (sama dengan DONE + tambahan TOTAL OFFERED):
- Sama seperti DONE tetapi kolum terakhir adalah **TOTAL OFFERED (RM)** bukannya TOTAL APPROVED

**Status yang wujud:**
- `IN PROGRESS` — Dokumen sedang diproses
- `HOLD` — Ditangguhkan (menunggu keputusan bos)

**Rekod dalam proses (contoh data):**
- COMMITTED FIREARMS SDN BHD → Affin Bank → Letter of Credit RM 5,000,000 (IN PROGRESS)
- COMMITTED FIREARMS SDN BHD → RHB Bank → LC RM 1,000,000 (IN PROGRESS, offered RM 300,000)
- AFRA SERVICES SDN BHD → Maybank → Overdraft (IN PROGRESS)
- COMMITTED FIREARMS → Affin Bank → Term Loan SME SRF RM 750,000 (HOLD)
- SULIMI → Affin Bank → Term Loan SME SRF RM 750,000 (HOLD)
- MUAZ SERVICES → Affin Bank → Term Loan SME SRF RM 750,000 (HOLD)
- **Jumlah dipohon: RM 8,250,000 | Jumlah ditawarkan: RM 300,000**

---

### 🔴 Sheet: DECLINED (Ditolak)
**Tarikh kemaskini:** 16.07.2025

**Status yang wujud:**
- `DECLINED BY BANK` — Ditolak oleh pihak bank
- `DECLINED BY COMPANY` — Ditolak/dibatalkan oleh syarikat sendiri

**Sebab-sebab penolakan (Decline Reasons):**
| Sebab | Kekerapan |
|-------|-----------|
| RUN OUT OF FUND | Tinggi — dana bank habis |
| DIDN'T PASS SCORING | Tidak lulus pemarkahan kredit |
| TAX FLYING ACTIVITIES | Isu cukai |
| NEGATIVE OBITDA / DSR | Kapasiti pembayaran balik negatif |
| PROBLEM WITH DIRECTORS' CCRIS | Isu rekod kredit pengarah |
| CONDUCT OF ACCOUNT X CANTIK | Kelakuan akaun tidak memuaskan (CCRIS) |
| COLLATERAL USING SINKING FUND | Ditolak oleh syarikat (terma cagaran) |

**Rekod ditolak: 27 rekod** (2022-2025)

---

### 🟤 Sheet: DATABASE property (Hartanah)
**Merekod permohonan kemudahan yang melibatkan hartanah sebagai cagaran**

**Kolum tambahan berbanding sheet lain:**
- `PROPERTY` — Butiran hartanah yang dijadikan cagaran (contoh: Shoplot 4 Tingkat Setapak RM 3.5J, Bungalow Cheras RM 4.4J)

**Status dalam sheet ini:**
- `IN PROGRESS` — Masih dalam proses
- `ON HOLD` — Ditangguhkan

**Contoh rekod:**
- MUAZ MAJU SDN BHD → Maybank, Affin Bank → Loan/Overdraft (hartanah Setapak + Cheras)
- Beberapa syarikat (PATRIOT, GOLDEN IZZ, COMMITTED, TOUGH, AFRA) status ON HOLD sejak 2022

---

### 🔵 Sheet: ASSET (Kemudahan Aset)
**Merekod permohonan kemudahan berasaskan aset (bukan hartanah)**

**Contoh rekod:**
- ATLAS MOTIONS SDN BHD → UOB → Asset Gamoda (PENDING, 30%)
- ATLAS MOTIONS SDN BHD → PBB → Asset Gamoda (PENDING, 30%)

---

### 🏦 Sheet: ENGINE (Kadar BFR Bank)
**Jadual kadar BFR (Base Financing Rate) terkini bagi semua bank di Malaysia**
**Tarikh kemaskini:** Julai 2025

| Bank | BFR Jul-25 | BFR May-23 | Perbezaan |
|------|-----------|-----------|-----------|
| BSN | 6.35% | 6.60% | -0.25% |
| Maybank | 6.40% | 6.65% | -0.25% |
| Alliance Bank | 6.42% | 6.67% | -0.25% |
| RHB Bank | 6.45% | 6.70% | -0.25% |
| Standard Chartered | 6.45% | 6.70% | -0.25% |
| AmBank | 6.45% | 6.70% | -0.25% |
| Bank Islam | 6.47% | 6.72% | -0.25% |
| Public Bank | 6.47% | 6.72% | -0.25% |
| HSBC Bank | 6.49% | 6.74% | -0.25% |
| Agro Bank | 6.50% | 6.75% | -0.25% |
| MBSB Bank | 6.50% | 6.75% | -0.25% |
| OCBC Bank | 6.51% | 6.76% | -0.25% |
| Citibank | 6.55% | 6.80% | -0.25% |
| Affin Bank | 6.56% | 6.81% | -0.25% |
| Bank Muamalat | 6.56% | 6.81% | -0.25% |
| UOB Bank | 6.57% | 6.82% | -0.25% |
| Bank Rakyat | 6.58% | 6.83% | -0.25% |
| CIMB Bank | 6.60% | 6.85% | -0.25% |
| Hong Leong Bank | 6.64% | 6.89% | -0.25% |
| SME Bank | 6.75% | 7.00% | -0.25% |

> **Nota:** Semua bank telah turunkan BFR sebanyak -0.25% dari May 2023 ke Jul 2025.

---

### 📋 Sheet: TO REVIEW BY BOS
**Cadangan kemudahan dari Affin Bank yang perlu semakan/kelulusan bos**

**Kemudahan yang dicadangkan:**
1. **Overdraft** — AFFIN Tawarruq Cash Line-i (melebihi RM 500,000, BFR 6.56% + spread 0.5-2.5%)
2. **Term Loan** — AFFIN SME SRF (RM 750,000, kadar tetap 3.75%, 5 tahun, jaminan CGC/SJPP)

---

## 3. Flow Kerja (Business Process Flow)

```
[Syarikat Perlukan Pembiayaan]
         │
         ▼
[Pegawai Unit Kenal Pasti Bank & Produk Sesuai]
         │
         ▼
[Permohonan Disediakan & Dokumen Dikumpul]
         │
         ▼
[Rekod Dimasukkan ke Excel → Sheet PENDING]
         │
         ├──── IN PROGRESS (Dokumen dihantar ke bank)
         │         │
         │         ├──── DONE → Direkod di Sheet DONE ✅
         │         │
         │         └──── DECLINED BY BANK → Direkod di Sheet DECLINED ❌
         │
         ├──── ON HOLD (Menunggu dokumen atau kelulusan bos)
         │
         └──── HOLD (Bos belum proceed)

[Hartanah sebagai cagaran] → Direkod di Sheet DATABASE property
[Aset sebagai cagaran]     → Direkod di Sheet ASSET
[BFR semua bank dikemaskini] → Sheet ENGINE
[DASHBOARD] → Ringkasan semua status
```

---

## 4. Entiti & Hubungan Data (Entities)

### Entiti Utama:
1. **Syarikat (Company)** — Pemohon kemudahan
2. **Bank** — Penyedia kemudahan kewangan
3. **Kemudahan (Facility)** — Produk kewangan (Term Loan, Overdraft, LC, dll.)
4. **Permohonan (Application)** — Setiap baris rekod = 1 permohonan
5. **Status** — Keadaan semasa sesuatu permohonan

### Status Flow:
```
IN PROGRESS → DONE (berjaya)
IN PROGRESS → DECLINED BY BANK (ditolak bank)
ON HOLD → IN PROGRESS (dokumen lengkap)
ON HOLD → DECLINED BY COMPANY (syarikat batalkan)
HOLD → IN PROGRESS (bos proceed)
HOLD → DECLINED (tidak diteruskan)
```

### Jenis Kemudahan (Type of Facility):
- **Term Loan** — Pinjaman berjangka tetap
- **Overdraft (OD)** — Kemudahan overdraf/kredit berputar
- **Letter of Credit (LC)** — Kemudahan kredit perdagangan
- **Capital Financing / Working Capital** — Pembiayaan modal kerja
- **Asset Financing (GAMODA)** — Pembiayaan aset
- **Collaborative Financing** — Program pembiayaan bersama (SME Corp/Teraju)

---

## 5. Senarai Syarikat yang Terlibat

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

## 6. Senarai Bank yang Terlibat

Affin Bank, Agro Bank, Alliance Bank, AmBank, Bank Islam, Bank Muamalat, Bank Rakyat, BSN, CIMB Bank, Citibank, HSBC Bank, Hong Leong Bank, Maybank, MBSB Bank, OCBC Bank, Public Bank (PBB), RHB Bank, SME Bank, Standard Chartered, UOB Bank

---

## 7. Isu & Pemerhatian

> [!WARNING]
> Beberapa sel dalam Excel mengandungi `#REF!` — ini menunjukkan formula rujukan yang rosak, kemungkinan besar BFR diambil dari sheet ENGINE tetapi ada isu rujukan sel.

> [!NOTE]
> Sheet **DECLINED** mempunyai **rekod bertindih** dengan sheet **DONE** — contohnya FIRST ALLIED SECURITY berstatus DECLINED dalam sheet DONE (bukan sheet DECLINED). Ini bermakna ada permohonan yang awalnya DONE tetapi kemudian ditolak semasa annual review.

> [!IMPORTANT]
> Data dalam **PENDING** tarikh kemaskini adalah **17.11.2025** — mungkin sudah lapuk dan perlu dikemaskini.

---

## Ringkasan Statistik (Anggaran)

| Kategori | Bilangan Rekod | Jumlah Dipohon (RM) | Jumlah Diluluskan/Ditawarkan (RM) |
|----------|---------------|--------------------|---------------------------------|
| DONE | ~11 rekod | ~RM 17.1 juta | ~RM 11.35 juta |
| PENDING | ~8 rekod | ~RM 8.25 juta | ~RM 300,000 |
| DECLINED | ~27 rekod | ~RM 16 juta+ | ~RM 1 juta (sebahagian) |
| DATABASE property | ~32 rekod | ~RM 7 juta | - |
| ASSET | 2 rekod | - | - |
