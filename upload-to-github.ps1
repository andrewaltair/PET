# PowerShell script to upload project to GitHub

Write-Host "🚀 Pet Service Marketplace - GitHub Upload Script" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "❌ Git repository not initialized!" -ForegroundColor Red
    Write-Host "Run: git init" -ForegroundColor Yellow
    exit 1
}

# Check current branch
$currentBranch = git branch --show-current
Write-Host "📍 Current branch: $currentBranch" -ForegroundColor Green
Write-Host ""

# Show status
Write-Host "📊 Checking repository status..." -ForegroundColor Cyan
git status --short
Write-Host ""

# Ask for confirmation
$confirm = Read-Host "Do you want to stage all changes and commit? (y/n)"
if ($confirm -ne "y") {
    Write-Host "❌ Aborted by user" -ForegroundColor Yellow
    exit 0
}

# Stage all files
Write-Host ""
Write-Host "📦 Staging all files..." -ForegroundColor Cyan
git add .

# Show what will be committed
Write-Host ""
Write-Host "📋 Files staged for commit:" -ForegroundColor Cyan
git status --short
Write-Host ""

# Check if there are changes to commit
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✅ No changes to commit!" -ForegroundColor Green
    exit 0
}

# Ask for commit message
Write-Host "💬 Enter commit message (or press Enter for default):" -ForegroundColor Cyan
$commitMessage = Read-Host
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "chore: Complete project setup and documentation"
}

# Commit changes
Write-Host ""
Write-Host "💾 Committing changes..." -ForegroundColor Cyan
git commit -m $commitMessage

# Check if commit was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Changes committed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Commit failed!" -ForegroundColor Red
    exit 1
}

# Check if remote exists
Write-Host ""
Write-Host "🌐 Checking remote repository..." -ForegroundColor Cyan
$remoteUrl = git remote get-url origin 2>$null

if ([string]::IsNullOrWhiteSpace($remoteUrl)) {
    Write-Host "⚠️  No remote repository configured!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To add a remote repository:" -ForegroundColor Cyan
    Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/pet-service-marketplace.git" -ForegroundColor White
    Write-Host ""
    Write-Host "Then push your code:" -ForegroundColor Cyan
    Write-Host "  git push -u origin main" -ForegroundColor White
    exit 0
}

Write-Host "Remote URL: $remoteUrl" -ForegroundColor Green

# Ask if user wants to push
Write-Host ""
$pushConfirm = Read-Host "Do you want to push to GitHub? (y/n)"
if ($pushConfirm -ne "y") {
    Write-Host "✅ Committed but not pushed" -ForegroundColor Yellow
    Write-Host "Push manually with: git push origin $currentBranch" -ForegroundColor Cyan
    exit 0
}

# Push to GitHub
Write-Host ""
Write-Host "⬆️  Pushing to GitHub..." -ForegroundColor Cyan
git push origin $currentBranch

# Check if push was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Successfully uploaded to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your repository is now live at:" -ForegroundColor Cyan
    Write-Host "  $remoteUrl" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Push failed!" -ForegroundColor Red
    Write-Host "Try again or check your remote configuration" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✨ Done!" -ForegroundColor Green

