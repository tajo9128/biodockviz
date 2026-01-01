# BioDockViz - Initial GitHub Setup Script
# Run this once to set up the repository

param()

$ErrorActionPreference = "Stop"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "BioDockViz GitHub Initial Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if git is installed
Write-Host "`nChecking git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✓ Git installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git not found. Please install Git from https://git-scm.com/" -ForegroundColor Red
    exit 1
}

# Configure git user
Write-Host "`nConfiguring git user..." -ForegroundColor Yellow
git config user.name "tajo9128"
git config user.email "tajo9128@gmail.com"
Write-Host "✓ Git configured: tajo9128 <tajo9128@gmail.com>" -ForegroundColor Green

# Add remote
Write-Host "`nConfiguring remote repository..." -ForegroundColor Yellow
$remote = git remote get-url origin 2>$null

if ($remote) {
    Write-Host "Remote already exists: $remote" -ForegroundColor Yellow
    $response = Read-Host "Do you want to update it? (y/n)"
    if ($response -eq 'y') {
        git remote remove origin
        git remote add origin https://github.com/tajo9128/biodockviz.git
        Write-Host "✓ Remote updated" -ForegroundColor Green
    }
} else {
    git remote add origin https://github.com/tajo9128/biodockviz.git
    Write-Host "✓ Remote added: https://github.com/tajo9128/biodockviz.git" -ForegroundColor Green
}

# Set default branch
Write-Host "`nSetting default branch to main..." -ForegroundColor Yellow
git branch -M main
Write-Host "✓ Default branch: main" -ForegroundColor Green

# Initial commit
Write-Host "`nCreating initial commit..." -ForegroundColor Yellow
$status = git status --porcelain

if (![string]::IsNullOrEmpty($status)) {
    git add .
    git commit -m "Initial commit: BioDockViz v1.0.0"
    Write-Host "✓ Initial commit created" -ForegroundColor Green
} else {
    Write-Host "No changes to commit" -ForegroundColor Yellow
}

# Push to GitHub
Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
Write-Host "This will push to: https://github.com/tajo9128/biodockviz" -ForegroundColor Cyan
$response = Read-Host "Continue? (y/n)"

if ($response -eq 'y') {
    try {
        git push -u origin main
        Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
    } catch {
        Write-Host "Push failed. The repository may already have content." -ForegroundColor Yellow
        Write-Host "Try pulling first:" -ForegroundColor Yellow
        Write-Host "  git pull origin main --allow-unrelated-histories" -ForegroundColor Gray
        Write-Host "`nOr force push (WARNING: overwrites remote):" -ForegroundColor Yellow
        Write-Host "  git push -f origin main" -ForegroundColor Gray
    }
} else {
    Write-Host "Push cancelled. You can push later with:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor Gray
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "✓ Setup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Use .\quick-push.ps1 for quick updates"
Write-Host "2. Use .\push-to-github.ps1 for custom messages"
Write-Host "3. View repo: https://github.com/tajo9128/biodockviz"

Write-Host ""
Read-Host "Press Enter to close"
