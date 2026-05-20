'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  pinCode: z.string().min(1, 'Pin code is required'),
});

type AddressForm = z.infer<typeof addressSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: user?.address || {},
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  const onSubmit = async (data: AddressForm) => {
    setIsLoading(true);
    try {
      // Validate product IDs before sending
      const invalidProducts = items.filter(item => {
        const id = item.product._id;
        // Check if it's a valid MongoDB ObjectId (24 hex characters)
        return !id || typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id);
      });

      if (invalidProducts.length > 0) {
        toast.error('Some products in your cart are invalid. Please clear your cart and add products again.', { duration: 5000 });
        console.error('Invalid product IDs:', invalidProducts.map(p => p.product._id));
        return;
      }

      const orderData = {
        products: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: data,
        paymentMethod: 'COD',
      };

      await api.post('/orders', orderData);
      clearCart();
      
      // Invalidate orders cache so new order appears immediately
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      
      toast.success('Order placed successfully!', { duration: 3000 });
      router.push('/orders');
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order', { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input id="street" {...register('street')} disabled={isLoading} />
                      {errors.street && (
                        <p className="text-sm text-red-500">{errors.street.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" {...register('city')} disabled={isLoading} />
                        {errors.city && (
                          <p className="text-sm text-red-500">{errors.city.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" {...register('state')} disabled={isLoading} />
                        {errors.state && (
                          <p className="text-sm text-red-500">{errors.state.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" {...register('country')} disabled={isLoading} />
                        {errors.country && (
                          <p className="text-sm text-red-500">{errors.country.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pinCode">Pin Code</Label>
                        <Input id="pinCode" {...register('pinCode')} disabled={isLoading} />
                        {errors.pinCode && (
                          <p className="text-sm text-red-500">{errors.pinCode.message}</p>
                        )}
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product._id} className="flex justify-between text-sm">
                      <span className="line-clamp-1">
                        {item.product.title} x {item.quantity}
                      </span>
                      <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
