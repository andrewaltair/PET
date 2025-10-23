@echo off
title PetService - Hard Restart
color 0C

echo ========================================
echo   PetService HARD RESTART
echo ========================================
echo.
echo This will:
echo   1. Kill ALL Node.js processes
echo   2. Clean ALL build caches
echo   3. Restart client and server
echo.
echo ========================================
echo.

REM Step 1: Kill all Node.js processes
echo [1/4] Killing all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.exe >nul 2>&1
taskkill /F /IM tsx.exe >nul 2>&1
taskkill /F /IM next.exe >nul 2>&1
echo   ✓ All processes terminated
echo.

REM Step 2: Wait for ports to free up
echo [2/4] Waiting for ports to free up...
timeout /t 2 /nobreak >nul
echo   ✓ Ports released
echo.

REM Step 3: Clean build caches
echo [3/4] Cleaning build caches...
cd client
if exist .next (
    echo   Removing client/.next...
    rmdir /s /q .next >nul 2>&1
    echo   ✓ Client cache cleaned
) else (
    echo   ✓ Client cache already clean
)
cd ..

cd server
if exist dist (
    echo   Removing server/dist...
    rmdir /s /q dist >nul 2>&1
    echo   ✓ Server cache cleaned
) else (
    echo   ✓ Server cache already clean
)
cd ..

if exist node_modules\.cache (
    echo   Removing node_modules/.cache...
    rmdir /s /q node_modules\.cache >nul 2>&1
    echo   ✓ Root cache cleaned
)
echo.

REM Step 4: Check dependencies
echo [4/5] Checking dependencies...
if not exist node_modules (
    echo   Installing dependencies...
    call npm install
    echo   ✓ Dependencies installed
) else (
    echo   ✓ Dependencies exist
)
echo.

REM Step 5: Start servers
echo [5/5] Starting client and server...
echo.
echo ========================================
echo   Starting servers in 3 seconds...
echo   Press Ctrl+C to stop both servers
echo ========================================
timeout /t 3 /nobreak >nul
echo.

REM Start both servers using concurrently
call npm run dev:full

REM If dev:full fails, try with npx concurrently
if errorlevel 1 (
    echo.
    echo Trying with npx concurrently...
    call npx concurrently "npm run dev --workspace=client" "npm run dev --workspace=server"
)

REM If still fails, fallback to manual start
if errorlevel 1 (
    echo.
    echo Starting servers manually in separate windows...
    echo.
    
    REM Start client in new window
    start "PetService Client" cmd /k "cd client && npm run dev"
    
    REM Wait a moment
    timeout /t 2 /nobreak >nul
    
    REM Start server in new window
    start "PetService Server" cmd /k "cd server && npm run dev"
    
    echo.
    echo Both servers started in separate windows.
    echo Close this window to stop.
    timeout /t 10 /nobreak >nul
)

pause

