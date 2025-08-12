#!/bin/bash

# Deploy script for Vercel
echo "🚀 Starting deployment..."

# Check if we're using the correct Node version
if ! node --version | grep -q "v20"; then
    echo "❌ Error: Node.js v20 is required. Current version: $(node --version)"
    echo "Please switch to Node.js v20 using: nvm use 20"
    exit 1
fi

# Clean install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run type check
echo "🔍 Running type check..."
npm run type-check

# Run linting
echo "🧹 Running linting..."
npm run lint

# Build the project
echo "🏗️ Building project..."
npm run build

echo "✅ Build completed successfully!"
echo "🚀 Ready for deployment!"
