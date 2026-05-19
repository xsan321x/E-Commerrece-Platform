'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Package } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ManageOrders() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      if (!user || user.role !== 'admin') return []; // Return empty array if not admin
      console.log('[Admin Orders] Fetching all orders...');
      const response = await api.get('/orders/all');
      console.log('[Admin Orders] Orders fetched successfully:', response.data.data.orders.length, 'orders');
      return response.data.data.orders || [];
    },
    retry: 1, // Retry once on failure
    refetchOnMount: true, // Always refetch when component mounts
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
    enabled: !!(user && user.role === 'admin'),
    initialData: [], // Provide initial data to prevent undefined
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      console.log('[Admin Orders] Updating order status:', orderId, 'to', status);
      await api.patch(`/orders/${orderId}/status`, { orderStatus: status });
    },
    onSuccess: () => {
      console.log('[Admin Orders] Status updated successfully, invalidating cache');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated');
    },
    onError: (error: any) => {
      console.error('[Admin Orders] Mutation error:', error);
      // Check if it's an authentication error
      if (error?.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Failed to update order status');
      }
    },
  });

  useEffect(() => {
    console.log('[Admin Orders] useEffect triggered, user:', user ? `${user.name} (${user.email}, role: ${user.role})` : 'null');
    if ((!user || user.role !== 'admin') && !isRedirecting) {
      console.log('[Admin Orders] Not admin, redirecting to home');
      setIsRedirecting(true);
      router.push('/');
    }
  }, [user, router, isRedirecting]);

  // Log any query errors
  useEffect(() => {
    if (error) {
      console.error('[Admin Orders] Query error:', error);
    }
  }, [error]);

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: 'secondary',
      processing: 'default',
      shipped: 'default',
      delivered: 'default',
      cancelled: 'destructive',
    };
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    return <Badge variant={variants[status] || 'secondary'}>{capitalize(status)}</Badge>;
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Manage Orders</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Orders ({orders?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="space-y-4">
                  {orders?.map((order: any) => (
                    <div
                      key={order._id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-base">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Customer: {order.user?.name || 'Unknown'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Email: {order.user?.email || 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            ${order.totalAmount.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-2">
                          {getStatusBadge(order.orderStatus)}
                          <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          </Badge>
                        </div>
                        {order.orderStatus === 'cancelled' ? (
                          <div className="text-sm text-muted-foreground italic">
                            Cancelled by customer
                          </div>
                        ) : (
                          <Select
                            value={order.orderStatus}
                            onValueChange={(value) =>
                              updateStatusMutation.mutate({
                                orderId: order._id,
                                status: value,
                              })
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>

                      <div className="pt-3 border-t">
                        <p className="text-sm font-medium mb-2">Items:</p>
                        <div className="space-y-2">
                          {order.products?.map((item: any, idx: number) => (
                            <Link
                              key={idx}
                              href={item.product?._id ? `/products/${item.product._id}` : '#'}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              {/* Product Image */}
                              <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                                {item.product?.images?.[0] ? (
                                  <Image
                                    src={item.product.images[0]}
                                    alt={item.product.title || 'Product'}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                              </div>

                              {/* Product Details */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {item.product?.title || 'Product'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                                </p>
                              </div>

                              {/* Subtotal */}
                              <div className="text-sm font-semibold">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
