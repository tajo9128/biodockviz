# BioDockViz Release Process

This document outlines the step-by-step process for releasing a new version of BioDockViz.

## Pre-Release Checklist

### 1. Code Preparation

- [ ] All features complete and merged to `main`
- [ ] All tests passing (unit, integration, e2e)
- [ ] Code reviewed and approved
- [ ] No known critical bugs
- [ ] Documentation updated

### 2. Version Update

Update version numbers in:
- [ ] `backend/config.py` - `BIO_DOCK_VERSION`
- [ ] `frontend/package.json` - `version`
- [ ] `installer.nsi` - `VIProductVersion`
- [ ] `README.md` - version references
- [ ] `CHANGELOG.md` - new version entry

### 3. Documentation

- [ ] Update `CHANGELOG.md` with all changes
- [ ] Update `RELEASE_NOTES.md` with release information
- [ ] Update `README.md` if needed
- [ ] Verify all documentation links work

### 4. Testing

- [ ] Run full test suite: `pytest backend/tests/`
- [ ] Test frontend build: `npm run build`
- [ ] Test installer build locally
- [ ] Test Docker images locally
- [ ] Verify on clean Windows VM
- [ ] Verify accessibility compliance
- [ ] Test internationalization (all 6 languages)

## Release Steps

### Step 1: Prepare Release Branch

```bash
# Create release branch
git checkout -b release/v1.0.0

# Update version numbers (see checklist above)

# Commit changes
git add .
git commit -m "Prepare release v1.0.0"

# Push to GitHub
git push origin release/v1.0.0
```

### Step 2: Build Locally

```powershell
# Clean build
.\scripts\build-installer.ps1 -Clean

# Verify output
dir BioDockViz-Setup-*.exe
dir BioDockViz-Setup-*.sha256
dir BioDockViz-Setup-*.md5
```

### Step 3: Test Installer

1. **Manual Testing**
   ```powershell
   # Verify checksum
   .\scripts\verify-checksum.ps1 `
     -File "BioDockViz-Setup-1.0.0.exe" `
     -ChecksumFile "BioDockViz-Setup-1.0.0.exe.sha256"
   ```

2. **Install on Clean VM**
   - Run installer
   - Verify installation completes
   - Test application launch
   - Test basic functionality
   - Test uninstaller

3. **Functional Testing**
   - Upload PDB file
   - View 3D visualization
   - Test interactions
   - Export snapshot
   - Test all view modes
   - Test all color schemes

### Step 4: Create GitHub Release

1. **Merge Release Branch**
   ```bash
   # Merge to main
   git checkout main
   git merge release/v1.0.0
   git push origin main
   ```

2. **Create and Push Tag**
   ```bash
   # Create annotated tag
   git tag -a v1.0.0 -m "BioDockViz v1.0.0 - Initial Release"
   
   # Push tag (triggers CI/CD)
   git push origin v1.0.0
   ```

3. **GitHub Actions will automatically:**
   - Build Windows installer
   - Build Docker images
   - Generate checksums
   - Create GitHub release
   - Upload artifacts

4. **Manual Steps on GitHub:**
   - Go to [Releases](https://github.com/biodockviz/biodockviz/releases)
   - Edit the auto-created release
   - Verify release notes from `RELEASE_NOTES.md`
   - Add any additional notes
   - Mark as "Latest Release"

### Step 5: Publish Docker Images

```bash
# Tag images
docker tag biodockviz/backend:latest biodockviz/backend:1.0.0
docker tag biodockviz/frontend:latest biodockviz/frontend:1.0.0

# Push to Docker Hub (done automatically by CI/CD)
docker push biodockviz/backend:latest
docker push biodockviz/backend:1.0.0
docker push biodockviz/frontend:latest
docker push biodockviz/frontend:1.0.0
```

### Step 6: Announce Release

1. **Update Website**
   - Update download links
   - Add release announcement
   - Update documentation

2. **Social Media**
   - Twitter/X announcement
   - LinkedIn post
   - Reddit (r/bioinformatics, r/chemistry)

3. **Email**
   - Newsletter to subscribers
   - Notify beta testers
   - Email announcement list

4. **Community**
   - Discord announcement
   - GitHub Discussions post
   - Update README badges

## Post-Release

### Verification

- [ ] Download installer from GitHub Releases
- [ ] Verify checksum matches
- [ ] Test installation on fresh system
- [ ] Verify Docker images work
- [ ] Check all download links

### Monitoring

- [ ] Monitor error reports (Sentry)
- [ ] Watch GitHub Issues for bug reports
- [ ] Monitor download statistics
- [ ] Check user feedback

### Documentation

- [ ] Archive release documentation
- [ ] Update roadmap
- [ ] Plan next release

## Hotfix Process

If a critical bug is found after release:

1. **Create Hotfix Branch**
   ```bash
   git checkout -b hotfix/v1.0.1 v1.0.0
   ```

2. **Fix Bug**
   - Make minimal changes
   - Update version to v1.0.1
   - Update CHANGELOG

3. **Test Thoroughly**
   - Verify fix works
   - Ensure no regressions

4. **Release**
   - Follow release process above
   - Tag as v1.0.1
   - Merge to main

## Version Numbering

BioDockViz follows [Semantic Versioning](https://semver.org/):

- **Major** (1.x.x): Breaking changes, major features
- **Minor** (x.1.x): New features, backwards compatible
- **Patch** (x.x.1): Bug fixes, backwards compatible

### Examples

- `v1.0.0` - Initial release
- `v1.0.1` - Bug fix
- `v1.1.0` - New feature (e.g., new file format support)
- `v2.0.0` - Breaking change (e.g., API redesign)

## Release Cadence

- **Major releases**: Once per year
- **Minor releases**: Every 2-3 months
- **Patch releases**: As needed for critical bugs

## Support

For questions about the release process:
- Contact: release@biodockviz.ai
- Slack: #releases channel
- Documentation: https://biodockviz.ai/docs/releases
