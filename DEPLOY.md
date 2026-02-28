# Panduan Deploy IKSP Early Warning System

Dua pilihan deployment tersedia:

| Metode | Biaya | Kesulitan | Cocok untuk |
|--------|-------|-----------|-------------|
| **Railway** (rekomendasi) | Gratis (500 jam/bulan) | ⭐ Mudah | Demo / MVP |
| **VPS + Docker** | ~$5–10/bulan | ⭐⭐ Menengah | Production |

---

## OPSI A — Railway (Paling Mudah, Gratis)

### Prasyarat
- Akun GitHub: https://github.com
- Akun Railway: https://railway.app (daftar dengan GitHub)

### Langkah 1 — Push kode ke GitHub

```bash
# Di folder lksp/
git init
git add .
git commit -m "IKSP Early Warning System"

# Buat repo di GitHub lalu:
git remote add origin https://github.com/USERNAME/iksp-app.git
git push -u origin main
```

### Langkah 2 — Deploy ke Railway

1. Buka https://railway.app → **New Project**
2. Pilih **Deploy from GitHub repo**
3. Pilih repo `iksp-app`
4. Railway otomatis mendeteksi `nixpacks.toml` dan build

### Langkah 3 — Set Environment Variables di Railway

Di Railway Dashboard → **Variables**, tambahkan:

```
SECRET_KEY     = (string random, generate: python -c "import secrets; print(secrets.token_hex(32))")
CORS_ORIGINS   = *
DATABASE_URL   = sqlite:///./iksp.db
```

### Langkah 4 — Dapat URL Publik

Di Railway → **Settings** → **Domains** → **Generate Domain**

Contoh: `https://iksp-production.up.railway.app`

> **Catatan Railway Free Tier:**
> - 500 jam/bulan (cukup ~20 hari aktif terus-menerus)
> - Aplikasi tidak sleep (berbeda dengan Render free)
> - SQLite reset saat redeploy → gunakan Railway Volume untuk persistence

### Langkah 5 — Tambah Railway Volume (agar data tidak hilang)

1. Railway Dashboard → **+ New** → **Volume**
2. Attach ke service, mount path: `/data`
3. Set env var: `DATABASE_URL=sqlite:////data/iksp.db`

---

## OPSI B — VPS dengan Docker (Production)

### Prasyarat
- VPS Ubuntu 22.04 (DigitalOcean, Vultr, Hostinger, dll) minimal 1GB RAM
- Domain (opsional tapi disarankan)
- SSH access ke VPS

### Langkah 1 — Setup VPS

```bash
# Login ke VPS via SSH
ssh root@IP_SERVER_ANDA

# Install Docker + Docker Compose
curl -fsSL https://get.docker.com | sh
apt-get install -y docker-compose-plugin

# Buat user non-root (opsional tapi best practice)
adduser iksp
usermod -aG docker iksp
```

### Langkah 2 — Upload kode ke VPS

```bash
# Dari komputer lokal, upload seluruh folder lksp/
scp -r lksp/ root@IP_SERVER:/home/iksp/

# Atau gunakan git clone di server
git clone https://github.com/USERNAME/iksp-app.git /home/iksp/lksp
```

### Langkah 3 — Konfigurasi environment

```bash
cd /home/iksp/lksp/backend
cp .env.example .env
nano .env  # Edit SECRET_KEY dan CORS_ORIGINS
```

Isi `.env`:
```
SECRET_KEY=isi_dengan_random_string_64_karakter
CORS_ORIGINS=http://IP_SERVER_ANDA
DATABASE_URL=sqlite:////data/iksp.db
```

### Langkah 4 — Build dan jalankan

```bash
cd /home/iksp/lksp

# Build Docker image (pertama kali ~5-10 menit)
docker compose build

# Jalankan di background
docker compose up -d

# Cek status
docker compose ps
docker compose logs -f app
```

Akses di: `http://IP_SERVER_ANDA`

### Langkah 5 — Pasang Domain + SSL (opsional)

```bash
# 1. Arahkan DNS domain ke IP server (A record)
#    Contoh: iksp.pks.id → 123.456.789.0

# 2. Edit nginx.conf — ganti server_name
nano nginx.conf
# Ubah: server_name _;
# Menjadi: server_name iksp.pks.id;

# 3. Install Certbot untuk SSL gratis
apt-get install -y certbot

# 4. Stop nginx sementara
docker compose stop nginx

# 5. Dapatkan sertifikat SSL
certbot certonly --standalone -d iksp.pks.id

# 6. Edit nginx.conf — aktifkan blok HTTPS (uncomment bagian server 443)
nano nginx.conf

# 7. Restart
docker compose up -d nginx
```

### Langkah 6 — Auto-update (opsional)

```bash
# Buat script update
cat > /home/iksp/update.sh << 'EOF'
#!/bin/bash
cd /home/iksp/lksp
git pull
docker compose build app
docker compose up -d --no-deps app
EOF
chmod +x /home/iksp/update.sh

# Jalankan update:
/home/iksp/update.sh
```

---

## Perintah Docker yang Berguna

```bash
# Lihat log real-time
docker compose logs -f app

# Masuk ke dalam container
docker compose exec app bash

# Restart aplikasi
docker compose restart app

# Stop semua
docker compose down

# Stop dan hapus data (HATI-HATI: database terhapus!)
docker compose down -v

# Update setelah perubahan kode
docker compose build app && docker compose up -d app
```

---

## Akun Default Setelah Deploy

| Username | Password | Role |
|----------|----------|------|
| admin | Admin@12345 | Admin |
| analis1 | Analis@12345 | Analis |
| viewer1 | Viewer@12345 | Viewer |

> **PENTING:** Segera ganti password setelah deploy pertama kali!
> Login → Admin → Manajemen Pengguna → Edit password

---

## Troubleshooting

**Build gagal di Railway:**
- Pastikan `nixpacks.toml` ada di root folder
- Cek log di Railway Dashboard → Deployments

**"Application startup failed" di VPS:**
```bash
docker compose logs app  # lihat error detail
```

**Database terhapus setelah redeploy:**
- Pastikan volume `/data` sudah di-mount
- Railway: tambahkan Railway Volume
- Docker: volume `iksp_data` di docker-compose.yml sudah otomatis persisten

**Frontend tidak muncul (hanya API):**
- Pastikan `npm run build` berhasil sebelum deploy
- Cek folder `frontend/dist/` ada dan berisi `index.html`
