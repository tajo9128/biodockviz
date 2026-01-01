# BioDockViz Local Build Script
$ErrorActionPreference = "Stop"

Write-Host "Building BioDockViz Locally..." -ForegroundColor Cyan

# 1. Build Backend
Write-Host "`n[1/3] Building Backend..." -ForegroundColor Yellow
cd backend
# Create dummy .env if missing for build purposes (though PyInstaller doesn't need it, runtime does)
if (-not (Test-Path .env)) { Copy-Item .env.example .env }

pip install -r requirements.txt
pip install pyinstaller
pyinstaller --clean --onefile --name BioDockViz --hidden-import=uvicorn.logging --hidden-import=uvicorn.loops --hidden-import=uvicorn.loops.auto --hidden-import=uvicorn.protocols --hidden-import=uvicorn.protocols.http --hidden-import=uvicorn.protocols.http.auto --hidden-import=uvicorn.lifespan --hidden-import=uvicorn.lifespan.on __init__.py
if ($LASTEXITCODE -ne 0) { throw "Backend build failed" }
cd ..

# 2. Build Frontend
Write-Host "`n[2/3] Building Frontend..." -ForegroundColor Yellow
cd frontend
if (-not (Test-Path .env)) { "NEXT_PUBLIC_API_URL=http://localhost:8000" | Out-File .env -Encoding ASCII }
npm install
npm run build
# Check if out directory exists, if not run export
if (-not (Test-Path out)) {
    try { npm run export } catch { Write-Host "Export command failed or unnecessary" -ForegroundColor Gray }
}
cd ..

# 3. Build Installer
Write-Host "`n[3/3] Building Installer..." -ForegroundColor Yellow
$nsis = "C:\Program Files (x86)\NSIS\makensis.exe"
if (-not (Test-Path $nsis)) { throw "NSIS not found at $nsis" }
& $nsis installer.nsi
if ($LASTEXITCODE -ne 0) { throw "Installer build failed" }

# 4. Generate Checksums
Write-Host "`nGenerating Checksums..." -ForegroundColor Yellow
$exe = "BioDockViz-Setup-1.0.0.exe"
if (Test-Path $exe) {
    (Get-FileHash $exe -Algorithm SHA256).Hash | Out-File "$exe.sha256" -Encoding ASCII
    (Get-FileHash $exe -Algorithm MD5).Hash | Out-File "$exe.md5" -Encoding ASCII
    Write-Host "✓ Success! File created: $exe" -ForegroundColor Green
} else {
    throw "Installer file not found after build!"
}
