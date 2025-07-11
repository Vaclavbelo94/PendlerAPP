
import React, { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/hooks/auth';
import { ThemeProvider } from 'next-themes';
import SimpleLoadingSpinner from '@/components/loading/SimpleLoadingSpinner';

// Lazy load non-critical providers
const AnalyticsProvider = lazy(() => import('@/components/analytics/AnalyticsProvider').then(m => ({ default: m.AnalyticsProvider })));
const MediaNetProvider = lazy(() => import('@/components/ads/MediaNetProvider').then(m => ({ default: m.MediaNetProvider })));
const GDPRConsentProvider = lazy(() => import('@/contexts/GDPRConsentContext').then(m => ({ default: m.GDPRConsentProvider })));
const StateManagerProvider = lazy(() => import('@/contexts/StateManagerContext').then(m => ({ default: m.StateManagerProvider })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
});

interface OptimizedProviderStackProps {
  children: React.ReactNode;
}

export const OptimizedProviderStack: React.FC<OptimizedProviderStackProps> = ({ 
  children
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider>
            <AuthProvider>
              <Suspense fallback={<SimpleLoadingSpinner />}>
                <StateManagerProvider>
                  <GDPRConsentProvider>
                    <AnalyticsProvider>
                      <MediaNetProvider siteId="YOUR_MEDIA_NET_SITE_ID">
                        {children}
                      </MediaNetProvider>
                    </AnalyticsProvider>
                  </GDPRConsentProvider>
                </StateManagerProvider>
              </Suspense>
              
              <Toaster />
              <Sonner 
                position="bottom-right"
                toastOptions={{
                  duration: 2500,
                  style: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );
};
