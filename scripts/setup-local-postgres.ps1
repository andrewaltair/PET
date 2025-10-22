# Setup local PostgreSQL for Pet Service Marketplace
Write-Host "🐘 Setting up PostgreSQL for Pet Service Marketplace" -ForegroundColor Blue
Write-Host "==================================================" -ForegroundColor Blue

# Check if PostgreSQL is installed
try {
    $pgVersion = & psql --version 2>$null
    Write-Host "✅ PostgreSQL found: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL not found. Please install PostgreSQL first:" -ForegroundColor Red
    Write-Host "   Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "   Or use Docker: docker run --name postgres-pet -e POSTGRES_DB=petservice_marketplace -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15" -ForegroundColor Yellow
    exit 1
}

# Check if PostgreSQL service is running
$service = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
if ($service -and $service.Status -eq "Running") {
    Write-Host "✅ PostgreSQL service is running" -ForegroundColor Green
} else {
    Write-Host "⚠️  PostgreSQL service might not be running. Trying to start..." -ForegroundColor Yellow
    try {
        Start-Service -Name $service.Name -ErrorAction Stop
        Write-Host "✅ PostgreSQL service started" -ForegroundColor Green
    } catch {
        Write-Host "❌ Could not start PostgreSQL service. Please start it manually." -ForegroundColor Red
        exit 1
    }
}

# Wait for PostgreSQL to be ready
Write-Host "⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
do {
    try {
        $result = & psql -h localhost -U postgres -c "SELECT version();" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ PostgreSQL is ready!" -ForegroundColor Green
            break
        }
    } catch {
        # Continue trying
    }
    $attempt++
    Start-Sleep -Seconds 1
} while ($attempt -lt $maxAttempts)

if ($attempt -eq $maxAttempts) {
    Write-Host "❌ PostgreSQL failed to start within 30 seconds" -ForegroundColor Red
    exit 1
}

# Create database
Write-Host "📦 Creating database..." -ForegroundColor Yellow
try {
    & createdb -U postgres petservice_marketplace 2>$null
    Write-Host "✅ Database 'petservice_marketplace' created" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ Database 'petservice_marketplace' already exists" -ForegroundColor Blue
}

Write-Host ""
Write-Host "🎉 PostgreSQL setup complete!" -ForegroundColor Green
Write-Host "Now you can run: npm run db:migrate" -ForegroundColor White
