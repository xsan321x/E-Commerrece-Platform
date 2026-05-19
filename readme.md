# 🛍️ LUXE — Premium E-Commerce Platform

> 🚀 A full-stack, production-grade e-commerce experience built with modern web technologies.  
> 💡 Designed for speed, scalability, and stunning UX.

---

## ✨ Features

### 🛒 User Features
| Feature | Description |
|---|---|
| 🔍 Product Browsing | Advanced filtering, sorting & pagination |
| 🖼️ Product Details | Image galleries, reviews & star ratings |
| 🛒 Shopping Cart | Persistent cart state via Zustand |
| 💳 Secure Checkout | Address management & payment integration |
| 📦 Order History | Real-time order tracking |
| 👤 User Profile | Avatar, address & account settings |
| 💖 Wishlist | One-click save & manage favorites |
| 🔔 Notifications | Order status & promotional alerts |

### ⚙️ Admin Features
| Feature | Description |
|---|---|
| 📊 Dashboard | Revenue, orders & user analytics |
| 📦 Product CRUD | Full product management with image upload |
| 📋 Order Management | Status updates & delivery tracking |
| 👥 User Management | View & manage registered users |

---

## 🛠 Tech Stack

### 🎨 Frontend
| Technology | Purpose |
|---|---|
| ⚛️ Next.js 15 | React framework with App Router |
| 🔷 TypeScript | Type safety at scale |
| 🎨 Tailwind CSS | Utility-first CSS framework |
| 🧩 Shadcn UI | Accessible, pre-built components |
| 🐻 Zustand | Lightweight state management |
| ⚡ TanStack React Query | Data fetching & intelligent caching |
| 📋 React Hook Form + Zod | Forms & runtime validation |
| 🌊 Framer Motion | Smooth animations & transitions |
| 🎯 Lucide Icons | Beautiful, consistent icons |

### 🔙 Backend
| Technology | Purpose |
|---|---|
| 🟢 Node.js + Express | Server runtime & API framework |
| 🍃 MongoDB + Mongoose | NoSQL database & ODM |
| 🔐 JWT | Token-based authentication |
| 🔒 Bcrypt | Password hashing (12 rounds) |
| ☁️ Cloudinary | Image hosting & optimization |
| ✅ Zod | Endpoint validation |
| 🛡️ Helmet | Security headers |
| ⏱️ Express Rate Limit | API rate limiting |
| 🌐 CORS | Cross-origin request handling |

---

## 📁 Project Structure

```
e-commerce-app/
├── client/               # ⚛️ Next.js Frontend
│   ├── app/             # 📄 App Router pages
│   ├── components/      # 🧩 Reusable UI components
│   │   └── ui/          # 🎨 Shadcn UI base components
│   ├── lib/             # 🔌 API client, stores, utilities
│   │   ├── store/       # 🐻 Zustand stores
│   │   └── query/       # ⚡ React Query setup
│   ├── public/          # 🖼️ Static assets & images
│   └── types/           # 🔷 TypeScript definitions
│
├── server/              # 🟢 Express.js Backend
│   ├── src/
│   │   ├── config/      # ⚙️ Database & cloud config
│   │   ├── controllers/ # 🎮 Route handler logic
│   │   ├── middleware/  # 🛡️ Auth, validation, rate limiting
│   │   ├── models/      # 🍃 Mongoose schemas
│   │   ├── routes/      # 🛣️ API route definitions
│   │   └── validations/ # ✅ Zod schemas
│   ├── scripts/         # 📜 DB seeding scripts
│   └── server.js        # 🚀 Entry point
│
├── package.json
├── README.md
└── .gitignore
```

---

## ⚡ Getting Started

### 📋 Prerequisites
- ✅ Node.js >= 18
- ✅ MongoDB instance (local or Atlas)
- ✅ Cloudinary account (for image uploads)

### ⚙️ Environment Variables

#### 🖥️ Server — `.env`
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://mahsan8040_db_user:WY2L3PR6J0FBxtDz@cluster0.w9a0jfc.mongodb.net/
JWT_SECRET=QuAAsj3ibQAWFjJsI8AwhMgrJWIxmyBQ7ZvQ0GWUbKo
CLOUDINARY_CLOUD_NAME=ddqkerghb
CLOUDINARY_API_KEY=146934112144917
CLOUDINARY_API_SECRET=p-zIpaFf8Q5OP3Mni4CZ-DdoT84
```

#### 🌐 Client — `client/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 🔥 Run Development Servers

> **Terminal 1 — Backend**
```bash
npm run server
# or
nodemon server/server.js
```

> **Terminal 2 — Frontend**
```bash
cd client
npm run dev
```

> **🌐 Open** `http://localhost:3000` in your browser!

---

## 🔌 API Reference

### 🔑 Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/auth/logout` | Logout user |
| `GET` | `/api/auth/me` | Get current user |

### 📦 Products
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products (with filters) |
| `GET` | `/api/products/:id` | Get single product |
| `POST` | `/api/products` | Create product 🛡️ Admin only |
| `PUT` | `/api/products/:id` | Update product 🛡️ Admin only |
| `DELETE` | `/api/products/:id` | Delete product 🛡️ Admin only |
| `GET` | `/api/products/top-rated` | Get top-rated products |

### 📬 Orders
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders` | Create a new order |
| `GET` | `/api/orders/myorders` | Get user's order history |
| `GET` | `/api/orders/:id` | Get order details |
| `PUT` | `/api/orders/:id/pay` | Update payment status |
| `PUT` | `/api/orders/:id/deliver` | Mark as delivered 🛡️ Admin only |

### 👤 Users
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/profile` | Get user profile |
| `PUT` | `/api/users/profile` | Update user profile |

### 💖 Wishlist
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/wishlist` | Get wishlist items |
| `POST` | `/api/wishlist` | Add product to wishlist |
| `DELETE` | `/api/wishlist/:productId` | Remove from wishlist |

---

## 📜 Scripts

### 🖥️ Client
```bash
npm run dev      # Start Next.js dev server @ http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### 🟢 Server
```bash
npm run server   # Start Express server in dev mode (nodemon)
npm start        # Start production server
npm run seed     # Seed database with sample data
```

---

## 🔐 Security Features

| Feature | Implementation |
|---|---|
| 🔑 JWT Auth | Token-based stateless authentication |
| 🔒 Password Hashing | bcrypt with 12 salt rounds |
| ⏱️ Rate Limiting | Auth routes: 5 attempts / 15 min |
| 🛡️ Security Headers | Helmet.js for all API responses |
| 🌐 CORS | Whitelisted origin restrictions |
| ✅ Input Validation | Zod schemas on every endpoint |
| 👮 Admin Middleware | Role-based endpoint protection |

---

## 🏗️ Database Schema

### 👤 User
```javascript
{
  name:       String,
  email:      String (unique),
  password:   String (bcrypt hashed),
  role:       ['user' | 'admin'],
  avatar:     String,
  address:    {
    street,      city,     state,
    country,     pinCode
  },
  wishlist:   [ProductId]     // refs
}
```

### 📦 Product
```javascript
{
  title:       String,
  description: String,
  images:      [String],      // Cloudinary URLs
  price:       Number,
  stock:       Number,
  category:    String,
  brand:       String,
  ratings:     [{
    user:     UserId,
    rating:   Number (1–5),
    comment:  String
  }]
}
```

### 📬 Order
```javascript
{
  user:            UserId,
  products:        [{
    product:    ProductId,
    quantity:   Number,
    price:      Number
  }],
  totalAmount:     Number,
  paymentStatus:   ['pending' | 'paid' | 'failed'],
  orderStatus:     ['processing' | 'shipped' | 'delivered' | 'cancelled'],
  shippingAddress: AddressObject
}
```

---

## ⚡ Performance Optimizations

- 🖥️ SSR & SSG — Strategic use of Next.js rendering modes  
- 🖼️ Image Optimization — `next/image` + Cloudinary transformations  
- 📦 Code Splitting — Dynamic imports on all heavy components  
- ⚡ React Query Caching — `staleTime: 5min`, `cacheTime: 1hr`  
- 🐻 Zustand Persist — Cart & auth survive page reloads  
- 🔍 Debounced Search — Prevents excessive API calls  
- 📄 Pagination — Server-side on all product list endpoints  
- 🦴 Skeleton Loading — Smooth perceived performance

---

## 📦 Scripts Overview

| Script | Command | Description |
|---|---|---|
| 🖥️ `dev` | `npm run dev` | Start frontend + backend with hot reload |
| 🟢 `server` | `npm run server` | Start Express server (dev) |
| 🌱 `seed` | `npm run seed` | Seed database with sample data |
| 🛡️ `lint` | `npm run lint` (client) | Run ESLint on frontend |
| 🔨 `build` | `npm run build` (client) | Build for production |
| 🚀 `start` | `npm start` | Start production server |

---

## 🔒 Environment Variables Reference

### Server `.env`
| Variable | Description |
|---|---|
| `NODE_ENV` | Runtime environment (`development` / `production`) |
| `PORT` | Express server port (default: `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |

### Client `client/.env.local`
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

---

## 🚢 Deployment

### 🚀 Deploy to Vercel (Recommended)

This project is optimized for Vercel deployment. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed step-by-step instructions.

#### Quick Deploy Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Deploy Backend**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Set root directory to `.` (root)
   - Add environment variables (see below)
   - Deploy!

3. **Deploy Frontend**
   - Go to [vercel.com/new](https://vercel.com/new) again
   - Import same repository
   - Set root directory to `client`
   - Add `NEXT_PUBLIC_API_URL` environment variable
   - Deploy!

#### Environment Variables for Vercel

**Backend:**
```env
NODE_ENV=production
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
CLIENT_URL=<your-frontend-vercel-url>
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=<your-backend-vercel-url>/api
```

### 🏗️ Build for Production (Manual)
```bash
# Build the frontend
cd client && npm run build

# Start the production backend
cd .. && npm start
```

### ☁️ Production Environment
| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `CLIENT_URL` | Your frontend domain |
| `MONGO_URI` | Production MongoDB Atlas URI |
| Cloudinary vars | Production Cloudinary credentials |

---

## 🔮 Future Enhancements

- [ ] 💳 Stripe / PayPal payment integration
- [ ] 📧 Email notifications via Nodemailer
- [ ] 🔑 Password reset workflow
- [ ] ⭐ Product reviews & ratings UI
- [ ] 📊 Advanced analytics charts
- [ ] 🌍 Multi-language support (i18n)
- [ ] 📱 PWA features & offline support
- [ ] 📤 Product image upload via Multer
- [ ] 🌱 Database seeder script
- [ ] 🧪 Unit & integration test suite

---

## 🐛 Troubleshooting

| Issue | Solution |
|---|---|
| ❌ MongoDB connection error | Ensure MongoDB is running; verify `MONGO_URI` |
| 🖼️ Images not loading | Verify Cloudinary credentials in `.env` |
| 🏗️ Build errors | Delete `.next/` and run `npm run build` again |
| 🧹 Cache issues | Run `npm cache clean --force` |

---

## 👑 Admin Setup

Create an admin user via MongoDB shell:

```javascript
db.users.insertOne({
  name:  "Admin",
  email: "admin@luxe.com",
  password: "<bcrypt_hashed_password>",
  role:  "admin"
});
```

---

## 📄 License

This project is created for **educational purposes**.

### 💬 Support

For issues or questions, please open an issue on [GitHub](https://github.com/Siraut12321/E-Commers-App/issues).

---