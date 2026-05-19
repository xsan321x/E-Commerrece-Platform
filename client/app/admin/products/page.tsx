'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AddProductModal } from '@/components/AddProductModal';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ManageProducts() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  console.log('[Admin Products] Component rendered, user:', user ? `${user.name} (role: ${user.role})` : 'null');

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      if (!user || user.role !== 'admin') return []; // Return empty array if not admin
      const response = await api.get('/products');
      return response.data.data.products || [];
    },
    enabled: !!(user && user.role === 'admin'), // Only run if user is admin
    initialData: [], // Provide initial data to prevent undefined
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      setDeletingId(productId);
      await api.delete(`/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
      setDeletingId(null);
    },
    onError: () => {
      toast.error('Failed to delete product');
      setDeletingId(null);
    },
  });

  useEffect(() => {
    console.log('[Admin Products] useEffect triggered, user:', user ? `${user.name} (role: ${user.role})` : 'null');
    if ((!user || user.role !== 'admin') && !isRedirecting) {
      console.log('[Admin Products] Redirecting to home - user:', user, 'role:', user?.role);
      setIsRedirecting(true);
      router.push('/');
    } else if (user && user.role === 'admin') {
      console.log('[Admin Products] User is admin, staying on page');
    }
  }, [user, router, isRedirecting]);

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(productId);
    }
  };

  console.log('[Admin Products] Before return check, user:', user ? `${user.name} (role: ${user.role})` : 'null');

  // Return null AFTER all hooks
  if (!user || user.role !== 'admin') {
    console.log('[Admin Products] Returning null');
    return null;
  }

  console.log('[Admin Products] Rendering page content');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-4xl font-bold">Manage Products</h1>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Products ({products?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Skeleton className="w-16 h-16 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/5" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-10" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No products yet</p>
                  <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Product
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {products?.map((product: any) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <Link href={`/products/${product._id}`}>
                              <h3 className="font-semibold hover:text-primary hover:underline cursor-pointer">
                                {product.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {product.category} • {product.brand}
                            </p>
                            <p className="text-sm">
                              Stock: {product.stock} • Price: ${product.price}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.push(`/admin/products/edit/${product._id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(product._id)}
                            disabled={deletingId === product._id}
                          >
                            {deletingId === product._id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-600" />
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
