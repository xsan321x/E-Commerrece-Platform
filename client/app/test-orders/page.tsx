'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export default function TestOrdersPage() {
  const user = useAuthStore((state) => state.user);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testMyOrders = async () => {
    setLoading(true);
    setResult(null);
    try {
      console.log('[Test] Fetching my orders...');
      const response = await api.get('/orders/myorders');
      console.log('[Test] Response:', response);
      setResult({
        success: true,
        data: response.data,
        status: response.status,
      });
    } catch (error: any) {
      console.error('[Test] Error:', error);
      setResult({
        success: false,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    } finally {
      setLoading(false);
    }
  };

  const testAllOrders = async () => {
    setLoading(true);
    setResult(null);
    try {
      console.log('[Test] Fetching all orders (admin)...');
      const response = await api.get('/orders/all');
      console.log('[Test] Response:', response);
      setResult({
        success: true,
        data: response.data,
        status: response.status,
      });
    } catch (error: any) {
      console.error('[Test] Error:', error);
      setResult({
        success: false,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    } finally {
      setLoading(false);
    }
  };

  const testAuth = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    setResult({
      success: true,
      token: token ? `${token.substring(0, 20)}...` : 'No token',
      user: userStr ? JSON.parse(userStr) : 'No user',
      currentUser: user,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Orders API Test Page</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current User</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </div>
            ) : (
              <p className="text-red-500">Not logged in</p>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={testAuth} 
              disabled={loading}
              className="w-full"
            >
              Check Authentication
            </Button>
            <Button 
              onClick={testMyOrders} 
              disabled={loading || !user}
              className="w-full"
            >
              Test My Orders API
            </Button>
            <Button 
              onClick={testAllOrders} 
              disabled={loading || !user || user.role !== 'admin'}
              className="w-full"
            >
              Test All Orders API (Admin Only)
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-xs">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. Make sure you're logged in</p>
            <p>2. Click "Check Authentication" to verify your token and user data</p>
            <p>3. Click "Test My Orders API" to test the user orders endpoint</p>
            <p>4. If you're an admin, click "Test All Orders API" to test the admin endpoint</p>
            <p>5. Check the browser console (F12) for detailed logs</p>
            <p>6. Check the result below for the API response</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
