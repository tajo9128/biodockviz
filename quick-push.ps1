# BioDockViz - Quick Update and Push Script
# Double-click this file or run: .\quick-push.ps1

param(
    [string]$Message = "Update BioDockViz - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

Write-Host "Quick Push to GitHub" -ForegroundColor Cyan
Write-Host "Commit Message: $Message" -ForegroundColor Yellow
Write-Host ""

# Configure git if needed
git config user.name "tajo9128" 2>$null
git config user.email "tajo9128@gmail.com" 2>$null

# Add all changes
Write-Host "Adding changes..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "Committing..." -ForegroundColor Yellow
git commit -m "$Message"

# Push
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Successfully updated GitHub!" -ForegroundColor Green
    Write-Host "View at: https://github.com/tajo9128/biodockviz" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "⚠ Push failed. Try:" -ForegroundColor Yellow
    Write-Host "  git pull origin main" -ForegroundColor Gray
}

Write-Host ""
Read-Host "Press Enter to close"
