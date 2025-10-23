@echo off
title PetService - Quick Restart
color 0A

echo ========================================
echo   PetService Quick Restart
echo ========================================
echo.
echo This will:
echo   1. Kill Node.js processes
echo   2. Restart client and server
echo.
echo ========================================
echo.

REM Kill all Node.js processes
echo [1/2] Killing Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.exe >nul 2>&1
taskkill /F /IM tsx.exe >nul 2>&1
taskkill /F /IM next.exe >nul 2>&1
echo   ✓ Processes terminated
echo.

REM Wait for ports to free up
echo [2/3] Waiting for ports...
timeout /t 2 /nobreak >nul
echo   ✓ Ports released
echo.

REM Check if concurrently is available
echo [3/3] Starting servers...
call npm run dev:full

REM Fallback if concurrently not found
if errorlevel 1 (
    echo.
    echo Concurrently not found, trying with npx...
    call npx concurrently "npm run dev --workspace=client" "npm run dev --workspace=server"
)

pause


