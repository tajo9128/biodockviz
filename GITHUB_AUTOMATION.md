# BioDockViz GitHub Automation Guide

## 🚀 Quick Start

### One-Click Push (Easiest!)
Double-click `quick-push.ps1` or run:
```powershell
.\quick-push.ps1
```

### Custom Commit Message
```powershell
.\push-to-github.ps1 -Message "Add new feature"
```

## 📋 Available Scripts

### 1. `setup-github.ps1` - Initial Setup
Run this **once** when setting up the repository for the first time.

```powershell
.\setup-github.ps1
```

**What it does:**
- Configures git with your credentials
- Adds GitHub remote
- Creates initial commit
- Pushes to GitHub

### 2. `quick-push.ps1` - Quick Updates
For daily updates. Just double-click or run it!

```powershell
.\quick-push.ps1
```

**What it does:**
- Adds all changes
- Commits with timestamp
- Pushes to GitHub
- Shows success message

### 3. `push-to-github.ps1` - Full Control
For detailed commits with custom messages.

```powershell
# Basic usage
.\push-to-github.ps1 -Message "Add documentation"

# Force push (use with caution!)
.\push-to-github.ps1 -Message "Fix bug" -Force

# Push to different branch
.\push-to-github.ps1 -Message "Feature update" -Branch "develop"
```

**Parameters:**
- `-Message` - Custom commit message (required)
- `-Force` - Force push to remote (overwrites remote changes)
- `-Branch` - Target branch (default: main)

### 4. `push-to-github.sh` - Linux/Mac Version
Same as `push-to-github.ps1` but for Unix systems.

```bash
chmod +x push-to-github.sh
./push-to-github.sh "Your commit message"
```

## 🔧 Git Configuration

### Already Configured
```
User: tajo9128
Email: tajo9128@gmail.com
Remote: https://github.com/tajo9128/biodockviz.git
Branch: main
```

### Manual Git Commands (if needed)

```powershell
# Add remote
git remote add origin https://github.com/tajo9128/biodockviz.git

# Configure user
git config user.name "tajo9128"
git config user.email "tajo9128@gmail.com"

# Check status
git status

# Add files
git add .

# Commit
git commit -m "Your message"

# Push
git push origin main
```

## 📚 Common Workflows

### Daily Updates
```powershell
# Just double-click quick-push.ps1!
# Or run:
.\quick-push.ps1
```

### Feature Development
```powershell
# Make changes to code
# ...

# Commit and push
.\push-to-github.ps1 -Message "Add molecular analysis feature"
```

### Release Preparation
```powershell
# Update version numbers
# Update CHANGELOG.md
# Update RELEASE_NOTES.md

# Commit changes
.\push-to-github.ps1 -Message "Prepare v1.0.0 release"

# Create tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

## ⚠️ Troubleshooting

### Push Fails - Pull Required
```powershell
# Pull changes first
git pull origin main

# Then push
.\push-to-github.ps1 -Message "Update after pull"
```

### Push Fails - Diverged History
```powershell
# Option 1: Pull and merge
git pull origin main --allow-unrelated-histories
git push origin main

# Option 2: Force push (WARNING: overwrites remote!)
.\push-to-github.ps1 -Message "Force update" -Force
```

### Authentication Issues
If GitHub asks for credentials, you have two options:

**Option 1: Personal Access Token (Recommended)**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` permissions
3. Use token as password when prompted

**Option 2: SSH Keys**
```powershell
# Generate SSH key
ssh-keygen -t ed25519 -C "tajo9128@gmail.com"

# Add SSH remote
git remote set-url origin git@github.com:tajo9128/biodockviz.git
```

### Remote Already Exists
```powershell
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/tajo9128/biodockviz.git
```

## 🔄 Automated Workflows

### GitHub Actions
The repository includes automated workflows in `.github/workflows/`:

- **Release Workflow** - Automatically builds installers and Docker images when you push a version tag
- **CI/CD** - Runs tests and builds on every push

### Triggering Release Build
```powershell
# Commit changes
.\push-to-github.ps1 -Message "Prepare release"

# Create and push tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# GitHub Actions will automatically:
# 1. Build Windows installer
# 2. Build Docker images  
# 3. Generate checksums
# 4. Create GitHub release
```

## 📊 Repository Status

### View Repository
🌐 https://github.com/tajo9128/biodockviz

### Check Remote
```powershell
git remote -v
```

### View Commit History
```powershell
git log --oneline --graph
```

### View Changes
```powershell
git status
git diff
```

## 💡 Best Practices

1. **Commit Often** - Small, focused commits are better
2. **Descriptive Messages** - Write clear commit messages
3. **Pull Before Push** - Always pull latest changes first
4. **Test Locally** - Test changes before pushing
5. **Use Quick Push** - For small daily updates
6. **Use Custom Messages** - For important features

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Quick push | `.\quick-push.ps1` |
| Custom commit | `.\push-to-github.ps1 -Message "..."` |
| Force push | `.\push-to-github.ps1 -Message "..." -Force` |
| Initial setup | `.\setup-github.ps1` |
| View remote | `git remote -v` |
| View status | `git status` |
| Pull changes | `git pull origin main` |
| Create tag | `git tag -a v1.0.0 -m "..."` |

## 📞 Support

- **Repository**: https://github.com/tajo9128/biodockviz
- **Issues**: https://github.com/tajo9128/biodockviz/issues
- **Email**: tajo9128@gmail.com

---

**Happy Coding! 🧬✨**
