import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/database.js';
import authRoutes from './src/routes/auth.routes.js';
import productRoutes from './src/routes/product.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import userRoutes from './src/routes/user.routes.js';
import wishlistRoutes from './src/routes/wishlist.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy - Required for Vercel deployment
// This allows Express to trust the X-Forwarded-* headers from Vercel's proxy
app.set('trust proxy', 1);

// Connect to MongoDB (non-blocking)
connectDB().catch(err => {
  console.log('⚠️  Running in DEMO MODE with mock data');
  console.log('⚠️  To use real database, fix MongoDB connection');
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'NOVA API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`📱 Frontend: ${process.env.CLIENT_URL}`);
});

