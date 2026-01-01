# BioDockViz - Automated GitHub Push Script
# Usage: .\push-to-github.ps1 -Message "Your commit message"

param(
    [Parameter(Mandatory=$false)]
    [string]$Message = "Update BioDockViz",
    
    [switch]$Force = $false,
    
    [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "BioDockViz GitHub Push Automation" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if git is configured
Write-Host "`nChecking git configuration..." -ForegroundColor Yellow
$gitUser = git config user.name
$gitEmail = git config user.email

if ([string]::IsNullOrEmpty($gitUser) -or [string]::IsNullOrEmpty($gitEmail)) {
    Write-Host "Configuring git..." -ForegroundColor Yellow
    git config user.name "tajo9128"
    git config user.email "tajo9128@gmail.com"
    Write-Host "✓ Git configured: tajo9128 <tajo9128@gmail.com>" -ForegroundColor Green
} else {
    Write-Host "✓ Git already configured: $gitUser <$gitEmail>" -ForegroundColor Green
}

# Check remote
$remote = git remote get-url origin 2>$null
if ([string]::IsNullOrEmpty($remote)) {
    Write-Host "Adding remote origin..." -ForegroundColor Yellow
    git remote add origin https://github.com/tajo9128/biodockviz.git
    Write-Host "✓ Remote added: https://github.com/tajo9128/biodockviz.git" -ForegroundColor Green
} else {
    Write-Host "✓ Remote: $remote" -ForegroundColor Green
}

# Check for changes
Write-Host "`nChecking for changes..." -ForegroundColor Yellow
$status = git status --porcelain

if ([string]::IsNullOrEmpty($status)) {
    Write-Host "No changes to commit" -ForegroundColor Yellow
    
    # Try to push anyway (in case there are unpushed commits)
    Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
    try {
        if ($Force) {
            git push -f origin $Branch
        } else {
            git push origin $Branch
        }
        Write-Host "✓ Successfully pushed to GitHub" -ForegroundColor Green
    } catch {
        Write-Host "Nothing to push (already up to date)" -ForegroundColor Yellow
    }
    exit 0
}

# Show changes
Write-Host "Changes detected:" -ForegroundColor Green
git status --short

# Add all changes
Write-Host "`nAdding all changes..." -ForegroundColor Yellow
git add .
Write-Host "✓ All changes staged" -ForegroundColor Green

# Commit
Write-Host "`nCommitting changes..." -ForegroundColor Yellow
git commit -m "$Message"
Write-Host "✓ Changes committed: $Message" -ForegroundColor Green

# Push to GitHub
Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
try {
    if ($Force) {
        git push -f origin $Branch
        Write-Host "✓ Force pushed to origin/$Branch" -ForegroundColor Green
    } else {
        git push origin $Branch
        Write-Host "✓ Successfully pushed to origin/$Branch" -ForegroundColor Green
    }
} catch {
    Write-Host "Push failed. You may need to pull first:" -ForegroundColor Red
    Write-Host "  git pull origin $Branch" -ForegroundColor Yellow
    Write-Host "`nOr force push (WARNING: overwrites remote):" -ForegroundColor Yellow
    Write-Host "  .\push-to-github.ps1 -Message `"$Message`" -Force" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "✓ Push Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "`nView at: https://github.com/tajo9128/biodockviz" -ForegroundColor Cyan
