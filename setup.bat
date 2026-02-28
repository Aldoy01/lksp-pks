@echo off
title IKSP Early Warning System - Setup
color 0B
echo.
echo  ==========================================
echo   IKSP Early Warning System - Setup Awal
echo  ==========================================
echo.

cd /d "%~dp0"

REM ─── CEK PYTHON ───────────────────────────────────────────────
echo [1/4] Memeriksa Python...
set PYTHON_EXE=

REM Coba python dari PATH dulu
python --version >nul 2>&1
if %errorlevel% == 0 (
    set PYTHON_EXE=python
    goto :PYTHON_OK
)

REM Coba py launcher
py --version >nul 2>&1
if %errorlevel% == 0 (
    set PYTHON_EXE=py
    goto :PYTHON_OK
)

REM Coba path spesifik user ini
set SPECIFIC_PY=%LOCALAPPDATA%\Python\bin\python.exe
if exist "%SPECIFIC_PY%" (
    set PYTHON_EXE="%SPECIFIC_PY%"
    goto :PYTHON_OK
)

set SPECIFIC_PY2=%LOCALAPPDATA%\Python\pythoncore-3.14-64\python.exe
if exist "%SPECIFIC_PY2%" (
    set PYTHON_EXE="%SPECIFIC_PY2%"
    goto :PYTHON_OK
)

echo.
echo  [ERROR] Python tidak ditemukan!
echo  Download Python dari: https://www.python.org/downloads/
echo  Centang "Add Python to PATH" saat instalasi.
echo.
pause
exit /b 1

:PYTHON_OK
echo         Python ditemukan: %PYTHON_EXE%

REM ─── SETUP BACKEND ────────────────────────────────────────────
echo.
echo [2/4] Menyiapkan Backend (Python Virtual Environment)...
cd /d "%~dp0backend"

if not exist "venv\Scripts\activate.bat" (
    echo         Membuat virtual environment...
    %PYTHON_EXE% -m venv venv
    if %errorlevel% neq 0 (
        echo  [ERROR] Gagal membuat virtual environment!
        pause
        exit /b 1
    )
)

echo         Menginstall paket Python...
call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet
if %errorlevel% neq 0 (
    echo  [ERROR] Gagal install requirements!
    pause
    exit /b 1
)
call venv\Scripts\deactivate.bat
echo         Backend siap!

REM ─── CEK NODE.JS ──────────────────────────────────────────────
echo.
echo [3/4] Memeriksa Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  [WARNING] Node.js TIDAK ditemukan!
    echo  ─────────────────────────────────────────
    echo  Silakan install Node.js terlebih dahulu:
    echo.
    echo    1. Buka: https://nodejs.org/
    echo    2. Download versi LTS (disarankan)
    echo    3. Install dengan pengaturan default
    echo    4. Restart komputer
    echo    5. Jalankan setup.bat ini lagi
    echo  ─────────────────────────────────────────
    echo.
    echo  Backend sudah siap. Setelah Node.js diinstall,
    echo  jalankan setup.bat lagi untuk setup frontend.
    echo.
    pause
    exit /b 0
)

for /f "tokens=*" %%v in ('node --version') do set NODE_VER=%%v
echo         Node.js ditemukan: %NODE_VER%

REM ─── SETUP FRONTEND ───────────────────────────────────────────
echo.
echo [4/4] Menginstall paket Frontend (npm install)...
cd /d "%~dp0frontend"

if not exist "node_modules" (
    npm install
    if %errorlevel% neq 0 (
        echo  [ERROR] Gagal npm install!
        pause
        exit /b 1
    )
) else (
    echo         node_modules sudah ada, melewati npm install.
)

REM ─── SELESAI ──────────────────────────────────────────────────
echo.
echo  ==========================================
echo   Setup SELESAI!
echo  ==========================================
echo.
echo   Jalankan aplikasi dengan: start.bat
echo   Atau klik dua kali file start.bat
echo.
pause
