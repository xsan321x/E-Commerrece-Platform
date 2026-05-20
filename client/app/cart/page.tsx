'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const [hasInvalidProducts, setHasInvalidProducts] = useState(false);

  // Check for invalid product IDs on mount
  useEffect(() => {
    const invalidProducts = items.filter(item => {
      const id = item.product._id;
      return !id || typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id);
    });

    if (invalidProducts.length > 0) {
      setHasInvalidProducts(true);
      console.warn('Invalid products found in cart:', invalidProducts.map(p => ({
        id: p.product._id,
        title: p.product.title
      })));
    }
  }, [items]);

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout', { duration: 3000 });
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <ShoppingBag className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some products to get started
            </p>
            <Link href="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

          {/* Invalid Products Warning */}
          {hasInvalidProducts && (
            <Card className="mb-6 border-yellow-500 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-900 mb-1">
                      Invalid Products Detected
                    </h3>
                    <p className="text-sm text-yellow-800 mb-3">
                      Some products in your cart have invalid IDs and cannot be checked out. 
                      This usually happens with old cached data. Please clear your cart and add products again from the products page.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        clearCart();
                        toast.success('Cart cleared. Please add products again from the products page.', { duration: 4000 });
                        setHasInvalidProducts(false);
                      }}
                      className="bg-yellow-100 hover:bg-yellow-200 border-yellow-600 text-yellow-900"
                    >
                      Clear Cart Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.product._id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {item.product.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.product.brand}
                        </p>
                        <p className="text-lg font-bold">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            removeItem(item.product._id);
                            toast.success('Removed from cart', { duration: 2000 });
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.product._id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const maxQuantity = Math.min(item.product.stock, 20);
                              if (item.quantity >= maxQuantity) {
                                toast.error(`Maximum ${maxQuantity} items allowed per product`, { duration: 2000 });
                                return;
                              }
                              updateQuantity(item.product._id, item.quantity + 1);
                            }}
                            disabled={item.quantity >= Math.min(item.product.stock, 20)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleCheckout}
                    disabled={hasInvalidProducts}
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      clearCart();
                      toast.success('Cart cleared', { duration: 2000 });
                      setHasInvalidProducts(false);
                    }}
                  >
                    Clear Cart
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
