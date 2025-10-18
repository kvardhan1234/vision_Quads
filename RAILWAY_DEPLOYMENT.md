# Railway Deployment Guide for LearnHub LMS

## Prerequisites
- GitHub repository: https://github.com/kvardhan1234/vision_Quads
- Railway account: https://railway.app

---

## Step 1: Make Repository Public

Your repository **must be public** for Railway to access it:

1. Go to: https://github.com/kvardhan1234/vision_Quads/settings
2. Scroll to **Danger Zone**
3. Click **Change visibility** → **Make public**
4. Type repository name to confirm

---

## Step 2: Connect Railway to GitHub

1. Go to https://railway.app/new
2. Click **Deploy from GitHub repo**
3. If you don't see repositories:
   - Click **Configure GitHub App**
   - Select **All repositories** or choose `vision_Quads`
   - Click **Install & Authorize**

---

## Step 3: Create Backend Service

### Deploy Backend
1. In Railway, click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose `kvardhan1234/vision_Quads`
4. Railway will auto-detect Node.js

### Set Root Directory (Important!)
1. Click on the deployed service
2. Go to **Settings** tab
3. Find **Root Directory**
4. Set to: `lms-backend`
5. Click **Save**

### Configure Environment Variables
1. Click **Variables** tab
2. Add the following variables:

```
PORT=5000
NODE_ENV=production
DB_HOST=<your-mysql-host>
DB_PORT=3306
DB_NAME=lms_database
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
```

**Note:** Railway doesn't provide free MySQL. You'll need to:
- Use Railway MySQL plugin ($5/month)
- Or use external MySQL (e.g., PlanetScale, AWS RDS)

### Add MySQL Plugin (Option 1)
1. Click **New** → **Database** → **Add MySQL**
2. Railway will auto-populate database variables
3. Backend will automatically connect

### Use External MySQL (Option 2 - Free)
**Recommended: PlanetScale (Free tier)**

1. Sign up at: https://planetscale.com
2. Create database: `lms_database`
3. Get connection details
4. Add to Railway variables

---

## Step 4: Create Frontend Service

### Deploy Frontend
1. In same Railway project, click **New**
2. Select **GitHub Repo** → `vision_Quads`
3. Railway auto-detects

### Set Root Directory
1. Click on frontend service
2. Go to **Settings**
3. Set **Root Directory** to: `lms-portal`

### Configure Build Command
1. In **Settings** → **Build**
2. Set **Build Command**: `npm run build`
3. Set **Start Command**: `npm run preview` or use serve:

Install serve first (optional):
```json
// Add to lms-portal/package.json scripts:
"preview": "vite preview --host --port $PORT"
```

### Environment Variables
1. Click **Variables** tab
2. Add:
```
VITE_API_URL=<your-backend-url>
```

Get backend URL from Railway (e.g., `https://lms-backend-production.up.railway.app`)

---

## Step 5: Update Frontend API Calls

After deployment, update API URLs in frontend:

1. Create `lms-portal/.env.production`:
```
VITE_API_URL=https://your-backend-url.railway.app
```

2. Update API calls to use environment variable:
```javascript
// In components, replace:
const API_URL = process.env.VITE_API_URL || 'http://localhost:5000';
fetch(`${API_URL}/api/login`, ...)
```

---

## Step 6: Deploy

1. Commit and push changes:
```bash
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

2. Railway will auto-deploy on push!

---

## Troubleshooting

### Repository Not Showing in Railway

**Cause:** Repository is private

**Solution:**
1. Make repository public (see Step 1)
2. Or grant Railway access:
   - Railway Settings → Integrations → GitHub
   - Configure GitHub App
   - Select specific repositories

### Build Fails

**Check:**
1. Root directory is set correctly
2. Dependencies are in package.json
3. Build logs in Railway dashboard

### Database Connection Error

**Solutions:**
1. Verify environment variables
2. Check database host allows external connections
3. For PlanetScale: Use SSL connection string

### CORS Errors After Deployment

**Already Fixed!** The code now handles production CORS:
```javascript
origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || '*'
    : ['http://localhost:5173', ...]
```

Add `FRONTEND_URL` variable in backend with your Railway frontend URL.

---

## Alternative: Deploy Backend Only

If you only want to deploy the backend:

1. Frontend stays on Vercel/Netlify
2. Update frontend .env:
```
VITE_API_URL=https://your-railway-backend.up.railway.app
```

---

## Free Alternatives to Railway MySQL

### 1. PlanetScale (Recommended)
- Free tier: 5GB storage
- Serverless MySQL
- https://planetscale.com

### 2. Clever Cloud
- Free MySQL addon
- https://www.clever-cloud.com

### 3. Aiven
- Free trial, then $10/month
- https://aiven.io

---

## Quick Deployment Checklist

- [ ] Repository is public
- [ ] Railway connected to GitHub
- [ ] Backend service created with root: `lms-backend`
- [ ] Backend environment variables set
- [ ] MySQL database configured
- [ ] Frontend service created with root: `lms-portal`
- [ ] Frontend environment variables set
- [ ] API URL updated in frontend
- [ ] CORS configured for production
- [ ] Code pushed to GitHub
- [ ] Deployment successful

---

## Railway Configuration Files Added

✅ `railway.json` - Main Railway config  
✅ `Procfile` - Start command  
✅ `lms-backend/railway.json` - Backend config  
✅ `.railwayignore` - Files to ignore  
✅ Updated CORS in `server.js`

---

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

---

**Last Updated:** October 2025
