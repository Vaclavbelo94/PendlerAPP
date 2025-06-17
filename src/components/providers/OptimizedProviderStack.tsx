
import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/hooks/auth/useAuthProvider';
import { GlobalPerformanceProvider } from '@/components/optimized/GlobalPerformanceProvider';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import SimpleLoadingSpinner from '@/components/loading/SimpleLoadingSpinner';

// Optimalizovaný QueryClient s menší cache
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minut
      gcTime: 10 * 60 * 1000,   // 10 minut (dříve cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always'
    },
    mutations: {
      retry: 0
    }
  }
});

interface OptimizedProviderStackProps {
  children: React.ReactNode;
}

export const OptimizedProviderStack: React.FC<OptimizedProviderStackProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem 
            disableTransitionOnChange={false}
          >
            <Suspense fallback={<SimpleLoadingSpinner />}>
              <AuthProvider>
                <GlobalPerformanceProvider>
                  {children}
                  <Toaster 
                    position="top-right" 
                    richColors 
                    closeButton
                  />
                </GlobalPerformanceProvider>
              </AuthProvider>
            </Suspense>
          </ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};
