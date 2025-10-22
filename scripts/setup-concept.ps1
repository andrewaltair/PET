# Pet Service Marketplace Concept Setup
Write-Host "🐾 Setting up Pet Service Marketplace Concept" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

# Check if PostgreSQL is running
Write-Host "📋 Checking PostgreSQL..." -ForegroundColor Yellow
$pgRunning = $false
try {
    $result = & pg_isready -h localhost -p 5432 2>$null
    if ($LASTEXITCODE -eq 0) {
        $pgRunning = $true
    }
} catch {
    $pgRunning = $false
}

if (-not $pgRunning) {
    Write-Host "❌ PostgreSQL is not running. Please start PostgreSQL first." -ForegroundColor Red
    Write-Host "   On Windows: Start PostgreSQL service or use pg_ctl" -ForegroundColor Red
    exit 1
}

# Create database if it doesn't exist
Write-Host "📦 Creating database..." -ForegroundColor Yellow
try {
    & createdb petservice_marketplace 2>$null
    Write-Host "✅ Database created" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ Database already exists" -ForegroundColor Blue
}

# Install dependencies
Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
& npm install

# Run migrations
Write-Host "🗃️ Running database migrations..." -ForegroundColor Yellow
& npm run db:migrate

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Starting development servers..." -ForegroundColor Green
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "📝 Test accounts:" -ForegroundColor Yellow
Write-Host "   admin@example.com    / admin     (OWNER)" -ForegroundColor White
Write-Host "   user@example.com     / user      (OWNER)" -ForegroundColor White
Write-Host "   provider@example.com / provider  (PROVIDER)" -ForegroundColor White
Write-Host ""

& npm run dev
