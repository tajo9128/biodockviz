# BioDockViz Installer Build Script
# Run this script to build the Windows installer locally

param(
    [string]$Version = "1.0.0",
    [switch]$Clean = $false
)

$ErrorActionPreference = "Stop"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "BioDockViz Installer Build Script" -ForegroundColor Cyan
Write-Host "Version: $Version" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check prerequisites
Write-Host "`nChecking prerequisites..." -ForegroundColor Yellow

# Check NSIS
$nsisPath = "C:\Program Files (x86)\NSIS\makensis.exe"
if (-not (Test-Path $nsisPath)) {
    Write-Host "ERROR: NSIS not found at $nsisPath" -ForegroundColor Red
    Write-Host "Please install NSIS from https://nsis.sourceforge.io/Download" -ForegroundColor Red
    exit 1
}
Write-Host "✓ NSIS found" -ForegroundColor Green

# Check Node.js
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js not found" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green

# Check Python
$pythonVersion = python --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Python not found" -ForegroundColor Red
    Write-Host "Please install Python 3.11+ from https://www.python.org/" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Python $pythonVersion found" -ForegroundColor Green

# Clean build directories
if ($Clean) {
    Write-Host "`nCleaning build directories..." -ForegroundColor Yellow
    Remove-Item -Path "frontend\.next" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "frontend\out" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "backend\dist" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "backend\build" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Clean complete" -ForegroundColor Green
}

# Build Frontend
Write-Host "`n[1/4] Building frontend..." -ForegroundColor Yellow
Push-Location frontend
try {
    Write-Host "Installing dependencies..." -ForegroundColor Gray
    npm ci
    
    Write-Host "Building Next.js app..." -ForegroundColor Gray
    npm run build
    
    Write-Host "Exporting static files..." -ForegroundColor Gray
    npm run export
    
    Write-Host "✓ Frontend build complete" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Frontend build failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Pop-Location
    exit 1
} finally {
    Pop-Location
}

# Package Backend
Write-Host "`n[2/4] Packaging backend..." -ForegroundColor Yellow
Push-Location backend
try {
    Write-Host "Installing dependencies..." -ForegroundColor Gray
    pip install -r requirements.txt
    
    Write-Host "Installing PyInstaller..." -ForegroundColor Gray
    pip install pyinstaller
    
    Write-Host "Building executable..." -ForegroundColor Gray
    pyinstaller --clean --onefile --name BioDockViz __init__.py
    
    Write-Host "✓ Backend packaging complete" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Backend packaging failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Pop-Location
    exit 1
} finally {
    Pop-Location
}

# Build NSIS Installer
Write-Host "`n[3/4] Building NSIS installer..." -ForegroundColor Yellow
try {
    & $nsisPath installer.nsi
    
    if ($LASTEXITCODE -ne 0) {
        throw "NSIS build failed with exit code $LASTEXITCODE"
    }
    
    Write-Host "✓ Installer build complete" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Installer build failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Generate Checksums
Write-Host "`n[4/4] Generating checksums..." -ForegroundColor Yellow
$installerFile = "BioDockViz-Setup-$Version.exe"

if (Test-Path $installerFile) {
    # SHA256
    $sha256 = Get-FileHash -Path $installerFile -Algorithm SHA256
    $sha256.Hash | Out-File -FilePath "$installerFile.sha256" -Encoding ASCII -NoNewline
    Write-Host "✓ SHA256: $($sha256.Hash)" -ForegroundColor Green
    
    # MD5
    $md5 = Get-FileHash -Path $installerFile -Algorithm MD5
    $md5.Hash | Out-File -FilePath "$installerFile.md5" -Encoding ASCII -NoNewline
    Write-Host "✓ MD5: $($md5.Hash)" -ForegroundColor Green
    
    # File size
    $size = (Get-Item $installerFile).Length
    $sizeMB = [math]::Round($size / 1MB, 2)
    Write-Host "✓ Size: $sizeMB MB" -ForegroundColor Green
} else {
    Write-Host "ERROR: Installer file not found: $installerFile" -ForegroundColor Red
    exit 1
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Build Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "`nGenerated files:" -ForegroundColor Yellow
Write-Host "  - $installerFile"
Write-Host "  - $installerFile.sha256"
Write-Host "  - $installerFile.md5"
Write-Host "`nReady for upload to GitHub!" -ForegroundColor Green
