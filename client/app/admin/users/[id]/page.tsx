'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  User as UserIcon,
  Mail,
  Calendar,
  MapPin,
  Package,
  DollarSign,
  Heart,
  Edit,
  Save,
  X,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { toast } from 'sonner';
import Image from 'next/image';
import { formatPrice, formatDate } from '@/lib/utils';

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const currentUser = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    avatar: '',
    role: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      pinCode: '',
    },
  });

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/');
    }
  }, [currentUser, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['user-details', userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`);
      return response.data.data;
    },
    onSuccess: (data) => {
      setEditForm({
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.avatar || '',
        role: data.user.role,
        address: data.user.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          pinCode: '',
        },
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (updateData: any) => {
      await api.put(`/users/${userId}`, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-details', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User details updated successfully');
      setIsEditing(false);
    },
    onError: () => {
      toast.error('Failed to update user details');
    },
  });

  const handleSave = () => {
    updateUserMutation.mutate(editForm);
  };

  const handleCancel = () => {
    if (data) {
      setEditForm({
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.avatar || '',
        role: data.user.role,
        address: data.user.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          pinCode: '',
        },
      });
    }
    setIsEditing(false);
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container py-8">
          <div className="text-center">User not found</div>
        </div>
      </div>
    );
  }

  const { user, orders, stats } = data;

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
              <Link href="/admin/users">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-4xl font-bold">User Details</h1>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit User
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={updateUserMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                      {(isEditing ? editForm.avatar : user.avatar) ? (
                        <Image
                          src={isEditing ? editForm.avatar : user.avatar}
                          alt={user.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-white font-bold text-4xl">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {isEditing && (
                      <div className="w-full">
                        <Label htmlFor="avatar">Avatar URL</Label>
                        <Input
                          id="avatar"
                          value={editForm.avatar}
                          onChange={(e) =>
                            setEditForm({ ...editForm, avatar: e.target.value })
                          }
                          placeholder="https://example.com/avatar.jpg"
                        />
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <Label htmlFor="name">Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{user.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    <Label htmlFor="role">Role</Label>
                    {isEditing ? (
                      <Select
                        value={editForm.role}
                        onValueChange={(value) =>
                          setEditForm({ ...editForm, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="mt-2">
                        <Badge
                          variant={user.role === 'admin' ? 'default' : 'secondary'}
                        >
                          {user.role === 'admin' && (
                            <Shield className="h-3 w-3 mr-1" />
                          )}
                          {user.role.toUpperCase()}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Join Date */}
                  <div>
                    <Label>Member Since</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <Label>Address</Label>
                    {isEditing ? (
                      <div className="space-y-2 mt-2">
                        <Input
                          placeholder="Street"
                          value={editForm.address.street}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              address: { ...editForm.address, street: e.target.value },
                            })
                          }
                        />
                        <Input
                          placeholder="City"
                          value={editForm.address.city}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              address: { ...editForm.address, city: e.target.value },
                            })
                          }
                        />
                        <Input
                          placeholder="State"
                          value={editForm.address.state}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              address: { ...editForm.address, state: e.target.value },
                            })
                          }
                        />
                        <Input
                          placeholder="Country"
                          value={editForm.address.country}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              address: { ...editForm.address, country: e.target.value },
                            })
                          }
                        />
                        <Input
                          placeholder="Pin Code"
                          value={editForm.address.pinCode}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              address: { ...editForm.address, pinCode: e.target.value },
                            })
                          }
                        />
                      </div>
                    ) : user.address ? (
                      <div className="flex items-start gap-2 mt-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                        <div className="text-sm">
                          <p>{user.address.street}</p>
                          <p>
                            {user.address.city}, {user.address.state}
                          </p>
                          <p>
                            {user.address.country} - {user.address.pinCode}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">
                        No address provided
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats and Orders */}
            <div className="lg:col-span-2 space-y-6">
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-2xl font-bold">{stats.totalOrders}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                        <p className="text-2xl font-bold">
                          {formatPrice(stats.totalSpent)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Heart className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Wishlist Items</p>
                        <p className="text-2xl font-bold">{stats.wishlistItems}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order History */}
              <Card>
                <CardHeader>
                  <CardTitle>Order History ({orders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div
                          key={order._id}
                          className="p-4 border rounded-lg hover:bg-gray-50 transition"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">
                                Order #{order._id.slice(-8).toUpperCase()}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">
                                {formatPrice(order.totalAmount)}
                              </p>
                              <Badge
                                variant={
                                  order.orderStatus === 'delivered'
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {order.orderStatus}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {order.products.map((item: any, idx: number) => (
                              <p key={idx} className="text-sm text-muted-foreground">
                                • {item.product?.title || 'Product'} x {item.quantity}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No orders yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
