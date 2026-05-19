# 🚀 Vercel Deployment Guide

This guide will help you deploy your E-Commerce platform to Vercel in minutes.

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account** - Your code should be in a GitHub repository
3. **MongoDB Atlas** - Your database (already configured)
4. **Cloudinary Account** - For image uploads (already configured)

---

## 🎯 Deployment Strategy

We'll deploy **TWO separate projects** on Vercel:

1. **Backend API** (Express server) - One Vercel project
2. **Frontend** (Next.js client) - Another Vercel project

---

## 📦 Part 1: Deploy Backend API

### Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Project"**
3. Select your GitHub repository
4. **Configure Project**:
   - **Project Name**: `ecommerce-api` (or any name you like)
   - **Framework Preset**: Other
   - **Root Directory**: Leave as `.` (root)
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty

5. **Add Environment Variables** (Click "Environment Variables"):
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb://mahsan8040_db_user:WY2L3PR6J0FBxtDz@ac-zvpnr8z-shard-00-00.w9a0jfc.mongodb.net:27017,ac-zvpnr8z-shard-00-01.w9a0jfc.mongodb.net:27017,ac-zvpnr8z-shard-00-02.w9a0jfc.mongodb.net:27017/nova-ecommerce?ssl=true&replicaSet=atlas-13lhdo-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=QuAAsj3ibQAWFjJsI8AwhMgrJWIxmyBQ7ZvQ0GWUbKo
   CLOUDINARY_CLOUD_NAME=ddqkerghb
   CLOUDINARY_API_KEY=146934112144917
   CLOUDINARY_API_SECRET=p-zIpaFf8Q5OP3Mni4CZ-DdoT84
   CLIENT_URL=https://YOUR_FRONTEND_URL.vercel.app
   ```
   
   **Note**: You'll update `CLIENT_URL` after deploying the frontend

6. Click **"Deploy"**

7. **Copy your API URL** (e.g., `https://ecommerce-api.vercel.app`)

---

## 🎨 Part 2: Deploy Frontend (Next.js)

### Step 1: Update Frontend Environment Variable

Before deploying, you need to update the API URL in your frontend.

**Option A: Using Vercel Dashboard (Recommended)**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Project"**
3. Select your GitHub repository again
4. **Configure Project**:
   - **Project Name**: `ecommerce-frontend` (or any name)
   - **Framework Preset**: Next.js
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. **Add Environment Variable**:
   ```
   NEXT_PUBLIC_API_URL=https://YOUR_BACKEND_URL.vercel.app/api
   ```
   Replace `YOUR_BACKEND_URL` with your actual backend URL from Part 1

6. Click **"Deploy"**

**Option B: Update .env.local file**

Edit `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://YOUR_BACKEND_URL.vercel.app/api
```

Then commit and push:
```bash
git add client/.env.local
git commit -m "Update API URL for production"
git push
```

### Step 2: Update Backend CLIENT_URL

Now that you have your frontend URL, update the backend:

1. Go to your **backend project** on Vercel dashboard
2. Go to **Settings** → **Environment Variables**
3. Edit `CLIENT_URL` and set it to your frontend URL:
   ```
   CLIENT_URL=https://YOUR_FRONTEND_URL.vercel.app
   ```
4. Click **"Save"**
5. Go to **Deployments** tab
6. Click the **three dots** on the latest deployment
7. Click **"Redeploy"**

---

## ✅ Verification

### Test Your Deployment

1. **Visit your frontend URL**: `https://YOUR_FRONTEND_URL.vercel.app`
2. **Test registration**: Create a new account
3. **Test login**: Login with your account
4. **Test products**: Browse products
5. **Test cart**: Add items to cart
6. **Test checkout**: Place an order
7. **Test admin**: Login as admin and manage products

### Check API Health

Visit: `https://YOUR_BACKEND_URL.vercel.app/api/health`

You should see:
```json
{
  "status": "ok",
  "message": "API is running"
}
```

---

## 🔧 Troubleshooting

### Issue: API not responding

**Solution**: Check Vercel logs
1. Go to your backend project on Vercel
2. Click **"Deployments"**
3. Click on the latest deployment
4. Check the **"Logs"** tab for errors

### Issue: CORS errors

**Solution**: Make sure `CLIENT_URL` in backend matches your frontend URL exactly

### Issue: Database connection failed

**Solution**: 
1. Check if `MONGO_URI` is correctly set in Vercel environment variables
2. Make sure your MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
3. Go to MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere

### Issue: Images not uploading

**Solution**: Check Cloudinary credentials in Vercel environment variables

### Issue: Frontend can't connect to backend

**Solution**: 
1. Check `NEXT_PUBLIC_API_URL` in frontend environment variables
2. Make sure it includes `/api` at the end
3. Make sure it uses `https://` not `http://`

---

## 🔄 Continuous Deployment

Once set up, Vercel will automatically deploy when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push

# Vercel will automatically deploy both frontend and backend!
```

---

## 📝 Environment Variables Summary

### Backend Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
CLIENT_URL=<your-frontend-url>
```

### Frontend Environment Variables
```env
NEXT_PUBLIC_API_URL=<your-backend-url>/api
```

---

## 🎉 You're Done!

Your E-Commerce platform is now live on Vercel!

**Frontend**: `https://YOUR_FRONTEND_URL.vercel.app`
**Backend API**: `https://YOUR_BACKEND_URL.vercel.app/api`

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

## 🆘 Need Help?

If you encounter any issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Make sure MongoDB Atlas allows connections from anywhere
