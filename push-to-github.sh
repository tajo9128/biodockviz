#!/bin/bash
# BioDockViz - Automated GitHub Push Script (Linux/Mac)
# Usage: ./push-to-github.sh "Your commit message"

MESSAGE="${1:-Update BioDockViz}"
BRANCH="${2:-main}"

echo "====================================="
echo "BioDockViz GitHub Push Automation"
echo "====================================="

# Configure git
echo "Configuring git..."
git config user.name "tajo9128"
git config user.email "tajo9128@gmail.com"

# Check remote
if ! git remote get-url origin &>/dev/null; then
    echo "Adding remote..."
    git remote add origin https://github.com/tajo9128/biodockviz.git
fi

echo "Remote: $(git remote get-url origin)"

# Check for changes
echo ""
echo "Checking for changes..."
if [[ -z $(git status --porcelain) ]]; then
    echo "No changes to commit"
    git push origin $BRANCH
    exit 0
fi

# Show changes
echo "Changes detected:"
git status --short

# Add all changes
echo ""
echo "Adding all changes..."
git add .

# Commit
echo "Committing changes..."
git commit -m "$MESSAGE"

# Push
echo "Pushing to GitHub..."
if git push origin $BRANCH; then
    echo ""
    echo "✓ Successfully pushed to GitHub!"
    echo "View at: https://github.com/tajo9128/biodockviz"
else
    echo ""
    echo "⚠ Push failed. You may need to pull first:"
    echo "  git pull origin $BRANCH"
fi
