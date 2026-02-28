@echo off
title IKSP - Frontend
color 0A
cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo  [!] node_modules tidak ditemukan. Menjalankan npm install...
    npm install
    if %errorlevel% neq 0 (
        echo  [ERROR] npm install gagal! Pastikan Node.js sudah diinstall.
        echo  Download: https://nodejs.org/
        pause
        exit /b 1
    )
)

echo.
echo  ─────────────────────────────────────
echo   IKSP Frontend
echo   URL : http://localhost:5173
echo  ─────────────────────────────────────
echo.

npm run dev
pause
