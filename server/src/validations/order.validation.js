import { z } from 'zod';

const orderItemSchema = z.object({
  product: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive()
});

const shippingAddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  pinCode: z.string().min(1, 'Pin code is required')
});

export const createOrderSchema = z.object({
  products: z.array(orderItemSchema).min(1, 'At least one product is required'),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.string().optional()
});
