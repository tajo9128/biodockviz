# Verify BioDockViz Installer Checksum
# Usage: .\verify-checksum.ps1 -File "BioDockViz-Setup-1.0.0.exe" -ChecksumFile "BioDockViz-Setup-1.0.0.exe.sha256"

param(
    [Parameter(Mandatory=$true)]
    [string]$File,
    
    [Parameter(Mandatory=$true)]
    [string]$ChecksumFile,
    
    [string]$Algorithm = "SHA256"
)

# Check if files exist
if (-not (Test-Path $File)) {
    Write-Host "ERROR: File not found: $File" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $ChecksumFile)) {
    Write-Host "ERROR: Checksum file not found: $ChecksumFile" -ForegroundColor Red
    exit 1
}

Write-Host "Verifying checksum for: $File" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Read expected checksum
$expectedHash = (Get-Content $ChecksumFile -Raw).Trim()
Write-Host "`nExpected $Algorithm : $expectedHash" -ForegroundColor Yellow

# Calculate actual checksum
Write-Host "Calculating $Algorithm ..." -ForegroundColor Yellow
$actualHash = (Get-FileHash -Path $File -Algorithm $Algorithm).Hash
Write-Host "Actual $Algorithm   : $actualHash" -ForegroundColor Yellow

# Compare
Write-Host "`nVerification:" -ForegroundColor Yellow
if ($expectedHash -eq $actualHash) {
    Write-Host "✓ CHECKSUM VERIFIED - File is authentic" -ForegroundColor Green
    exit 0
} else {
    Write-Host "✗ CHECKSUM MISMATCH - File may be corrupted or tampered" -ForegroundColor Red
    Write-Host "`nWARNING: Do not install this file!" -ForegroundColor Red
    exit 1
}
