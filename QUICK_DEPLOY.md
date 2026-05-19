# ⚡ Quick Deploy to Vercel

Deploy your e-commerce platform in 10 minutes!

## 🎯 What You Need

1. ✅ GitHub account
2. ✅ Vercel account (free) - [Sign up here](https://vercel.com/signup)
3. ✅ Your MongoDB URI
4. ✅ Your Cloudinary credentials

---

## 🚀 Deploy in 3 Steps

### Step 1: Push to GitHub (2 minutes)

```bash
# In your project folder
git init
git add .
git commit -m "Ready for deployment"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

### Step 2: Deploy Backend (3 minutes)

1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Click **"Import Project"** → Select your repo
3. **Configure**:
   - Name: `my-ecommerce-api`
   - Root Directory: `.` (root)
   - Framework: Other
4. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   CLOUDINARY_CLOUD_NAME=<your-name>
   CLOUDINARY_API_KEY=<your-key>
   CLOUDINARY_API_SECRET=<your-secret>
   CLIENT_URL=https://temp.vercel.app
   ```
5. Click **"Deploy"**
6. **Copy your backend URL** (e.g., `https://my-ecommerce-api.vercel.app`)

---

### Step 3: Deploy Frontend (3 minutes)

1. Go to **[vercel.com/new](https://vercel.com/new)** again
2. Click **"Import Project"** → Select SAME repo
3. **Configure**:
   - Name: `my-ecommerce-frontend`
   - Root Directory: `client` ⚠️ **IMPORTANT!**
   - Framework: Next.js (auto-detected)
4. **Add Environment Variable**:
   ```
   NEXT_PUBLIC_API_URL=https://YOUR_BACKEND_URL.vercel.app/api
   ```
   Replace `YOUR_BACKEND_URL` with your actual backend URL from Step 2
5. Click **"Deploy"**
6. **Copy your frontend URL** (e.g., `https://my-ecommerce-frontend.vercel.app`)

---

### Step 4: Update Backend (2 minutes)

1. Go to your **backend project** on Vercel
2. **Settings** → **Environment Variables**
3. Edit `CLIENT_URL` → Set to your frontend URL
4. **Deployments** → Click **"..."** → **"Redeploy"**

---

## ✅ Done!

Visit your frontend URL and test your app!

**Troubleshooting?** See [VERCEL_CHECKLIST.md](./VERCEL_CHECKLIST.md)

**Detailed Guide?** See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🔄 Future Updates

After initial deployment, just push to GitHub:

```bash
git add .
git commit -m "Your changes"
git push
```

Vercel will automatically redeploy both frontend and backend! 🎉
