#!/bin/bash

# Photo Gallery Deployment Script for GitHub Pages
# This script helps you deploy your photo gallery to GitHub Pages

echo "🚀 Photo Gallery Deployment Script"
echo "=================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Check if there are any changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    # Commit changes
    echo "💾 Committing changes..."
    read -p "Enter commit message (or press Enter for default): " commit_message
    if [ -z "$commit_message" ]; then
        commit_message="Update photo gallery"
    fi
    git commit -m "$commit_message"
    echo "✅ Changes committed"
fi

# Check if remote origin exists
if ! git remote get-url origin &> /dev/null; then
    echo "🔗 Setting up GitHub remote..."
    read -p "Enter your GitHub username: " github_username
    read -p "Enter your repository name (default: photo-gallery): " repo_name
    if [ -z "$repo_name" ]; then
        repo_name="photo-gallery"
    fi
    
    git remote add origin "https://github.com/$github_username/$repo_name.git"
    echo "✅ Remote origin set to: https://github.com/$github_username/$repo_name.git"
    echo ""
    echo "📝 Next steps:"
    echo "1. Create a repository named '$repo_name' on GitHub"
    echo "2. Run this script again to push your code"
    echo "3. Enable GitHub Pages in your repository settings"
    exit 0
fi

# Set main branch
echo "🌿 Setting up main branch..."
git branch -M main

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo "=================================="
    echo ""
    echo "📋 Next steps to enable GitHub Pages:"
    echo "1. Go to your GitHub repository"
    echo "2. Click on 'Settings' tab"
    echo "3. Scroll down to 'Pages' section"
    echo "4. Under 'Source', select 'Deploy from a branch'"
    echo "5. Choose 'main' branch and '/ (root)' folder"
    echo "6. Click 'Save'"
    echo ""
    echo "🌐 Your gallery will be available at:"
    remote_url=$(git remote get-url origin)
    github_username=$(echo $remote_url | sed 's/.*github.com[:/]\([^/]*\)\/.*/\1/')
    repo_name=$(echo $remote_url | sed 's/.*\/\([^/]*\)\.git/\1/')
    echo "   https://$github_username.github.io/$repo_name"
    echo ""
    echo "⏱️  Note: It may take a few minutes for GitHub Pages to deploy your site."
else
    echo "❌ Push failed. Please check your GitHub credentials and repository settings."
    echo ""
    echo "💡 Troubleshooting tips:"
    echo "1. Make sure the repository exists on GitHub"
    echo "2. Check your GitHub username and repository name"
    echo "3. Ensure you have push permissions to the repository"
    echo "4. Try: git remote -v to verify your remote URL"
fi
