@echo off
title IKSP - Backend API
color 0B
cd /d "%~dp0backend"

if not exist "venv\Scripts\activate.bat" (
    echo  [ERROR] Virtual environment tidak ditemukan!
    echo  Jalankan install_backend.bat terlebih dahulu.
    pause
    exit /b 1
)

REM Cek apakah uvicorn sudah terinstall
if not exist "venv\Scripts\uvicorn.exe" (
    echo  [!] Package belum terinstall. Menjalankan pip install...
    venv\Scripts\python.exe -m pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo  [ERROR] pip install gagal!
        pause
        exit /b 1
    )
)

call venv\Scripts\activate.bat

echo.
echo  ─────────────────────────────────────────
echo   IKSP Backend API  ^|  FastAPI + SQLite
echo.
echo   URL  : http://localhost:8000
echo   Docs : http://localhost:8000/docs
echo   DB   : backend\iksp.db (auto-dibuat)
echo  ─────────────────────────────────────────
echo.

uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
