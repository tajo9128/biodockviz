# BioDockViz - Quick Start Guide for GitHub Release

## 📦 Building the Installer

### Prerequisites
1. Install [NSIS](https://nsis.sourceforge.io/Download)
2. Install [Node.js 18+](https://nodejs.org/)
3. Install [Python 3.11+](https://www.python.org/)

### Build Command
```powershell
# Navigate to project root
cd BioDockViz

# Run build script
.\scripts\build-installer.ps1

# For clean build
.\scripts\build-installer.ps1 -Clean
```

### Output Files
- `BioDockViz-Setup-1.0.0.exe` - Installer (~50-100 MB)
- `BioDockViz-Setup-1.0.0.exe.sha256` - SHA256 checksum
- `BioDockViz-Setup-1.0.0.exe.md5` - MD5 checksum

## 🔐 Generating Checksums

```powershell
# Generate all checksums
.\scripts\generate-checksums.ps1 -File "BioDockViz-Setup-1.0.0.exe"
```

This creates:
- `.sha256` - SHA256 hash
- `.sha512` - SHA512 hash
- `.md5` - MD5 hash
- `.checksums.txt` - Combined checksum file

## ✅ Verifying Checksums

```powershell
# Verify installer integrity
.\scripts\verify-checksum.ps1 `
  -File "BioDockViz-Setup-1.0.0.exe" `
  -ChecksumFile "BioDockViz-Setup-1.0.0.exe.sha256"
```

## 🚀 Creating GitHub Release

### Option 1: Automated (Recommended)

```bash
# Tag version (triggers GitHub Actions)
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# GitHub Actions will automatically:
# 1. Build installer
# 2. Build Docker images
# 3. Generate checksums
# 4. Create GitHub release
# 5. Upload artifacts
```

### Option 2: Manual Release

1. **Build locally** (see above)
2. **Go to GitHub** → Releases → Draft new release
3. **Create tag**: `v1.0.0`
4. **Upload files**:
   - `BioDockViz-Setup-1.0.0.exe`
   - `BioDockViz-Setup-1.0.0.exe.sha256`
   - `BioDockViz-Setup-1.0.0.exe.md5`
   - `BioDockViz-Setup-1.0.0.exe.checksums.txt`
5. **Copy release notes** from `RELEASE_NOTES.md`
6. **Publish release**

## 📋 Pre-Release Checklist

- [ ] All tests passing
- [ ] Version numbers updated
- [ ] CHANGELOG.md updated
- [ ] RELEASE_NOTES.md updated
- [ ] Documentation reviewed
- [ ] Tested on clean Windows VM
- [ ] Checksums generated
- [ ] Installer signed (optional)

## 🎯 Release Workflow

```
1. Update version → 2. Build → 3. Test → 4. Tag → 5. Release
```

### Detailed Steps

```powershell
# 1. Update versions in files
#    - backend/config.py
#    - frontend/package.json
#    - installer.nsi

# 2. Commit changes
git add .
git commit -m "Bump version to 1.0.0"
git push

# 3. Build and test
.\scripts\build-installer.ps1 -Clean

# 4. Create and push tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 5. GitHub Actions handles the rest!
```

## 🐳 Docker Images

```bash
# Build images
docker-compose build

# Tag for release
docker tag biodockviz/backend:latest biodockviz/backend:1.0.0
docker tag biodockviz/frontend:latest biodockviz/frontend:1.0.0

# Push to registry
docker push biodockviz/backend:1.0.0
docker push biodockviz/frontend:1.0.0
```

## 📁 Files Ready for GitHub

After building, these files are ready for upload:

```
BioDockViz-Setup-1.0.0.exe          (Installer)
BioDockViz-Setup-1.0.0.exe.sha256   (SHA256 checksum)
BioDockViz-Setup-1.0.0.exe.md5      (MD5 checksum)
BioDockViz-Setup-1.0.0.exe.sha512   (SHA512 checksum)
BioDockViz-Setup-1.0.0.exe.checksums.txt  (All checksums)
```

## 🔗 Important Links

- **Source Code**: https://github.com/biodockviz/biodockviz
- **Releases**: https://github.com/biodockviz/biodockviz/releases
- **Issues**: https://github.com/biodockviz/biodockviz/issues
- **Documentation**: https://biodockviz.ai/docs

## 💡 Tips

- **Always test on clean VM** before release
- **Verify checksums** after build
- **Sign installer** for trust (optional)
- **Update Docker Hub** with latest images
- **Announce release** on social media

## 🆘 Troubleshooting

### Build fails
```powershell
# Clean everything
.\scripts\build-installer.ps1 -Clean

# Check prerequisites
node --version  # Should be 18+
python --version  # Should be 3.11+
makensis /?  # Should show NSIS help
```

### Checksum mismatch
```powershell
# Regenerate checksums
.\scripts\generate-checksums.ps1 -File "BioDockViz-Setup-1.0.0.exe"
```

## ✅ You're Ready!

All tools and workflows are in place. Follow the steps above to create your first GitHub release! 🎉
