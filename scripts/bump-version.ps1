# BioDockViz Version Management Script
# Automatically updates version across all files and creates release

param(
    [Parameter(Mandatory=$true)]
    [string]$NewVersion,
    
    [switch]$CreateRelease = $false
)

$ErrorActionPreference = "Stop"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "BioDockViz Version Update" -ForegroundColor Cyan
Write-Host "New Version: v$NewVersion" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Files to update
$files = @{
    "backend/config.py" = @{
        Pattern = 'BIO_DOCK_VERSION\s*=\s*"[\d\.]+"'
        Replacement = "BIO_DOCK_VERSION = `"$NewVersion`""
    }
    "frontend/package.json" = @{
        Pattern = '"version":\s*"[\d\.]+"'
        Replacement = "`"version`": `"$NewVersion`""
    }
    "installer.nsi" = @{
        Pattern = 'VIProductVersion\s+"[\d\.]+"'
        Replacement = "VIProductVersion `"$NewVersion.0`""
    }
    "installer.nsi" = @{
        Pattern = 'OutFile\s+"BioDockViz-Setup-[\d\.]+\.exe"'
        Replacement = "OutFile `"BioDockViz-Setup-$NewVersion.exe`""
    }
}

# Update version in files
Write-Host "`nUpdating version in files..." -ForegroundColor Yellow
foreach ($file in $files.Keys) {
    if (Test-Path $file) {
        Write-Host "  Updating $file..." -ForegroundColor Gray
        $content = Get-Content $file -Raw
        $updated = $content -replace $files[$file].Pattern, $files[$file].Replacement
        $updated | Set-Content $file -NoNewline
        Write-Host "  ✓ Updated $file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ File not found: $file" -ForegroundColor Yellow
    }
}

# Update CHANGELOG
Write-Host "`nUpdating CHANGELOG.md..." -ForegroundColor Yellow
$date = Get-Date -Format "yyyy-MM-dd"
$changelogEntry = @"

## [$NewVersion] - $date

### Added
- (Add new features here)

### Changed
- (Add changes here)

### Fixed
- (Add bug fixes here)

"@

$changelog = Get-Content "CHANGELOG.md" -Raw
$updatedChangelog = $changelog -replace '## \[Unreleased\]', "## [Unreleased]`n$changelogEntry"
$updatedChangelog | Set-Content "CHANGELOG.md" -NoNewline
Write-Host "✓ CHANGELOG.md updated" -ForegroundColor Green

# Commit changes
Write-Host "`nCommitting version bump..." -ForegroundColor Yellow
git add .
git commit -m "Bump version to v$NewVersion"
Write-Host "✓ Changes committed" -ForegroundColor Green

# Create tag
Write-Host "`nCreating git tag v$NewVersion..." -ForegroundColor Yellow
git tag -a "v$NewVersion" -m "BioDockViz v$NewVersion"
Write-Host "✓ Tag created" -ForegroundColor Green

# Push to GitHub
Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
git push origin main
git push origin "v$NewVersion"
Write-Host "✓ Pushed to GitHub" -ForegroundColor Green

if ($CreateRelease) {
    Write-Host "`n=====================================" -ForegroundColor Cyan
    Write-Host "Creating GitHub Release" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    
    Write-Host "`nGitHub Actions will automatically:" -ForegroundColor Yellow
    Write-Host "  1. Build Windows installer" -ForegroundColor Gray
    Write-Host "  2. Build Docker images" -ForegroundColor Gray
    Write-Host "  3. Generate checksums" -ForegroundColor Gray
    Write-Host "  4. Create GitHub release" -ForegroundColor Gray
    Write-Host "  5. Upload artifacts" -ForegroundColor Gray
    
    Write-Host "`nView release at:" -ForegroundColor Yellow
    Write-Host "  https://github.com/tajo9128/biodockviz/releases/tag/v$NewVersion" -ForegroundColor Cyan
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "✓ Version Update Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "`nNew version: v$NewVersion" -ForegroundColor Green
Write-Host "Tag pushed to GitHub: v$NewVersion" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Review changes on GitHub"
Write-Host "  2. Wait for GitHub Actions to complete"
Write-Host "  3. Edit release notes on GitHub"
Write-Host "  4. Publish the release"
