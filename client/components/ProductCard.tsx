'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { toast } from 'sonner';
import { useState, useCallback, memo } from 'react';
import api from '@/lib/api';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const user = useAuthStore((state) => state.user);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success('Added to cart!', { duration: 2000 });
  }, [product, addItem]);

  const handleWishlist = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    if (!user) {
      toast.error('Please login to add items to wishlist', { duration: 3000 });
      return;
    }
    
    setIsWishlistLoading(true);
    try {
      if (isWishlisted) {
        console.log('[ProductCard] Removing from wishlist:', product._id);
        await api.delete(`/wishlist/${product._id}`);
        setIsWishlisted(false);
        toast.success('Removed from wishlist', { duration: 2000 });
      } else {
        console.log('[ProductCard] Adding to wishlist:', product._id);
        const response = await api.post('/wishlist', { productId: product._id });
        console.log('[ProductCard] Add to wishlist response:', response.data);
        setIsWishlisted(true);
        toast.success('Added to wishlist!', { duration: 2000 });
      }
    } catch (error: any) {
      console.error('[ProductCard] Wishlist error:', error);
      const message = error.response?.data?.message || 'Failed to update wishlist';
      toast.error(message, { duration: 3000 });
    } finally {
      setIsWishlistLoading(false);
    }
  }, [isWishlisted, product._id, user]);

  return (
    <Link href={`/products/${product._id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <Card className="overflow-hidden h-full hover:shadow-xl transition-shadow duration-200">
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform hover:scale-105 duration-300"
              loading="lazy"
            />
            {product.stock === 0 && (
              <Badge className="absolute top-2 right-2" variant="destructive">
                Out of Stock
              </Badge>
            )}
            {product.stock > 0 && product.stock < 10 && (
              <Badge className="absolute top-2 right-2" variant="secondary">
                Only {product.stock} left
              </Badge>
            )}
          </div>

          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-sm text-muted-foreground">{product.brand}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {product.averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({product.numReviews})
              </span>
            </div>

            <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
          </CardContent>

          <CardFooter className="p-4 pt-0 gap-2">
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleWishlist}
              disabled={isWishlistLoading}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
});
