
import React, { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';
import { SimpleLoadingSpinner } from '@/components/loading/SimpleLoadingSpinner';

// Lazy load non-critical providers
const AnalyticsProvider = lazy(() => import('@/components/analytics/AnalyticsProvider').then(m => ({ default: m.AnalyticsProvider })));
const AdSenseProvider = lazy(() => import('@/components/ads/AdSenseProvider').then(m => ({ default: m.AdSenseProvider })));
const GDPRConsentProvider = lazy(() => import('@/contexts/GDPRConsentContext').then(m => ({ default: m.GDPRConsentProvider })));
const StateManagerProvider = lazy(() => import('@/contexts/StateManagerContext').then(m => ({ default: m.StateManagerProvider })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1, // Reduce retries for faster failures
    },
  },
});

interface OptimizedProviderStackProps {
  children: React.ReactNode;
  enableAnalytics?: boolean;
  enableAds?: boolean;
}

export const OptimizedProviderStack: React.FC<OptimizedProviderStackProps> = ({ 
  children, 
  enableAnalytics = true, 
  enableAds = true 
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Router>
            <AuthProvider>
              <Suspense fallback={<SimpleLoadingSpinner />}>
                {enableAnalytics && enableAds ? (
                  <StateManagerProvider>
                    <GDPRConsentProvider>
                      <AnalyticsProvider>
                        <AdSenseProvider clientId="ca-pub-5766122497657850">
                          {children}
                        </AdSenseProvider>
                      </AnalyticsProvider>
                    </GDPRConsentProvider>
                  </StateManagerProvider>
                ) : (
                  children
                )}
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
          </Router>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
