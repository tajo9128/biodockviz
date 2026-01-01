# Generate Checksums for BioDockViz Installer
# Usage: .\generate-checksums.ps1 -File "BioDockViz-Setup-1.0.0.exe"

param(
    [Parameter(Mandatory=$true)]
    [string]$File
)

if (-not (Test-Path $File)) {
    Write-Host "ERROR: File not found: $File" -ForegroundColor Red
    exit 1
}

Write-Host "Generating checksums for: $File" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Get file info
$fileInfo = Get-Item $File
$sizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
Write-Host "`nFile Information:" -ForegroundColor Yellow
Write-Host "  Name: $($fileInfo.Name)"
Write-Host "  Size: $sizeMB MB ($($fileInfo.Length) bytes)"
Write-Host "  Modified: $($fileInfo.LastWriteTime)"

# SHA256
Write-Host "`nGenerating SHA256..." -ForegroundColor Yellow
$sha256 = Get-FileHash -Path $File -Algorithm SHA256
$sha256.Hash | Out-File -FilePath "$File.sha256" -Encoding ASCII -NoNewline
Write-Host "✓ SHA256: $($sha256.Hash)" -ForegroundColor Green

# SHA512
Write-Host "`nGenerating SHA512..." -ForegroundColor Yellow
$sha512 = Get-FileHash -Path $File -Algorithm SHA512
$sha512.Hash | Out-File -FilePath "$File.sha512" -Encoding ASCII -NoNewline
Write-Host "✓ SHA512: $($sha512.Hash)" -ForegroundColor Green

# MD5
Write-Host "`nGenerating MD5..." -ForegroundColor Yellow
$md5 = Get-FileHash -Path $File -Algorithm MD5
$md5.Hash | Out-File -FilePath "$File.md5" -Encoding ASCII -NoNewline
Write-Host "✓ MD5: $($md5.Hash)" -ForegroundColor Green

# Create comprehensive checksum file
$checksumFile = "$File.checksums.txt"
$content = @"
BioDockViz Installer Checksums
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss UTC")

File: $($fileInfo.Name)
Size: $sizeMB MB ($($fileInfo.Length) bytes)

SHA256: $($sha256.Hash)
SHA512: $($sha512.Hash)
MD5:    $($md5.Hash)

Verification Instructions:
--------------------------
Windows PowerShell:
  Get-FileHash -Path "$($fileInfo.Name)" -Algorithm SHA256

Linux/macOS:
  sha256sum "$($fileInfo.Name)"
  
Expected SHA256: $($sha256.Hash)
"@

$content | Out-File -FilePath $checksumFile -Encoding UTF8

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Checksum Generation Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "`nGenerated files:" -ForegroundColor Yellow
Write-Host "  - $File.sha256"
Write-Host "  - $File.sha512"
Write-Host "  - $File.md5"
Write-Host "  - $checksumFile"

Write-Host "`nVerification command:" -ForegroundColor Yellow
Write-Host "  Get-FileHash -Path `"$File`" -Algorithm SHA256" -ForegroundColor Gray
