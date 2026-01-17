#!/bin/bash

# Deployment script for DigitalOcean droplet
# This script should be run on the server

set -e

echo "🚀 Starting deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/right-care-finder-api"
REPO_URL="https://github.com/RogueDevTech/right-care-finder"  # Update this
BRANCH="main"
BACKUP_DIR="/var/backups/right-care-finder-api"

# Create directories if they don't exist
echo -e "${YELLOW}📁 Creating directories...${NC}"
sudo mkdir -p $APP_DIR
sudo mkdir -p $BACKUP_DIR
sudo mkdir -p $APP_DIR/logs

# Backup current deployment
if [ -d "$APP_DIR/dist" ]; then
    echo -e "${YELLOW}💾 Creating backup...${NC}"
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
    sudo tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C $APP_DIR dist node_modules package*.json
    echo -e "${GREEN}✅ Backup created: $BACKUP_NAME${NC}"
fi

# Navigate to app directory
cd $APP_DIR

# Pull latest code
echo -e "${YELLOW}📥 Pulling latest code...${NC}"
if [ -d ".git" ]; then
    sudo git fetch origin
    sudo git reset --hard origin/$BRANCH
else
    echo -e "${RED}❌ Git repository not found. Please clone the repository first.${NC}"
    exit 1
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
sudo npm ci --only=production

# Build the application
echo -e "${YELLOW}🔨 Building application...${NC}"
sudo npm run build

# Run database migrations
echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
sudo npm run migration:run || echo -e "${YELLOW}⚠️  Migration failed or no migrations to run${NC}"

# Restart the application with PM2
echo -e "${YELLOW}🔄 Restarting application...${NC}"
if pm2 list | grep -q "right-care-finder-api"; then
    pm2 restart right-care-finder-api
else
    pm2 start deploy/ecosystem.config.js
fi

# Save PM2 configuration
pm2 save

# Show status
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo -e "${YELLOW}📊 Application status:${NC}"
pm2 status

echo -e "${GREEN}🎉 Deployment successful!${NC}"

