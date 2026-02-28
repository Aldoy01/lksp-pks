@echo off
title IKSP - Install Backend Dependencies
color 0E
echo.
echo  ─────────────────────────────────────────────
echo   Install Paket Backend Python
echo  ─────────────────────────────────────────────
echo.

cd /d "%~dp0backend"

REM Gunakan python dari venv yang sudah ada
if exist "venv\Scripts\python.exe" (
    echo  Venv ditemukan: venv\Scripts\python.exe
    echo.

    REM Tampilkan versi Python
    for /f "tokens=*" %%v in ('venv\Scripts\python.exe --version') do echo  Python: %%v
    echo.

    echo  Upgrade pip...
    venv\Scripts\python.exe -m pip install --upgrade pip --quiet

    echo  Menginstall requirements.txt...
    echo  (pydantic 2.10+ dengan Python 3.14 wheel support)
    echo.
    venv\Scripts\python.exe -m pip install -r requirements.txt

    if %errorlevel% == 0 (
        echo.
        echo  ─────────────────────────────────────────────
        echo  [OK] Instalasi berhasil!
        echo.
        echo  Sekarang jalankan: start_backend.bat
        echo  ─────────────────────────────────────────────
    ) else (
        echo.
        echo  ─────────────────────────────────────────────
        echo  [ERROR] Instalasi gagal!
        echo.
        echo  Kemungkinan penyebab:
        echo   - Koneksi internet terputus
        echo   - Python 3.14 terlalu baru (coba Python 3.12)
        echo.
        echo  Solusi alternatif:
        echo   Install Python 3.12 dari https://www.python.org/
        echo   lalu hapus folder 'venv' dan jalankan lagi.
        echo  ─────────────────────────────────────────────
    )
    echo.
    pause
    exit /b
)

REM Buat venv baru jika belum ada
echo  Membuat virtual environment...

REM Cari Python di lokasi yang diketahui
set PYPATH=%LOCALAPPDATA%\Python\bin\python.exe
if exist "%PYPATH%" goto :USE_PYPATH

set PYPATH=%LOCALAPPDATA%\Python\pythoncore-3.14-64\python.exe
if exist "%PYPATH%" goto :USE_PYPATH

set PYPATH=python
:USE_PYPATH

"%PYPATH%" -m venv venv
if %errorlevel% neq 0 (
    echo  [ERROR] Gagal membuat venv!
    pause
    exit /b 1
)

echo  Upgrade pip...
venv\Scripts\python.exe -m pip install --upgrade pip --quiet

echo  Menginstall requirements...
venv\Scripts\python.exe -m pip install -r requirements.txt

if %errorlevel% == 0 (
    echo.
    echo  [OK] Instalasi berhasil! Jalankan: start_backend.bat
) else (
    echo.
    echo  [ERROR] Instalasi gagal!
)
echo.
pause
