'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, Truck, Box, Star, X } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { Order } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const statusConfig = {
  processing: { icon: Clock, color: 'bg-blue-100 text-blue-800', label: 'Processing' },
  shipped: { icon: Truck, color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Cancelled' },
};

const OrderTimeline = ({ status, createdAt }: { status: string; createdAt: string }) => {
  const steps = [
    { key: 'processing', label: 'Order Placed', icon: Box },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const statusOrder = ['processing', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(status);
  const isCancelled = status === 'cancelled';

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
        <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
        <div>
          <p className="font-medium text-red-900 text-sm">Order Cancelled</p>
          <p className="text-xs text-red-700">This order has been cancelled</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-3">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}
              >
                <StepIcon className="h-4 w-4" />
              </div>
              <p
                className={`text-xs mt-1 font-medium text-center ${
                  isCompleted ? 'text-green-700' : 'text-gray-500'
                }`}
              >
                {step.label}
              </p>
              {index === 0 && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDate(createdAt)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function OrdersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean;
    productId: string;
    productName: string;
  }>({ open: false, productId: '', productName: '' });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    console.log('[Orders Page] useEffect triggered, user:', user ? `${user.name} (${user.email})` : 'null');
    if (!user) {
      console.log('[Orders Page] No user found, redirecting to login');
      router.push('/login');
    }
  }, [user, router]);

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      if (!user) return []; // Return empty array if no user
      console.log('[Orders Page] Fetching orders...');
      const response = await api.get('/orders/myorders');
      console.log('[Orders Page] Orders fetched successfully:', response.data.data.orders.length, 'orders');
      return response.data.data.orders as Order[];
    },
    enabled: !!user,
    retry: 1, // Retry once on failure
    refetchOnMount: true, // Always refetch when component mounts
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
    initialData: [], // Provide initial data to prevent undefined
  });

  // Log any query errors
  useEffect(() => {
    if (error) {
      console.error('[Orders Page] Query error:', error);
    }
  }, [error]);

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      await api.patch(`/orders/${orderId}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      toast.success('Order cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    },
  });

  const addReviewMutation = useMutation({
    mutationFn: async ({ productId, rating, comment }: { productId: string; rating: number; comment: string }) => {
      await api.post(`/products/${productId}/reviews`, { rating, comment });
    },
    onSuccess: () => {
      toast.success('Review added successfully');
      setReviewDialog({ open: false, productId: '', productName: '' });
      setRating(5);
      setComment('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add review');
    },
  });

  const handleCancelOrder = (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      cancelOrderMutation.mutate(orderId);
    }
  };

  const handleOpenReviewDialog = (productId: string, productName: string) => {
    setReviewDialog({ open: true, productId, productName });
    setRating(5);
    setComment('');
  };

  const handleSubmitReview = () => {
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }
    addReviewMutation.mutate({
      productId: reviewDialog.productId,
      rating,
      comment,
    });
  };

  if (!user) {
    console.log('[Orders Page] Rendering null (no user)');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-6">My Orders</h1>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = statusConfig[order.orderStatus];
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                              Placed on {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <Badge className={status.color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {status.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Order Timeline */}
                        <OrderTimeline
                          status={order.orderStatus}
                          createdAt={order.createdAt}
                        />

                        {/* Products */}
                        <div className="border-t pt-3">
                          <p className="text-sm font-medium mb-3">Order Items:</p>
                          <div className="space-y-2">
                            {order.products.map((item, index) => {
                              const product = typeof item.product === 'object' ? item.product : null;
                              return (
                                <Link
                                  key={index}
                                  href={product?._id ? `/products/${product._id}` : '#'}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  {/* Product Image */}
                                  <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                                    {product?.images?.[0] ? (
                                      <Image
                                        src={product.images[0]}
                                        alt={product.title || 'Product'}
                                        fill
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Package className="h-6 w-6 text-gray-400" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Product Details */}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {product?.title || 'Product'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Qty: {item.quantity} × {formatPrice(item.price)}
                                    </p>
                                  </div>

                                  {/* Subtotal */}
                                  <div className="text-sm font-semibold">
                                    {formatPrice(item.price * item.quantity)}
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border-t pt-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-xs text-muted-foreground">Shipping Address:</p>
                              <p className="text-sm">
                                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Payment Status:</p>
                              <Badge
                                variant={
                                  order.paymentStatus === 'paid'
                                    ? 'default'
                                    : order.paymentStatus === 'pending'
                                    ? 'secondary'
                                    : 'destructive'
                                }
                                className="text-xs"
                              >
                                {order.paymentStatus.toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="font-semibold">Total Amount:</span>
                            <span className="text-xl font-bold">
                              {formatPrice(order.totalAmount)}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-3 border-t">
                            {/* Cancel Order Button - Only show if order is in processing */}
                            {order.orderStatus === 'processing' && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCancelOrder(order._id)}
                                disabled={cancelOrderMutation.isPending}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Order
                              </Button>
                            )}

                            {/* Review Products Button - Only show if order is delivered */}
                            {order.orderStatus === 'delivered' && (
                              <div className="flex flex-wrap gap-2">
                                {order.products.map((item, index) => {
                                  const product = typeof item.product === 'object' ? item.product : null;
                                  if (!product) return null;
                                  
                                  return (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleOpenReviewDialog(product._id, product.title)}
                                    >
                                      <Star className="mr-2 h-4 w-4" />
                                      Review {product.title.length > 20 ? product.title.substring(0, 20) + '...' : product.title}
                                    </Button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start shopping to see your orders here
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialog.open} onOpenChange={(open) => setReviewDialog({ ...reviewDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Product</DialogTitle>
            <DialogDescription>
              Share your experience with {reviewDialog.productName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                className="w-full min-h-[100px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setReviewDialog({ open: false, productId: '', productName: '' })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={addReviewMutation.isPending}
            >
              {addReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
