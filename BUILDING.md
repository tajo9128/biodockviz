# Building BioDockViz

This guide explains how to build BioDockViz from source.

## Prerequisites

### Windows Installer Build

- **Windows 10/11** (x64)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Python 3.11+** - [Download](https://www.python.org/)
- **NSIS 3.x** - [Download](https://nsis.sourceforge.io/Download)
- **Git** - [Download](https://git-scm.com/)

### Docker Build

- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
- **Docker Compose** - Included with Docker Desktop

## Building the Windows Installer

### Quick Build

```powershell
# Clone repository
git clone https://github.com/biodockviz/biodockviz.git
cd biodockviz

# Run build script
.\scripts\build-installer.ps1
```

### Clean Build

```powershell
# Clean previous builds and rebuild
.\scripts\build-installer.ps1 -Clean
```

### Build Output

The build process creates:
- `BioDockViz-Setup-1.0.0.exe` - Windows installer
- `BioDockViz-Setup-1.0.0.exe.sha256` - SHA256 checksum
- `BioDockViz-Setup-1.0.0.exe.md5` - MD5 checksum

### Manual Build Steps

If you prefer to build manually:

#### 1. Build Frontend

```powershell
cd frontend
npm ci
npm run build
npm run export
cd ..
```

#### 2. Package Backend

```powershell
cd backend
pip install -r requirements.txt
pip install pyinstaller
pyinstaller --clean --onefile --name BioDockViz __init__.py
cd ..
```

#### 3. Build Installer

```powershell
# Ensure NSIS is in PATH or use full path
"C:\Program Files (x86)\NSIS\makensis.exe" installer.nsi
```

#### 4. Generate Checksums

```powershell
.\scripts\generate-checksums.ps1 -File "BioDockViz-Setup-1.0.0.exe"
```

## Building Docker Images

### Development Build

```bash
# Build all services
docker-compose build

# Start services
docker-compose up
```

### Production Build

```bash
# Build backend
docker build -t biodockviz/backend:latest ./backend

# Build frontend
docker build -t biodockviz/frontend:latest ./frontend

# Run with docker-compose
docker-compose -f docker-compose.yml up -d
```

### Multi-platform Build

```bash
# Setup buildx
docker buildx create --use

# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -t biodockviz/backend:latest ./backend --push
docker buildx build --platform linux/amd64,linux/arm64 -t biodockviz/frontend:latest ./frontend --push
```

## Development Build

For development and testing:

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.__init__:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`

## Verifying Builds

### Verify Installer Checksum

```powershell
# Verify SHA256
.\scripts\verify-checksum.ps1 `
  -File "BioDockViz-Setup-1.0.0.exe" `
  -ChecksumFile "BioDockViz-Setup-1.0.0.exe.sha256"
```

### Test Installer

1. Run installer on a clean Windows VM
2. Verify installation completes successfully
3. Launch BioDockViz from Start Menu
4. Test file upload and visualization
5. Test uninstaller

### Test Docker Images

```bash
# Test backend
docker run --rm -p 8000:8000 biodockviz/backend:latest

# Test frontend
docker run --rm -p 3000:3000 biodockviz/frontend:latest

# Test full stack
docker-compose up
```

## Troubleshooting

### NSIS Build Fails

- Ensure NSIS is installed correctly
- Check that all required files exist in the project
- Verify file paths in `installer.nsi`

### Frontend Build Fails

```bash
# Clear cache and rebuild
rm -rf frontend/.next frontend/node_modules
cd frontend
npm ci
npm run build
```

### Backend Build Fails

```bash
# Clear cache and rebuild
rm -rf backend/dist backend/build
cd backend
pip install --upgrade pip
pip install -r requirements.txt
```

### Docker Build Fails

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

## CI/CD

The project includes GitHub Actions workflows for automated builds:

- **Release Workflow** - `.github/workflows/release.yml`
  - Triggered on version tags (`v*.*.*`)
  - Builds installer and Docker images
  - Creates GitHub release with artifacts

### Creating a Release

```bash
# Create and push version tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# GitHub Actions will automatically:
# 1. Build Windows installer
# 2. Build Docker images
# 3. Generate checksums
# 4. Create GitHub release
# 5. Upload artifacts
```

## Build Artifacts

After a successful build, you'll have:

### Windows Installer
- `BioDockViz-Setup-1.0.0.exe` (~50-100 MB)
- `BioDockViz-Setup-1.0.0.exe.sha256`
- `BioDockViz-Setup-1.0.0.exe.md5`
- `BioDockViz-Setup-1.0.0.exe.checksums.txt`

### Docker Images
- `biodockviz/backend:latest`
- `biodockviz/backend:1.0.0`
- `biodockviz/frontend:latest`
- `biodockviz/frontend:1.0.0`

## Next Steps

After building:

1. **Test thoroughly** - Run all test suites
2. **Verify checksums** - Ensure integrity
3. **Create release** - Tag and publish on GitHub
4. **Update documentation** - Ensure all docs are current
5. **Announce release** - Notify users and community

## Support

If you encounter build issues:
- Check [Troubleshooting](#troubleshooting) section above
- Review [GitHub Issues](https://github.com/biodockviz/issues)
- Contact support@biodockviz.ai
