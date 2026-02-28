# IKSP Early Warning System

**Sistem Pemantauan Kerawanan Sosial-Politik Indonesia**

Aplikasi web full-stack untuk memantau Indeks Kerawanan Sosial-Politik (IKSP) di 34 provinsi Indonesia, dilengkapi peta choropleth interaktif, kalkulasi otomatis, dan dashboard analitik.

---

## Arsitektur Sistem

```
Frontend (React 18 + TypeScript + Vite)
    ↕ REST API (HTTP/JSON)
Backend (Python + FastAPI)
    ↕ SQLAlchemy ORM
Database (SQLite — iksp.db)
```

---

## Tech Stack

| Komponen | Teknologi |
|---|---|
| Frontend | React 18, TypeScript, Vite, TailwindCSS |
| Peta | Leaflet.js, react-leaflet |
| Chart | Recharts |
| State | Zustand + TanStack Query |
| Form | React Hook Form |
| Backend | Python 3.11+, FastAPI, SQLAlchemy 2.0 |
| Database | SQLite (file: `backend/iksp.db`) |
| Auth | JWT (python-jose) + bcrypt (passlib) |

---

## Cara Menjalankan

### Prasyarat
- **Python 3.11+** — https://www.python.org/downloads/
- **Node.js 18+** — https://nodejs.org/

---

### Terminal 1 — Backend

```bash
cd lksp/backend

# Setup virtual environment (sekali saja)
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac

pip install -r requirements.txt

# Jalankan server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend berjalan di:
- **API**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Database `iksp.db` dibuat otomatis, data 34 provinsi dan user default di-seed saat pertama kali jalan.

---

### Terminal 2 — Frontend

```bash
cd lksp/frontend

# Install dependencies (sekali saja)
npm install

# Jalankan dev server
npm run dev
```

Aplikasi berjalan di: **http://localhost:5173**

---

### (Opsional) GeoJSON untuk Peta Choropleth

Peta berjalan dengan circle marker tanpa GeoJSON. Untuk tampilan polygon propinsi yang lebih akurat:

```bash
cd lksp
python download_geojson.py
```

Atau manual: download file GeoJSON Indonesia dan simpan ke `frontend/public/indonesia-provinces.geojson`.

---

## Akun Default

| Username | Password | Role |
|---|---|---|
| admin | Admin@12345 | Admin |
| analis1 | Analis@12345 | Analis |
| viewer1 | Viewer@12345 | Viewer |

---

## Fitur Aplikasi

### 1. Dashboard
- KPI cards: total wilayah, rata-rata IKSP, wilayah tertinggi, jumlah sangat tinggi
- Top 10 wilayah risiko tertinggi
- Distribusi kategori risiko (pie chart)
- Tren IKSP nasional 12 bulan (line chart)
- Filter per periode

### 2. Peta Risiko
- Peta Indonesia interaktif (Leaflet)
- Choropleth: warna per provinsi sesuai kategori risiko
- Klik provinsi → panel detail (skor, breakdown dimensi)
- Hover → tooltip
- Filter periode

### 3. Input Data (Admin/Analis)
- Form input 9 indikator (skala 1–5)
- 3 Dimensi: Sosial, Ekonomi, Politik
- Auto-kalkulasi IKSP saat simpan
- Tabel riwayat input dengan filter

### 4. Skor IKSP
- Riwayat semua skor IKSP terkalkulasi
- Filter wilayah + periode
- Breakdown dim. Sosial, Ekonomi, Politik

### 5. Admin (Admin only)
- Manajemen pengguna (tambah, lihat status)
- Edit parameter bobot dimensi
- Role-based access control

---

## Formula IKSP

```
Dimensi Sosial  (bobot 0.35): mean(Ind1, Ind2, Ind3)
Dimensi Ekonomi (bobot 0.35): mean(Ind4, Ind5, Ind6)
Dimensi Politik (bobot 0.30): mean(Ind7, Ind8, Ind9)

IKSP = (0.35 × Sosial) + (0.35 × Ekonomi) + (0.30 × Politik)
```

| Skor | Kategori | Warna |
|---|---|---|
| < 1.5 | Sangat Rendah | Hijau |
| 1.5–2.5 | Rendah | Hijau Muda |
| 2.5–3.5 | Sedang | Kuning |
| 3.5–4.5 | Tinggi | Oranye |
| ≥ 4.5 | Sangat Tinggi | Merah |

**9 Indikator:**
1. Tingkat Kemiskinan (Sosial)
2. Angka Buta Huruf (Sosial)
3. Akses Layanan Kesehatan (Sosial)
4. Tingkat Pengangguran (Ekonomi)
5. Ketimpangan Pendapatan (Ekonomi)
6. Tekanan Harga Bahan Pokok (Ekonomi)
7. Frekuensi Konflik (Politik)
8. Kepercayaan Pemerintah (Politik)
9. Partisipasi Pemilu (Politik)

---

## Struktur API

| Method | Endpoint | Auth | Fungsi |
|---|---|---|---|
| POST | /api/auth/login | Public | Login, dapatkan JWT |
| GET | /api/wilayah | Any | Daftar 34 provinsi |
| GET | /api/input-data | Any | Riwayat input data |
| POST | /api/input-data | Analis/Admin | Submit 9 indikator |
| POST | /api/kalkulasi/{id} | Analis/Admin | Hitung IKSP |
| GET | /api/skor | Any | Riwayat skor IKSP |
| GET | /api/peta-risiko | Public | Data peta semua provinsi |
| GET | /api/dashboard/summary | Any | Ringkasan dashboard |
| GET/PUT | /api/admin/parameter | Admin | Parameter bobot |
| GET/POST | /api/admin/users | Admin | Manajemen user |

---

## Struktur Direktori

```
lksp/
├── backend/
│   ├── main.py                  # Entry point FastAPI
│   ├── requirements.txt
│   ├── iksp.db                  # SQLite (auto-generated)
│   └── app/
│       ├── api/                 # API routers (8 files)
│       ├── core/                # config, security, calculator
│       ├── models/              # SQLAlchemy models (6)
│       ├── schemas/             # Pydantic schemas (6)
│       └── db/                  # database.py + seed.py
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── components/
│       │   ├── dashboard/       # KPICard, Top10Table, Charts
│       │   ├── map/             # IndonesiaMap, RiskLegend
│       │   ├── layout/          # AppShell, Sidebar, Topbar
│       │   └── ui/              # Badge, Spinner
│       ├── pages/               # 6 halaman utama
│       ├── hooks/               # TanStack Query hooks
│       ├── store/               # Zustand stores
│       └── lib/                 # api.ts, utils, constants
├── download_geojson.py
└── README.md
```
