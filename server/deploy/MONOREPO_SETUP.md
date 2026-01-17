# Monorepo Setup Instructions

Since this is a monorepo, we need to deploy only the `server` directory, not the entire repository.

## Initial Server Setup (One-Time)

### 1. Install Dependencies

```bash
ssh -i ~/.ssh/github_actions_deploy root@YOUR_DROPLET_IP
```

Then run:

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2
pm2 startup

# Install Nginx
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# Install Git
apt install -y git

# Install rsync (for efficient file syncing)
apt install -y rsync
```

### 2. Clone Repository and Copy Server Directory

```bash
# Create directories
mkdir -p /var/www/right-care-finder-api
mkdir -p /tmp/right-care-finder-repo

# Clone the entire repository to temp location
cd /tmp
git clone https://github.com/RogueDevTech/right-care-finder.git right-care-finder-repo
cd right-care-finder-repo
git checkout main

# Copy only the server directory to app directory
rsync -av server/ /var/www/right-care-finder-api/ --exclude='.git' --exclude='node_modules' --exclude='dist'

# Set permissions
chown -R $USER:$USER /var/www/right-care-finder-api
```

## How CI/CD Works

The CI/CD workflow now:
1. ✅ Clones the entire repo to `/tmp/right-care-finder-repo` (for git operations)
2. ✅ Uses `rsync` to copy only the `server/` directory to `/var/www/right-care-finder-api/`
3. ✅ Excludes `.git` and `node_modules` to save space
4. ✅ Runs npm install, build, and deployment

## Benefits

- ✅ Only server code is deployed (not frontend)
- ✅ Efficient updates (rsync only syncs changed files)
- ✅ Clean deployment directory (no monorepo structure)
- ✅ Works with existing PM2 and npm scripts

## After Initial Setup

Once set up, the CI/CD will automatically:
- Pull latest code from GitHub
- Sync only the server directory
- Deploy and restart the application

No manual intervention needed! 🎉
