# Connect Frontend to New API

Your new API is working perfectly at: **https://e-commerrece-api.vercel.app/api**

## Quick Steps to Connect Frontend

### Step 1: Update Frontend Environment Variable on Vercel

1. Go to: https://vercel.com/dashboard
2. Click on your **frontend project** (e-commerrece-platform)
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar
5. Find `NEXT_PUBLIC_API_URL` variable
6. Click **Edit** (pencil icon)
7. Change the value to:
   ```
   https://e-commerrece-api.vercel.app/api
   ```
8. Click **Save**
9. Click **Redeploy** button (or go to Deployments tab → click ⋯ menu → Redeploy)

### Step 2: Update Backend Environment Variable on Vercel

1. Go to: https://vercel.com/dashboard
2. Click on your **backend project** (e-commerrece-api)
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar
5. Find `CLIENT_URL` variable
6. Click **Edit** (pencil icon)
7. Change the value to:
   ```
   https://e-commerrece-platform.vercel.app
   ```
   ⚠️ **IMPORTANT:** NO `/api` at the end for CLIENT_URL!
8. Click **Save**
9. Click **Redeploy** button

### Step 3: Wait for Deployments

- Both projects will redeploy automatically
- Wait 2-3 minutes for deployments to complete
- Check deployment status in Vercel dashboard

### Step 4: Clear Your Browser Cart

Once deployments are complete:

1. Go to: https://e-commerrece-platform.vercel.app/cart
2. You should see a **yellow warning banner** (from the fix we just deployed)
3. Click **"Clear Cart Now"** button
4. Cart will be empty

### Step 5: Test the Complete Flow

1. **Go to Products Page**
   - URL: https://e-commerrece-platform.vercel.app/products
   - You should see all 11 products

2. **Add Products to Cart**
   - Click "Add to Cart" on any product
   - Check cart icon - should show item count

3. **View Cart**
   - Go to cart page
   - Should NOT show any warning (products have valid IDs)
   - Should see your products

4. **Checkout**
   - Click "Proceed to Checkout"
   - Fill in shipping address
   - Click "Place Order"
   - Should work without "Cast to ObjectId" error!

5. **View Orders**
   - Go to: https://e-commerrece-platform.vercel.app/orders
   - Should see your new order

---

## Environment Variables Summary

### Frontend (e-commerrece-platform)
```env
NEXT_PUBLIC_API_URL=https://e-commerrece-api.vercel.app/api
```

### Backend (e-commerrece-api)
```env
CLIENT_URL=https://e-commerrece-platform.vercel.app
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
```

---

## Troubleshooting

### If products don't load:
1. Check browser console for errors (F12 → Console tab)
2. Check Network tab - look for API calls to `e-commerrece-api.vercel.app`
3. Verify environment variable is set correctly in Vercel
4. Make sure you redeployed after changing environment variable

### If checkout still fails:
1. Make sure you cleared the cart completely
2. Add products fresh from the products page
3. Check browser console for the product IDs - they should be 24-character hex strings
4. If you see simple numbers like "3", clear browser localStorage:
   - F12 → Application tab → Local Storage → Clear

### If CORS errors appear:
1. Make sure backend `CLIENT_URL` is set to `https://e-commerrece-platform.vercel.app`
2. Make sure backend is redeployed after changing CLIENT_URL
3. Check backend logs in Vercel for CORS errors

---

## What Changed?

### Old Setup (Not Working)
- Backend: `https://e-commerrece-adnhtsx9d-xsan321xs-projects.vercel.app/api`
- Frontend: `https://e-commerrece-platform.vercel.app`
- Issue: Old API URL, cart had invalid product IDs

### New Setup (Working)
- Backend: `https://e-commerrece-api.vercel.app/api` ✅
- Frontend: `https://e-commerrece-platform.vercel.app` ✅
- Fix: New API with valid product IDs, cart validation added

---

## Need Help?

If you encounter any issues:

1. Check `API_TEST_REPORT.md` - Confirms API is working
2. Check `FIX_CART_ISSUE.md` - Details about the cart validation fix
3. Check browser console for error messages
4. Check Vercel deployment logs for build errors

The API is confirmed working with valid product IDs. Once you update the environment variables and clear your cart, everything should work smoothly!
