@echo off
title PetService - Clean & Restart
color 0B

echo ========================================
echo   PetService - Clean Cache & Restart
echo ========================================
echo.

REM Kill all Node processes
echo [1/4] Killing Node processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.exe >nul 2>&1
taskkill /F /IM tsx.exe >nul 2>&1
taskkill /F /IM next.exe >nul 2>&1
echo   Done!
echo.

REM Clean Next.js cache
echo [2/4] Cleaning Next.js cache...
if exist "client\.next" (
    rd /s /q "client\.next" 2>nul
    echo   Removed .next folder
) else (
    echo   No .next folder found
)
echo   Done!
echo.

REM Clean client node_modules cache
echo [3/4] Cleaning client cache...
if exist "client\node_modules\.cache" (
    rd /s /q "client\node_modules\.cache" 2>nul
    echo   Removed node_modules cache
) else (
    echo   No cache folder found
)
echo   Done!
echo.

REM Wait for cleanup
echo [4/4] Waiting for cleanup to complete...
timeout /t 2 /nobreak >nul
echo   Done!
echo.

echo ========================================
echo   Starting servers...
echo ========================================
echo.
timeout /t 2 /nobreak >nul

REM Start the dev servers
call npm run dev:full

pause


