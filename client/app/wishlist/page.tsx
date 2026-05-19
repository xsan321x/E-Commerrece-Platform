'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { useCartStore } from '@/lib/store/cartStore';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function WishlistPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const addItem = useCartStore((state) => state.addItem);
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      if (!user) return { products: [] }; // Return empty wishlist if no user
      console.log('[Wishlist] Fetching wishlist...');
      const response = await api.get('/wishlist');
      console.log('[Wishlist] Response:', response.data);
      // Backend returns: response.data.data.wishlist.products
      const wishlistData = response.data.data?.wishlist || { products: [] };
      console.log('[Wishlist] Wishlist data:', wishlistData);
      return wishlistData;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!user, // Only run query if user exists
    initialData: { products: [] }, // Provide initial data to prevent undefined
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      setDeletingId(productId);
      await api.delete(`/wishlist/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist', { duration: 2000 });
      setDeletingId(null);
    },
    onError: () => {
      toast.error('Failed to remove from wishlist', { duration: 3000 });
      setDeletingId(null);
    },
  });

  useEffect(() => {
    if (!user && !isRedirecting) {
      setIsRedirecting(true);
      router.push('/login');
    }
  }, [user, router, isRedirecting]);

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast.success('Added to cart!', { duration: 2000 });
  };

  const handleRemove = (productId: string) => {
    removeMutation.mutate(productId);
  };

  // Return null AFTER all hooks
  if (!user) {
    return null;
  }

  const products = wishlist?.products || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            <h1 className="text-4xl font-bold">My Wishlist</h1>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-64" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-1/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-10 flex-1" />
                      <Skeleton className="h-10 w-10" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Heart className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Start adding products you love to your wishlist
                </p>
                <Link href="/products">
                  <Button size="lg">Browse Products</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {products.map((product: any) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                      <Link href={`/products/${product._id}`}>
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                          <Image
                            src={product.images?.[0] || '/placeholder.png'}
                            alt={product.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover hover:scale-105 transition-transform duration-250"
                            loading="lazy"
                          />
                        </div>
                      </Link>

                      <CardContent className="p-4">
                        <Link href={`/products/${product._id}`}>
                          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors line-clamp-1">
                            {product.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.brand}
                        </p>
                        <p className="text-2xl font-bold mb-4">
                          {formatPrice(product.price)}
                        </p>

                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemove(product._id)}
                            disabled={deletingId === product._id}
                          >
                            {deletingId === product._id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-600" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
