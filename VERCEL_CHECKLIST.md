# ✅ Vercel Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel.

## 📋 Pre-Deployment Checklist

### ☐ 1. Code Preparation
- [ ] All code is committed to Git
- [ ] `.env` files are in `.gitignore` (they should NOT be committed)
- [ ] No console.log statements in production code (optional cleanup)
- [ ] All dependencies are in `package.json`
- [ ] Code builds successfully locally (`npm run build` in client folder)

### ☐ 2. GitHub Setup
- [ ] Code is pushed to GitHub repository
- [ ] Repository is public or you have Vercel access to private repos
- [ ] Main branch is up to date

### ☐ 3. Database Setup
- [ ] MongoDB Atlas cluster is created
- [ ] Database user is created with read/write permissions
- [ ] Network access allows connections from anywhere (0.0.0.0/0)
- [ ] Connection string is ready

### ☐ 4. Cloudinary Setup
- [ ] Cloudinary account is created
- [ ] Cloud name, API key, and API secret are ready
- [ ] Upload preset is configured (if needed)

---

## 🚀 Deployment Steps

### Part 1: Deploy Backend API

#### ☐ Step 1: Create Vercel Project
- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Click "Import Project"
- [ ] Select your GitHub repository
- [ ] Click "Import"

#### ☐ Step 2: Configure Backend Project
- [ ] **Project Name**: `your-project-api` (or any name)
- [ ] **Framework Preset**: Other
- [ ] **Root Directory**: `.` (leave as root)
- [ ] **Build Command**: Leave empty
- [ ] **Output Directory**: Leave empty
- [ ] **Install Command**: `npm install`

#### ☐ Step 3: Add Backend Environment Variables
Click "Environment Variables" and add these:

```
NODE_ENV=production
PORT=5000
MONGO_URI=<paste-your-mongodb-uri>
JWT_SECRET=<paste-your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<paste-cloudinary-name>
CLOUDINARY_API_KEY=<paste-cloudinary-key>
CLOUDINARY_API_SECRET=<paste-cloudinary-secret>
CLIENT_URL=https://TEMP_URL.vercel.app
```

**Note**: You'll update `CLIENT_URL` after deploying frontend

- [ ] All environment variables added
- [ ] No typos in variable names
- [ ] No extra spaces in values

#### ☐ Step 4: Deploy Backend
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete (2-3 minutes)
- [ ] Check deployment logs for errors
- [ ] Copy your backend URL (e.g., `https://your-project-api.vercel.app`)

#### ☐ Step 5: Test Backend API
- [ ] Visit: `https://your-backend-url.vercel.app/api/health`
- [ ] Should see: `{"status":"ok"}` or similar
- [ ] If error, check deployment logs

---

### Part 2: Deploy Frontend

#### ☐ Step 1: Create Frontend Project
- [ ] Go to [vercel.com/new](https://vercel.com/new) again
- [ ] Click "Import Project"
- [ ] Select the SAME GitHub repository
- [ ] Click "Import"

#### ☐ Step 2: Configure Frontend Project
- [ ] **Project Name**: `your-project-frontend` (or any name)
- [ ] **Framework Preset**: Next.js (should auto-detect)
- [ ] **Root Directory**: `client` ⚠️ IMPORTANT!
- [ ] **Build Command**: `npm run build`
- [ ] **Output Directory**: `.next`
- [ ] **Install Command**: `npm install`

#### ☐ Step 3: Add Frontend Environment Variable
Click "Environment Variables" and add:

```
NEXT_PUBLIC_API_URL=https://YOUR_BACKEND_URL.vercel.app/api
```

Replace `YOUR_BACKEND_URL` with your actual backend URL from Part 1

- [ ] Environment variable added
- [ ] URL includes `/api` at the end
- [ ] URL uses `https://` not `http://`

#### ☐ Step 4: Deploy Frontend
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete (3-5 minutes)
- [ ] Check deployment logs for errors
- [ ] Copy your frontend URL (e.g., `https://your-project-frontend.vercel.app`)

---

### Part 3: Update Backend with Frontend URL

#### ☐ Step 1: Update CLIENT_URL
- [ ] Go to your **backend project** on Vercel dashboard
- [ ] Click "Settings"
- [ ] Click "Environment Variables"
- [ ] Find `CLIENT_URL`
- [ ] Click "Edit"
- [ ] Update value to your frontend URL: `https://your-frontend-url.vercel.app`
- [ ] Click "Save"

#### ☐ Step 2: Redeploy Backend
- [ ] Go to "Deployments" tab
- [ ] Click the three dots (...) on latest deployment
- [ ] Click "Redeploy"
- [ ] Wait for redeployment to complete

---

## 🧪 Post-Deployment Testing

### ☐ Test Frontend
- [ ] Visit your frontend URL
- [ ] Page loads without errors
- [ ] No console errors (F12 → Console)
- [ ] Images load correctly
- [ ] Navigation works

### ☐ Test Authentication
- [ ] Can register a new account
- [ ] Can login with credentials
- [ ] Can logout
- [ ] Protected pages redirect to login when not authenticated

### ☐ Test Products
- [ ] Products page loads
- [ ] Product images display
- [ ] Can view product details
- [ ] Search works
- [ ] Filters work

### ☐ Test Cart & Checkout
- [ ] Can add items to cart
- [ ] Cart persists on page refresh
- [ ] Can update quantities
- [ ] Can remove items
- [ ] Can proceed to checkout
- [ ] Can place an order

### ☐ Test User Features
- [ ] Can view profile
- [ ] Can update profile
- [ ] Can view orders
- [ ] Can add to wishlist
- [ ] Can view wishlist

### ☐ Test Admin Features (if admin)
- [ ] Can access admin dashboard
- [ ] Can view statistics
- [ ] Can add products
- [ ] Can edit products
- [ ] Can delete products
- [ ] Can manage orders
- [ ] Can manage users

---

## 🐛 Troubleshooting

### Issue: Backend deployment failed
**Check:**
- [ ] Deployment logs for specific error
- [ ] All environment variables are set
- [ ] MongoDB URI is correct
- [ ] No syntax errors in code

### Issue: Frontend deployment failed
**Check:**
- [ ] Root directory is set to `client`
- [ ] `NEXT_PUBLIC_API_URL` is set correctly
- [ ] No build errors locally (`npm run build`)
- [ ] All dependencies are in `package.json`

### Issue: CORS errors
**Check:**
- [ ] `CLIENT_URL` in backend matches frontend URL exactly
- [ ] No trailing slash in URLs
- [ ] Backend was redeployed after updating `CLIENT_URL`

### Issue: API calls failing
**Check:**
- [ ] `NEXT_PUBLIC_API_URL` includes `/api` at the end
- [ ] Backend URL is correct
- [ ] Backend is deployed and running
- [ ] Network tab in browser (F12) shows actual error

### Issue: Database connection failed
**Check:**
- [ ] MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- [ ] Database user has correct permissions
- [ ] `MONGO_URI` is correct in Vercel environment variables
- [ ] No special characters in password (or properly encoded)

### Issue: Images not uploading
**Check:**
- [ ] Cloudinary credentials are correct
- [ ] All three Cloudinary variables are set
- [ ] No typos in variable names

---

## 📝 Important Notes

### Environment Variables
- ⚠️ Never commit `.env` files to Git
- ⚠️ Always use `NEXT_PUBLIC_` prefix for client-side variables
- ⚠️ Backend variables should NOT have `NEXT_PUBLIC_` prefix
- ⚠️ After changing environment variables, redeploy the project

### URLs
- ✅ Always use `https://` in production
- ✅ Include `/api` at the end of backend URL for frontend
- ✅ No trailing slashes in URLs
- ✅ Update `CLIENT_URL` in backend after deploying frontend

### Redeployment
- 🔄 Push to GitHub to trigger automatic redeployment
- 🔄 Or manually redeploy from Vercel dashboard
- 🔄 Always redeploy after changing environment variables

---

## 🎉 Success!

If all checkboxes are checked and tests pass, your app is successfully deployed!

**Your URLs:**
- 🌐 Frontend: `https://your-frontend-url.vercel.app`
- 🔌 Backend API: `https://your-backend-url.vercel.app/api`

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

**Need help?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
