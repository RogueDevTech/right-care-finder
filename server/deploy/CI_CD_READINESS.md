# CI/CD Readiness Checklist

## ✅ Code Setup Status

### CI/CD Workflow File
- [x] **Workflow file exists:** `.github/workflows/deploy-backend.yml`
- [x] **Triggers configured:** Push to `main` branch when `server/**` changes
- [x] **Test job:** Runs lint, build, and tests
- [x] **Deploy job:** Only runs after tests pass
- [x] **Environment file creation:** Automatically creates `.env` from secrets
- [x] **PM2 integration:** Properly configured to restart/start app
- [x] **Deployment verification:** Checks if deployment succeeded

### Supporting Files
- [x] **PM2 config:** `server/deploy/ecosystem.config.js`
- [x] **Deployment script:** `server/deploy/deploy.sh` (optional, for manual deploys)
- [x] **Documentation:** All guides created

---

## ⚠️ What's Missing (Required Before First Deployment)

### 1. GitHub Secrets (Required)
You need to add these secrets in GitHub before the workflow can run:

**Deployment Secrets:**
- [ ] `DROPLET_HOST` - Your droplet IP
- [ ] `DROPLET_USER` - SSH username
- [ ] `DROPLET_SSH_KEY` - Private SSH key

**Environment Secrets:**
- [ ] `DB_HOST` - Database host
- [ ] `DB_USERNAME` - Database username
- [ ] `DB_PASSWORD` - Database password
- [ ] `DB_DATABASE` - Database name
- [ ] `DATABASE_URL` - Connection string
- [ ] `JWT_SECRET` - Generate with `openssl rand -base64 32`

**See:** `GITHUB_SECRETS.md` for detailed instructions

---

### 2. Server Setup (Required)
Your DigitalOcean droplet needs to be set up:

- [ ] Node.js 20.x installed
- [ ] PM2 installed globally
- [ ] Nginx installed and configured
- [ ] Git installed
- [ ] Repository cloned to `/var/www/right-care-finder-api`
- [ ] SSH key added to server (for GitHub Actions)
- [ ] PM2 startup configured

**See:** `DEPLOYMENT.md` Steps 1-3 for detailed instructions

---

## 🎯 Current Status

### ✅ Ready (Code)
- Workflow file is properly configured
- All paths and commands are correct
- Will work once secrets and server are set up

### ⏳ Pending (Setup)
- GitHub Secrets need to be added
- Server needs initial setup
- First deployment will fail until both are done

---

## 🚀 How to Complete Setup

### Step 1: Add GitHub Secrets (15 minutes)
1. Go to: GitHub repo → Settings → Secrets and variables → Actions
2. Add all required secrets (see `GITHUB_SECRETS.md`)
3. Generate SSH key: `ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy`
4. Add public key to server's `~/.ssh/authorized_keys`

### Step 2: Set Up Server (20 minutes)
1. Follow `DEPLOYMENT.md` Steps 1-3
2. Install Node.js, PM2, Nginx
3. Clone repository to `/var/www/right-care-finder-api`
4. Configure Nginx

### Step 3: Test Deployment
1. Make a small change to server code
2. Push to `main` branch
3. Watch GitHub Actions → Workflows tab
4. Verify deployment succeeds

---

## ✅ CI/CD Will Work When:

1. ✅ All GitHub Secrets are added
2. ✅ Server is set up and repository is cloned
3. ✅ SSH key is configured (public key on server, private key in GitHub Secrets)
4. ✅ You push to `main` branch

---

## 🔍 Quick Test

**To verify your CI/CD is ready:**

1. **Check workflow file exists:**
   ```bash
   ls -la .github/workflows/deploy-backend.yml
   ```

2. **Check if secrets are added:**
   - Go to: GitHub repo → Settings → Secrets and variables → Actions
   - You should see at least 9 secrets listed

3. **Test workflow syntax:**
   - Go to: GitHub repo → Actions tab
   - The workflow should appear in the list
   - You can manually trigger it with "Run workflow" button (will fail until secrets/server are set up)

---

## 📊 Readiness Score

**Code Configuration:** ✅ 100% Ready  
**GitHub Secrets:** ⏳ 0% (Need to add)  
**Server Setup:** ⏳ 0% (Need to set up)  

**Overall:** ⏳ **Ready to configure, but needs setup before first deployment**

---

## 🆘 Common Issues

**"Workflow runs but fails"**
- Check if all GitHub Secrets are added
- Verify server is set up and repository is cloned
- Check GitHub Actions logs for specific errors

**"Can't connect to server"**
- Verify `DROPLET_HOST`, `DROPLET_USER`, `DROPLET_SSH_KEY` are correct
- Test SSH manually: `ssh -i ~/.ssh/github_actions_deploy root@YOUR_IP`
- Make sure public key is in server's `authorized_keys`

**"Environment variables missing"**
- Verify all database secrets are added
- Check secret names match exactly (case-sensitive)
- Review workflow logs to see which secret is missing
