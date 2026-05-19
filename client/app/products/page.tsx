'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import api from '@/lib/api';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { Navbar } from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const categories = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Books', 'Toys'];

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);

  // Update search input when URL changes
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // Debounce search to reduce API calls
  const debouncedSearch = useDebounce(searchInput, 300); // Reduced from 500ms to 300ms

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, sort]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', debouncedSearch, category, sort, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sort,
      });
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (category !== 'All') params.append('category', category);

      const response = await api.get(`/products?${params}`);
      return response.data.data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: typeof window !== 'undefined', // Only run on client-side
    retry: false, // Don't retry on build
  });

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  }, []);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">
            Discover our complete collection of premium products
          </p>
        </motion.div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
                {isFetching && !isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <select 
              value={category} 
              onChange={handleCategoryChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="All">All Categories</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select 
              value={sort} 
              onChange={handleSortChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="-createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-averageRating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data?.products?.map((product: Product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {data?.products?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}

            {/* Pagination */}
            {data?.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {page} of {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages || isFetching}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
