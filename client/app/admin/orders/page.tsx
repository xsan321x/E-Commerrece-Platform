'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, XCircle } from 'lucide-react';
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
      if (!user || user.role !== 'admin') {
        console.log('[Admin Orders] Not admin, returning empty array');
        return [];
      }
      try {
        console.log('[Admin Orders] Fetching all orders...');
        const response = await api.get('/orders/all');
        console.log('[Admin Orders] Raw response:', response);
        console.log('[Admin Orders] Response data:', response.data);
        
        const orders = response.data?.data?.orders || [];
        console.log('[Admin Orders] Orders fetched successfully:', orders.length, 'orders');
        console.log('[Admin Orders] Orders:', orders);
        return orders;
      } catch (error: any) {
        console.error('[Admin Orders] Error fetching orders:', error);
        console.error('[Admin Orders] Error response:', error.response);
        console.error('[Admin Orders] Error message:', error.message);
        throw error;
      }
    },
    retry: 1,
    refetchOnMount: 'always',
    staleTime: 0, // Always fetch fresh data
    enabled: !!(user && user.role === 'admin' && typeof window !== 'undefined'),
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

          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="mb-4 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <p className="text-xs font-mono">
                  <strong>Debug Info:</strong><br/>
                  User: {user?.email} (Role: {user?.role})<br/>
                  Query Status: {isLoading ? 'Loading' : error ? 'Error' : 'Success'}<br/>
                  Orders Count: {orders?.length || 0}<br/>
                  API URL: {process.env.NEXT_PUBLIC_API_URL}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>All Orders ({orders?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading orders...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                  <p className="text-red-700 font-semibold mb-2">Error Loading Orders</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {error instanceof Error ? error.message : 'Failed to load orders'}
                  </p>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-orders'] })}
                    >
                      Retry
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      Troubleshooting tips:<br/>
                      1. Make sure you're logged in as admin<br/>
                      2. Check browser console (F12) for error details<br/>
                      3. Try the test page: <a href="/test-orders" className="text-blue-600 underline">/test-orders</a>
                    </p>
                  </div>
                </div>
              ) : !orders || orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-semibold mb-2">No orders found</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    There are no orders in the system yet.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Orders will appear here once customers place orders.
                  </p>
                </div>
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
