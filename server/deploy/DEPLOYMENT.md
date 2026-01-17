# Backend Deployment Guide - DigitalOcean Droplet

This guide walks you through deploying the NestJS backend to a DigitalOcean droplet with CI/CD.

## Prerequisites

- DigitalOcean droplet (Ubuntu 22.04 or later recommended)
- SSH access to your droplet
- GitHub repository with your code
- **Cloud PostgreSQL database** (DigitalOcean Managed Database, AWS RDS, or similar) with connection URL/credentials

## Step 1: Initial Server Setup

### 1.1 Connect to your droplet

```bash
ssh root@your-droplet-ip
```

### 1.2 Update system packages

```bash
apt update && apt upgrade -y
```

### 1.3 Install Node.js 20.x

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version  # Should show v20.x.x
npm --version
```

### 1.4 Install PM2 (Process Manager)

```bash
npm install -g pm2
pm2 startup  # Follow the instructions to enable PM2 on system startup
```

### 1.5 Install Nginx (Reverse Proxy)

```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

### 1.6 Install Git

```bash
apt install -y git
```

## Step 2: Application Setup

### 2.1 Create application directory

```bash
mkdir -p /var/www/right-care-finder-api
mkdir -p /var/backups/right-care-finder-api
mkdir -p /var/www/right-care-finder-api/logs
chown -R $USER:$USER /var/www/right-care-finder-api
```

### 2.2 Clone repository

```bash
cd /var/www/right-care-finder-api
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .
# Or if you need to clone only the server directory:
# git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git /tmp/repo
# cp -r /tmp/repo/server/* /var/www/right-care-finder-api/
```

### 2.3 Configure environment variables (via GitHub Secrets)

**No need to SSH into the server!** The `.env` file will be created automatically from GitHub Secrets during deployment.

You'll add these secrets in **Step 4.3**, but here's what you need to prepare:

**Required Secrets:**

- `DB_HOST` - Your cloud database host (e.g., `db-postgresql-lon1-12345.db.ondigitalocean.com`)
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name
- `DATABASE_URL` - Full connection string (e.g., `postgresql://user:pass@host:5432/dbname?sslmode=require`)
- `JWT_SECRET` - A long, random secret key for JWT tokens (generate one: `openssl rand -base64 32`)

**Optional Secrets (with defaults):**

- `PORT` - Server port (defaults to `4001` if not set)
- `DB_PORT` - Database port (defaults to `5432` if not set)
- `TYPEORM_LOGGING` - Set to `true` or `false` (defaults to `false`)

**Note:**

- The `.env` file will be automatically created on the server during the first deployment
- You never need to manually SSH in to create or edit the `.env` file
- If you need to update environment variables, just update the GitHub Secrets and redeploy

### 2.4 Initial setup (Optional - for testing)

**Note:** This step is optional. The first deployment via GitHub Actions will handle building and starting the app automatically. However, if you want to test locally on the server first:

```bash
cd /var/www/right-care-finder-api
npm ci --only=production
npm run build
npm run migration:run
pm2 start deploy/ecosystem.config.js
pm2 save
```

**Recommended:** Skip to Step 3 (Nginx setup) and let the first GitHub Actions deployment handle everything automatically!

**Note:** This is only needed for the **initial setup**. After this, CI/CD will handle all deployments automatically.

```bash
pm2 start deploy/ecosystem.config.js
pm2 save
pm2 status
```

**After initial setup:** All future deployments happen automatically via GitHub Actions when you push to `main` branch. You don't need to run PM2 commands manually.

## Step 3: Configure Nginx

### 3.1 Create Nginx configuration

```bash
nano /etc/nginx/sites-available/right-care-finder-api
```

Copy the contents from `deploy/nginx.conf.example` and update:

- Replace `api.yourdomain.com` with your actual domain or IP
- Adjust any other settings as needed

### 3.2 Enable the site

```bash
ln -s /etc/nginx/sites-available/right-care-finder-api /etc/nginx/sites-enabled/
nginx -t  # Test configuration
systemctl reload nginx
```

### 3.3 (Optional) Set up SSL with Let's Encrypt

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d api.yourdomain.com
```

Follow the prompts. Certbot will automatically update your Nginx configuration.

## Step 4: Configure GitHub Actions CI/CD

### 4.1 Generate SSH key for deployment

On your **local machine** or **server**:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

**Don't set a passphrase** (or GitHub Actions won't be able to use it).

### 4.2 Add public key to server

```bash
cat ~/.ssh/github_actions_deploy.pub
```

Copy the output, then on your **server**:

```bash
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Paste the public key, save and exit
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 4.3 Add GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

**Add deployment secrets (for SSH access):**

1. **DROPLET_HOST**: Your droplet's IP address (e.g., `123.45.67.89`)
2. **DROPLET_USER**: SSH username (usually `root` or your user)
3. **DROPLET_SSH_KEY**: The **private** key content (`~/.ssh/github_actions_deploy`)
   ```bash
   cat ~/.ssh/github_actions_deploy
   # Copy the entire output including -----BEGIN and -----END lines
   ```
4. **DROPLET_PORT**: SSH port (usually `22`, optional)

**Add environment variable secrets (for .env file):**

5. **DB_HOST**: Your cloud database host
6. **DB_USERNAME**: Database username
7. **DB_PASSWORD**: Database password
8. **DB_DATABASE**: Database name
9. **DATABASE_URL**: Full connection string (e.g., `postgresql://user:pass@host:5432/dbname?sslmode=require`)
10. **JWT_SECRET**: A long, random secret key (generate: `openssl rand -base64 32`)

**Optional environment secrets:** 11. **PORT**: Server port (defaults to `4001`) 12. **DB_PORT**: Database port (defaults to `5432`) 13. **TYPEORM_LOGGING**: `true` or `false` (defaults to `false`)

**Important:** These secrets will automatically create the `.env` file on your server during deployment. No manual SSH needed!

### 4.4 Update workflow file

Edit `.github/workflows/deploy-backend.yml` and ensure the paths and commands are correct for your setup.

## Step 5: Test Deployment

### 5.1 Manual test (Initial Setup)

```bash
# On server
cd /var/www/right-care-finder-api
pm2 logs right-care-finder-api
# Check for any errors

# Test API endpoint
curl http://localhost:4001/api
```

### 5.2 Test CI/CD (Automatic Deployments)

**After initial setup, all deployments are automatic!**

1. Make a small change to the server code
2. Commit and push to `main` branch
3. Go to GitHub → Actions tab
4. Watch the workflow run automatically
5. The workflow will:
   - Test your code
   - Deploy to your server
   - Restart PM2 automatically
   - Verify the deployment

**You don't need to SSH into the server or run any commands manually!** 🎉

## Step 6: Firewall Configuration

```bash
# Allow SSH
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable
ufw status
```

## Monitoring and Maintenance

### View application logs

```bash
pm2 logs right-care-finder-api
pm2 logs right-care-finder-api --lines 100  # Last 100 lines
```

### Restart application

```bash
pm2 restart right-care-finder-api
```

### Stop application

```bash
pm2 stop right-care-finder-api
```

### View PM2 status

```bash
pm2 status
pm2 info right-care-finder-api
```

### Monitor resources

```bash
pm2 monit
```

## Troubleshooting

### Application won't start

1. Check logs: `pm2 logs right-care-finder-api`
2. Verify environment variables: `cat .env`
3. Check database connection
4. Verify port is not in use: `netstat -tulpn | grep 4001`

### Database connection issues

1. Verify your cloud database is accessible and running (check your database provider dashboard)
2. Test connection from server:
   ```bash
   # Install PostgreSQL client if needed
   apt install -y postgresql-client
   # Test connection (replace with your actual credentials)
   psql -h your-cloud-db-host.com -U your_db_username -d your_database_name
   ```
3. Check firewall rules - ensure your droplet IP is whitelisted in your cloud database's allowed IPs
4. Verify credentials in `.env` match your cloud database
5. Check SSL requirements - most cloud databases require SSL (already configured in code)
6. Verify network connectivity: `ping your-cloud-db-host.com`

### Nginx issues

1. Test configuration: `nginx -t`
2. Check error logs: `tail -f /var/log/nginx/error.log`
3. Verify Nginx is running: `systemctl status nginx`

### CI/CD deployment fails

1. Check GitHub Actions logs
2. Verify SSH key is correctly added
3. Test SSH connection manually
4. Check server disk space: `df -h`
5. Verify Node.js version on server matches requirements

## Security Best Practices

1. **Keep system updated**: `apt update && apt upgrade -y`
2. **Use strong passwords** for database and JWT secrets
3. **Restrict SSH access**: Consider using key-based auth only
4. **Regular backups**: Set up automated backups for database
5. **Monitor logs**: Regularly check application and system logs
6. **Use SSL/HTTPS**: Always use Let's Encrypt for production
7. **Environment variables**: Never commit `.env` file to git

## Backup Strategy

### Database backup

**Note:** Most cloud database providers (DigitalOcean, AWS RDS, etc.) offer automated backups. Check your provider's dashboard for backup settings.

**Manual backup (optional - for additional safety):**

```bash
# Install PostgreSQL client if not already installed
apt install -y postgresql-client

# Create backup script
nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/database"
DATE=$(date +%Y%m%d-%H%M%S)
mkdir -p $BACKUP_DIR

# Load environment variables
source /var/www/right-care-finder-api/.env

# Backup using connection string or individual credentials
if [ ! -z "$DATABASE_URL" ]; then
    pg_dump "$DATABASE_URL" > $BACKUP_DIR/backup-$DATE.sql
else
    pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_DATABASE > $BACKUP_DIR/backup-$DATE.sql
fi

# Keep only last 7 days
find $BACKUP_DIR -name "backup-*.sql" -mtime +7 -delete
```

```bash
chmod +x /usr/local/bin/backup-db.sh
# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-db.sh
```

**Important:** Make sure your droplet's IP is whitelisted in your cloud database's firewall/security settings for backups to work.

## Next Steps

- Set up monitoring (e.g., PM2 Plus, or external monitoring service)
- Configure log rotation
- Set up automated database backups
- Configure domain DNS to point to your droplet
- Set up SSL certificate renewal reminders
