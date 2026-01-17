# GitHub Secrets Required for Deployment

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add each secret one by one using the "New repository secret" button.

---

## 🔐 Required Secrets (Must Have)

### Deployment Secrets (SSH Access)

#### 1. **DROPLET_HOST**
- **What it is:** Your DigitalOcean droplet's IP address
- **Example:** `123.45.67.89`
- **How to get it:** Check your DigitalOcean dashboard → Droplets → Your droplet → IP address
- **Required:** ✅ Yes

#### 2. **DROPLET_USER**
- **What it is:** SSH username for your droplet
- **Example:** `root` (or your custom user)
- **How to get it:** Usually `root` for new droplets, or the username you created
- **Required:** ✅ Yes

#### 3. **DROPLET_SSH_KEY**
- **What it is:** Your private SSH key (for GitHub Actions to SSH into your server)
- **Example:** 
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAACFwAAAAdzc2gtcn
  ... (entire key content) ...
  -----END OPENSSH PRIVATE KEY-----
  ```
- **How to get it:** 
  1. Generate SSH key: `ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy`
  2. Don't set a passphrase (press Enter when asked)
  3. Copy the private key: `cat ~/.ssh/github_actions_deploy`
  4. Copy the entire output including `-----BEGIN` and `-----END` lines
  5. Add the public key to your server's `~/.ssh/authorized_keys`
- **Required:** ✅ Yes

#### 4. **DROPLET_PORT** (Optional)
- **What it is:** SSH port number
- **Example:** `22`
- **Default:** `22` (if not set)
- **Required:** ❌ No (optional)

---

### Environment Variable Secrets (Database & App Config)

#### 5. **DB_HOST**
- **What it is:** Your cloud database hostname
- **Example:** `db-postgresql-lon1-12345.db.ondigitalocean.com`
- **How to get it:** From your database provider's dashboard (DigitalOcean, AWS RDS, etc.)
- **Required:** ✅ Yes

#### 6. **DB_USERNAME**
- **What it is:** Database username
- **Example:** `doadmin` or `postgres`
- **How to get it:** From your database provider's dashboard
- **Required:** ✅ Yes

#### 7. **DB_PASSWORD**
- **What it is:** Database password
- **Example:** `your_secure_password_here`
- **How to get it:** From your database provider's dashboard (or the one you set)
- **Required:** ✅ Yes

#### 8. **DB_DATABASE**
- **What it is:** Database name
- **Example:** `defaultdb` or `rightcarefinder`
- **How to get it:** From your database provider's dashboard
- **Required:** ✅ Yes

#### 9. **DATABASE_URL**
- **What it is:** Full PostgreSQL connection string
- **Example:** `postgresql://doadmin:password123@db-postgresql-lon1-12345.db.ondigitalocean.com:25060/defaultdb?sslmode=require`
- **Format:** `postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?sslmode=require`
- **How to get it:** 
  - Usually provided by your database provider
  - Or construct it: `postgresql://DB_USERNAME:DB_PASSWORD@DB_HOST:DB_PORT/DB_DATABASE?sslmode=require`
- **Required:** ✅ Yes

#### 10. **JWT_SECRET**
- **What it is:** Secret key for JWT token signing
- **Example:** `aB3xK9mP2qR7vT5wY8zN1cD4fG6hJ0lM3nQ9sU2vW5xY8zA1bC4dE7fG0hI3jK6lM9nO2pQ5rS8tU1vW4xY7zA0bC3dE6fG9hI2jK5lM8nO1pQ4rS7tU0vW3xY6z`
- **How to generate:** 
  ```bash
  openssl rand -base64 32
  ```
  Or use an online generator, but make it long and random (at least 32 characters)
- **Required:** ✅ Yes

---

## 🔧 Optional Secrets (Have Defaults)

#### 11. **PORT** (Optional)
- **What it is:** Port your NestJS app runs on
- **Example:** `4001`
- **Default:** `4001` (if not set)
- **Required:** ❌ No

#### 12. **DB_PORT** (Optional)
- **What it is:** Database port number
- **Example:** `5432` or `25060` (for DigitalOcean)
- **Default:** `5432` (if not set)
- **Required:** ❌ No

#### 13. **TYPEORM_LOGGING** (Optional)
- **What it is:** Enable/disable TypeORM query logging
- **Example:** `false` or `true`
- **Default:** `false` (if not set)
- **Required:** ❌ No

---

## 📋 Quick Checklist

Copy this checklist and check off each secret as you add it:

### Deployment Secrets
- [ ] `DROPLET_HOST` - Your droplet IP
- [ ] `DROPLET_USER` - SSH username (usually `root`)
- [ ] `DROPLET_SSH_KEY` - Private SSH key
- [ ] `DROPLET_PORT` - SSH port (optional, defaults to 22)

### Environment Secrets
- [ ] `DB_HOST` - Database hostname
- [ ] `DB_USERNAME` - Database username
- [ ] `DB_PASSWORD` - Database password
- [ ] `DB_DATABASE` - Database name
- [ ] `DATABASE_URL` - Full connection string
- [ ] `JWT_SECRET` - Generate with `openssl rand -base64 32`
- [ ] `PORT` - App port (optional, defaults to 4001)
- [ ] `DB_PORT` - Database port (optional, defaults to 5432)
- [ ] `TYPEORM_LOGGING` - Logging flag (optional, defaults to false)

---

## 🎯 Minimum Required (10 secrets)

If you want to get started quickly, these are the **minimum required**:

1. `DROPLET_HOST`
2. `DROPLET_USER`
3. `DROPLET_SSH_KEY`
4. `DB_HOST`
5. `DB_USERNAME`
6. `DB_PASSWORD`
7. `DB_DATABASE`
8. `DATABASE_URL`
9. `JWT_SECRET`

The optional ones (`PORT`, `DB_PORT`, `TYPEORM_LOGGING`, `DROPLET_PORT`) will use their defaults.

---

## 🔒 Security Notes

- **Never commit secrets to your repository**
- **Never share secrets publicly**
- **Rotate secrets periodically** (especially JWT_SECRET and DB_PASSWORD)
- **Use strong, random values** for JWT_SECRET
- **GitHub Secrets are encrypted** and only accessible during workflow runs

---

## 🆘 Troubleshooting

**Can't find your database credentials?**
- Check your database provider's dashboard
- Look for "Connection Details" or "Connection String"
- DigitalOcean: Databases → Your database → Connection Details

**SSH key not working?**
- Make sure you added the **public key** to your server's `~/.ssh/authorized_keys`
- Make sure the **private key** is in GitHub Secrets
- Test SSH manually: `ssh -i ~/.ssh/github_actions_deploy root@YOUR_DROPLET_IP`

**Deployment failing?**
- Check GitHub Actions logs
- Verify all required secrets are set
- Make sure secret names match exactly (case-sensitive)

