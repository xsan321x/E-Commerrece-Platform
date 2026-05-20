'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  console.log('[Admin Dashboard] Component rendered, user:', user ? `${user.name} (role: ${user.role})` : 'null');

  // Wait for Zustand to rehydrate from localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const { data: products } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const response = await api.get('/products');
      return response.data.data.products || [];
    },
    enabled: !!(user && user.role === 'admin' && isHydrated && typeof window !== 'undefined'),
  });

  const { data: orders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await api.get('/orders/all');
      return response.data.data.orders || [];
    },
    enabled: !!(user && user.role === 'admin' && isHydrated && typeof window !== 'undefined'),
  });

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data.data.users || [];
    },
    enabled: !!(user && user.role === 'admin' && isHydrated && typeof window !== 'undefined'),
  });

  useEffect(() => {
    // Only redirect after hydration is complete
    if (!isHydrated) return;
    
    console.log('[Admin Dashboard] useEffect triggered, user:', user ? `${user.name} (role: ${user.role})` : 'null');
    if ((!user || user.role !== 'admin') && !isRedirecting) {
      console.log('[Admin Dashboard] Redirecting to home');
      setIsRedirecting(true);
      router.push('/');
    } else if (user && user.role === 'admin') {
      console.log('[Admin Dashboard] User is admin, staying on page');
    }
  }, [user, router, isRedirecting, isHydrated]);

  const totalRevenue = orders?.reduce((sum: number, order: any) => {
    // Count all orders except cancelled ones
    return order.orderStatus !== 'cancelled' ? sum + order.totalAmount : sum;
  }, 0) || 0;

  const stats = [
    {
      title: 'Total Products',
      value: products?.length || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Orders',
      value: orders?.length || 0,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Users',
      value: users?.length || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  if (!isHydrated || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
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
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/products">
                  <Button className="w-full" variant="outline">
                    <Package className="mr-2 h-4 w-4" />
                    Manage Products
                  </Button>
                </Link>
                <Link href="/admin/orders">
                  <Button className="w-full" variant="outline">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Manage Orders
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button className="w-full" variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders?.slice(0, 5).map((order: any) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">Order #{order._id.slice(-6)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.user?.name || 'Unknown User'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.totalAmount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.orderStatus}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
