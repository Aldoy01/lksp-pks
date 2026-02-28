@echo off
title IKSP Early Warning System - Launcher
color 0A
echo.
echo  ==========================================
echo   IKSP Early Warning System
echo   Sistem Pemantauan Kerawanan Sosial-Politik
echo  ==========================================
echo.

cd /d "%~dp0"

REM ─── CEK SETUP ────────────────────────────────────────────────
if not exist "backend\venv\Scripts\uvicorn.exe" (
    echo  [!] Backend belum di-setup. Menjalankan setup.bat...
    echo.
    call setup.bat
    if %errorlevel% neq 0 exit /b 1
)

if not exist "frontend\node_modules" (
    echo  [!] Frontend belum di-setup. Menjalankan npm install...
    cd /d "%~dp0frontend"
    npm install
    cd /d "%~dp0"
)

REM ─── MULAI BACKEND ────────────────────────────────────────────
echo  [1/2] Memulai Backend API (port 8000)...
start "IKSP Backend" cmd /k "cd /d "%~dp0backend" && call venv\Scripts\activate.bat && echo. && echo  Backend berjalan di: http://localhost:8000 && echo  Swagger UI: http://localhost:8000/docs && echo. && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Tunggu sebentar agar backend sempat start
timeout /t 3 /nobreak >nul

REM ─── MULAI FRONTEND ───────────────────────────────────────────
echo  [2/2] Memulai Frontend (port 5173)...
start "IKSP Frontend" cmd /k "cd /d "%~dp0frontend" && echo. && echo  Frontend berjalan di: http://localhost:5173 && echo. && npm run dev"

REM Tunggu frontend siap
timeout /t 5 /nobreak >nul

REM ─── BUKA BROWSER ─────────────────────────────────────────────
echo.
echo  [3/3] Membuka browser...
start "" "http://localhost:5173"

echo.
echo  ==========================================
echo   Aplikasi berjalan!
echo.
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:8000
echo   Swagger  : http://localhost:8000/docs
echo.
echo   Login default:
echo     admin   / Admin@12345   (Admin)
echo     analis1 / Analis@12345  (Analis)
echo     viewer1 / Viewer@12345  (Viewer)
echo.
echo   Tutup jendela Backend dan Frontend
echo   untuk menghentikan aplikasi.
echo  ==========================================
echo.
pause
