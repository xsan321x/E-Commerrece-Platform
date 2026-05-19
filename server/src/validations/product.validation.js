import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  category: z.enum(['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Books', 'Toys', 'Other']),
  brand: z.string().min(2, 'Brand must be at least 2 characters'),
  images: z.array(z.string().url()).min(1, 'At least one image is required')
});

export const updateProductSchema = createProductSchema.partial();

export const addReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional()
});
