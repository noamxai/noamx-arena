#!/bin/bash

# NoamX Arena Deployment Script
# This script prepares and deploys the NoamX Arena application

echo "🚀 Starting NoamX Arena deployment process..."

# Check if .env file exists
if [ ! -f .env ]; then
  echo "❌ Error: .env file not found. Please create one based on .env.example"
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests
echo "🧪 Running tests..."
npm test

# Check if tests passed
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Aborting deployment."
  exit 1
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Run database migrations
echo "🗃️ Running database migrations..."
npx prisma migrate deploy

# Check if deployment method is specified
if [ -z "$1" ]; then
  echo "ℹ️ No deployment method specified. Available options: vercel, docker, server"
  echo "ℹ️ Example usage: ./deploy.sh vercel"
  exit 0
fi

# Deploy based on specified method
case "$1" in
  vercel)
    echo "🔄 Deploying to Vercel..."
    npx vercel --prod
    ;;
  docker)
    echo "🐳 Building Docker image..."
    docker build -t noamx-arena .
    
    echo "🚢 Running Docker container..."
    docker run -d -p 3000:3000 --env-file .env --name noamx-arena noamx-arena
    
    echo "✅ Docker deployment complete. Application running at http://localhost:3000"
    ;;
  server)
    echo "🖥️ Deploying to server..."
    
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
      echo "📥 Installing PM2..."
      npm install -g pm2
    fi
    
    # Start or restart the application with PM2
    if pm2 list | grep -q "noamx-arena"; then
      echo "🔄 Restarting application with PM2..."
      pm2 restart noamx-arena
    else
      echo "▶️ Starting application with PM2..."
      pm2 start npm --name "noamx-arena" -- start
      pm2 save
    fi
    
    echo "✅ Server deployment complete."
    ;;
  *)
    echo "❌ Unknown deployment method: $1"
    echo "ℹ️ Available options: vercel, docker, server"
    exit 1
    ;;
esac

echo "✨ Deployment process completed successfully!"
echo "📝 See deployment documentation for post-deployment steps and monitoring setup."
