@echo off
echo Killing all Node.js processes...
echo.

REM Kill all node processes
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo Successfully killed Node.js processes.
) else (
    echo No Node.js processes found or already terminated.
)

REM Kill all npm processes
taskkill /F /IM npm.exe 2>nul
if %errorlevel% equ 0 (
    echo Successfully killed npm processes.
) else (
    echo No npm processes found or already terminated.
)

REM Kill all tsx processes (TypeScript execution)
taskkill /F /IM tsx.exe 2>nul
if %errorlevel% equ 0 (
    echo Successfully killed tsx processes.
) else (
    echo No tsx processes found or already terminated.
)

echo.
echo Done! Port 5000 should now be free.
echo.
pause


