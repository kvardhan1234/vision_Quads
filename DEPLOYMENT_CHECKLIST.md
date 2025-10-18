# 🚀 Railway Deployment Checklist

## ✅ Pre-Deployment Steps

- [ ] Repository is public: https://github.com/kvardhan1234/vision_Quads/settings
- [ ] Railway account created: https://railway.app
- [ ] GitHub connected to Railway
- [ ] MySQL database ready (PlanetScale recommended for free tier)

---

## 📋 Backend Deployment Steps

### 1. Create Railway Project
- [ ] Go to https://railway.app/new
- [ ] Click "Deploy from GitHub repo"
- [ ] Select `kvardhan1234/vision_Quads`

### 2. Configure Backend Service
- [ ] Click on the deployed service
- [ ] Go to **Settings** tab
- [ ] Set **Root Directory** to: `lms-backend`
- [ ] Save and wait for redeploy

### 3. Add Database

**Option A: Railway MySQL ($5/month)**
- [ ] Click "New" → "Database" → "MySQL"
- [ ] Variables auto-populate

**Option B: PlanetScale (FREE - Recommended)**
- [ ] Sign up: https://planetscale.com
- [ ] Create database: `lms_database`
- [ ] Get connection string
- [ ] Add to Railway variables (next step)

### 4. Set Environment Variables
- [ ] Go to **Variables** tab
- [ ] Add the following:

```
NODE_ENV=production
PORT=5000

# If using external MySQL (PlanetScale)
DB_HOST=aws.connect.psdb.cloud
DB_PORT=3306
DB_NAME=lms_database
DB_USER=your-username
DB_PASSWORD=your-password

# Optional for CORS
FRONTEND_URL=https://your-frontend-url.com
```

### 5. Generate Domain
- [ ] Go to **Settings** → **Networking** → **Public Networking**
- [ ] Click **"Generate Domain"**
- [ ] Copy your backend URL (e.g., `https://vision-quads-production.up.railway.app`)

### 6. Test Backend
- [ ] Open: `https://your-backend-url/health`
- [ ] Should see: `{"status":"OK","database":"MySQL - Connected"}`

✅ **Backend Deployed Successfully!**

---

## 🎨 Frontend Deployment Steps

### Option A: Deploy to Vercel (Recommended)

- [ ] Go to https://vercel.com
- [ ] Click "New Project"
- [ ] Import `kvardhan1234/vision_Quads`
- [ ] Set **Root Directory**: `lms-portal`
- [ ] Add **Environment Variable**:
  ```
  VITE_API_URL=https://your-backend-url.railway.app
  ```
- [ ] Click **Deploy**

### Option B: Deploy to Railway

- [ ] In Railway project, click "New"
- [ ] Select "GitHub Repo" → `vision_Quads`
- [ ] Set **Root Directory**: `lms-portal`
- [ ] Set **Build Command**: `npm run build`
- [ ] Set **Start Command**: `npm run preview`
- [ ] Add **Environment Variable**:
  ```
  VITE_API_URL=https://your-backend-url.railway.app
  ```
- [ ] Deploy

### Option C: Use Locally

- [ ] Update `.env.production` with backend URL
- [ ] Run: `npm run build`
- [ ] Run: `npm run preview`

---

## 🔒 Database Setup (PlanetScale - FREE)

### Create PlanetScale Database

1. **Sign up:** https://planetscale.com/sign-up
2. **Create Organization** (if first time)
3. **Click "New database"**
4. **Name:** `lms_database`
5. **Region:** Choose closest to you
6. **Click "Create database"**

### Get Connection Details

1. Click **"Connect"**
2. Select **"Node.js"** or **"General"**
3. Copy these values:
   - Host: `aws.connect.psdb.cloud`
   - Username: `xxxxxx`
   - Password: `pscale_pw_xxxxxxx`
   - Database: `lms_database`

### Add to Railway

1. Go to Railway backend service
2. Click **"Variables"**
3. Add:
   ```
   DB_HOST=aws.connect.psdb.cloud
   DB_USER=your-planetscale-username
   DB_PASSWORD=pscale_pw_xxxxxxxxx
   DB_NAME=lms_database
   DB_PORT=3306
   ```

---

## 🧪 Testing Deployment

### Backend Tests
- [ ] Health check: `https://your-backend.railway.app/health`
- [ ] Test endpoint: `https://your-backend.railway.app/api/test`
- [ ] Check logs in Railway dashboard for errors

### Frontend Tests
- [ ] Open frontend URL
- [ ] Test teacher login: `vardhan1@gmail.com` / `pass123`
- [ ] Test student login: `vardhan@gmail.com` / `pass123`
- [ ] Create a course
- [ ] Enroll in course
- [ ] Submit assignment
- [ ] Check all features work

### Integration Tests
- [ ] Student can register
- [ ] Teacher can create course
- [ ] File uploads work
- [ ] Assignment submission works
- [ ] Grading works
- [ ] Events display correctly

---

## 🐛 Troubleshooting

### Issue: "Repository not found"
**Solution:** Make repository public at GitHub settings

### Issue: "Build failed"
**Solution:** 
- Check root directory is set correctly
- Verify package.json exists in root directory
- Check build logs in Railway

### Issue: "Database connection error"
**Solution:**
- Verify environment variables are correct
- For PlanetScale: Ensure SSL is enabled (default in code)
- Check database is running

### Issue: "CORS error"
**Solution:**
- Add `FRONTEND_URL` variable to backend
- Check CORS configuration in server.js (already updated)

### Issue: "Port already in use"
**Solution:**
- Railway automatically assigns PORT, don't hardcode it
- Use: `process.env.PORT || 5000`

---

## 💰 Cost Breakdown

### Free Tier
- **Railway:** $5 credit/month (enough for 1 small app)
- **PlanetScale:** 5GB storage, 1 billion row reads/month
- **Vercel:** Unlimited deployments, 100GB bandwidth

### Paid (if needed)
- **Railway MySQL:** $5/month
- **PlanetScale Scaler:** $29/month (if exceeding free tier)
- **Vercel Pro:** $20/month (optional, for more bandwidth)

---

## 📝 Environment Variables Summary

### Backend (Railway)
```bash
NODE_ENV=production
PORT=5000                    # Auto-set by Railway
DB_HOST=aws.connect.psdb.cloud
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=lms_database
DB_PORT=3306
FRONTEND_URL=https://your-frontend.vercel.app  # Optional
```

### Frontend (Vercel/Railway)
```bash
VITE_API_URL=https://your-backend.railway.app
```

---

## 🎯 Quick Links

- **GitHub Repo:** https://github.com/kvardhan1234/vision_Quads
- **Railway:** https://railway.app
- **PlanetScale:** https://planetscale.com
- **Vercel:** https://vercel.com

---

## ✅ Final Checklist

- [ ] Repository is public
- [ ] Backend deployed to Railway
- [ ] Database configured (PlanetScale or Railway MySQL)
- [ ] Environment variables set
- [ ] Backend domain generated and tested
- [ ] Frontend deployed (Vercel/Railway) or configured locally
- [ ] Frontend environment variables set
- [ ] All features tested and working
- [ ] CORS configured correctly
- [ ] File uploads working
- [ ] Database tables created automatically

---

## 🎉 Deployment Complete!

Your LearnHub LMS is now live and accessible worldwide!

**Backend URL:** `https://your-backend.railway.app`  
**Frontend URL:** `https://your-frontend.vercel.app`

---

**Need Help?**
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- PlanetScale Docs: https://planetscale.com/docs

**Last Updated:** October 2025
