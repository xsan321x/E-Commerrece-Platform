'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30 seconds - data becomes stale faster
            gcTime: 5 * 60 * 1000, // 5 minutes - cache persists
            refetchOnWindowFocus: false, // Don't refetch on window focus
            refetchOnReconnect: false, // Don't refetch on reconnect
            refetchOnMount: 'always', // Always refetch on mount to get fresh data
            retry: 1, // Retry once on failure
            retryDelay: 1000, // 1 second retry delay
            networkMode: 'online', // Only fetch when online
          },
          mutations: {
            retry: 0, // No retries for mutations
            networkMode: 'online',
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
