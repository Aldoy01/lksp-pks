@echo off
title IKSP - Reinstall Frontend (Full Clean)
color 0E
echo.
echo  ─────────────────────────────────────────────
echo   Full Clean Reinstall Frontend
echo   (hapus cache + node_modules + install ulang)
echo  ─────────────────────────────────────────────
echo.

cd /d "%~dp0frontend"

echo  [1/5] Hapus node_modules...
if exist "node_modules" (
    rmdir /s /q node_modules
    echo         OK - node_modules dihapus.
) else (
    echo         Tidak ada node_modules.
)

echo.
echo  [2/5] Hapus package-lock.json...
if exist "package-lock.json" (
    del /q package-lock.json
    echo         OK - package-lock.json dihapus.
)

echo.
echo  [3/5] Bersihkan npm cache...
npm cache clean --force
echo.

echo  [4/5] npm install (download ulang semua paket)...
echo  Harap tunggu, proses ini bisa memakan beberapa menit...
echo.
npm install --prefer-online

if %errorlevel% neq 0 (
    echo.
    echo  ─────────────────────────────────────────────
    echo  [ERROR] npm install gagal!
    echo.
    echo  Coba solusi manual:
    echo    1. Buka Command Prompt baru sebagai Admin
    echo    2. cd C:\Users\aldia\lksp\frontend
    echo    3. npm cache clean --force
    echo    4. npm install
    echo  ─────────────────────────────────────────────
    echo.
    pause
    exit /b 1
)

echo.
echo  [5/5] Verifikasi instalasi vite...
if exist "node_modules\vite\dist\node\cli.js" (
    echo         OK - vite\dist\node\cli.js ditemukan!
) else (
    echo  [WARN] vite\dist\node\cli.js tidak ada
    echo         Coba: npm install vite@latest --save-dev
    npm install vite@latest --save-dev
)

echo.
echo  ─────────────────────────────────────────────
echo  [SELESAI] Coba jalankan: start_frontend.bat
echo  ─────────────────────────────────────────────
echo.
pause
