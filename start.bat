@echo off
echo ========================================
echo   DayFlow Harmony - Starting Services
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Checking dependencies...
if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm install
)

if not exist "server\node_modules\" (
    echo Installing backend dependencies...
    cd server
    call npm install
    cd ..
)

echo.
echo [2/4] Starting Backend Server...
start "DayFlow Backend" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/4] Starting Frontend Server...
start "DayFlow Frontend" cmd /k "npm run dev"

echo.
echo [4/4] Services Started!
echo ========================================
echo   Backend:  http://localhost:3001
echo   Frontend: http://localhost:8080
echo ========================================
echo.
echo Press any key to stop all services...
pause >nul

echo Stopping services...
taskkill /FI "WindowTitle eq DayFlow Backend*" /T /F >nul 2>nul
taskkill /FI "WindowTitle eq DayFlow Frontend*" /T /F >nul 2>nul

echo Services stopped.
pause
