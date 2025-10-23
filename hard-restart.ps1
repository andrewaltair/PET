# PetService Hard Restart Script (PowerShell)
Write-Host "========================================" -ForegroundColor Red
Write-Host "  PetService HARD RESTART" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "  1. Kill ALL Node.js processes" -ForegroundColor Yellow
Write-Host "  2. Clean ALL build caches" -ForegroundColor Yellow
Write-Host "  3. Restart client and server" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

# Step 1: Kill all Node.js processes
Write-Host "[1/4] Killing all Node.js processes..." -ForegroundColor Cyan
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Stop-Process -Name npm -Force -ErrorAction SilentlyContinue
Stop-Process -Name tsx -Force -ErrorAction SilentlyContinue
Stop-Process -Name next -Force -ErrorAction SilentlyContinue
Write-Host "  ✓ All processes terminated" -ForegroundColor Green
Write-Host ""

# Step 2: Wait for ports to free up
Write-Host "[2/4] Waiting for ports to free up..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
Write-Host "  ✓ Ports released" -ForegroundColor Green
Write-Host ""

# Step 3: Clean build caches
Write-Host "[3/4] Cleaning build caches..." -ForegroundColor Cyan

# Client cache
$clientNext = "client\.next"
if (Test-Path $clientNext) {
    Write-Host "  Removing client/.next..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $clientNext -ErrorAction SilentlyContinue
    Write-Host "  ✓ Client cache cleaned" -ForegroundColor Green
} else {
    Write-Host "  ✓ Client cache already clean" -ForegroundColor Green
}

# Server cache
$serverDist = "server\dist"
if (Test-Path $serverDist) {
    Write-Host "  Removing server/dist..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $serverDist -ErrorAction SilentlyContinue
    Write-Host "  ✓ Server cache cleaned" -ForegroundColor Green
} else {
    Write-Host "  ✓ Server cache already clean" -ForegroundColor Green
}

# Root cache
$rootCache = "node_modules\.cache"
if (Test-Path $rootCache) {
    Write-Host "  Removing node_modules/.cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $rootCache -ErrorAction SilentlyContinue
    Write-Host "  ✓ Root cache cleaned" -ForegroundColor Green
}
Write-Host ""

# Step 4: Start servers
Write-Host "[4/4] Starting client and server..." -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Starting servers in 3 seconds..." -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop both servers" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Start-Sleep -Seconds 3
Write-Host ""

# Start both servers using concurrently
Write-Host "Starting servers..." -ForegroundColor Yellow
npm run dev:full

