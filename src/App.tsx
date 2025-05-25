
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { Toaster as ToasterTwo } from "@/components/ui/toaster";
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LazyLoadWrapper from '@/components/common/LazyLoadWrapper';
import PWAInstallPrompt from '@/components/common/PWAInstallPrompt';
import LayoutWrapper from '@/components/layouts/LayoutWrapper';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { useAnalytics } from '@/hooks/useAnalytics';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { AuthProvider } from '@/hooks/auth';
import { ThemeProvider } from '@/hooks/useTheme';

// Lazy loaded components for better performance
import { 
  LazyShiftsModule,
  LazyVehicleModule, 
  LazyCalculatorModule,
  LazySettingsModule 
} from '@/utils/performanceOptimizer';

import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Language from "@/pages/Language";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import UnifiedProfile from "@/pages/UnifiedProfile";
import ProfileExtended from "@/pages/ProfileExtended";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function AppContent() {
  const { trackPageView, trackError } = useAnalytics();
  usePerformanceOptimization();

  useEffect(() => {
    // Track page views
    const handleLocationChange = () => {
      trackPageView(window.location.pathname);
    };

    // Initial page view
    handleLocationChange();

    // Listen for navigation changes
    window.addEventListener('popstate', handleLocationChange);
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      performanceMonitor.destroy();
    };
  }, [trackPageView]);

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    trackError(error, errorInfo);
  };

  return (
    <ErrorBoundary onError={handleError}>
      <div className="min-h-screen bg-background">
        <LayoutWrapper>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/language" element={<Language />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile-unified" element={<UnifiedProfile />} />
            <Route path="/profile-extended" element={<ProfileExtended />} />
            <Route path="/profile-extended/:userId" element={<ProfileExtended />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            
            {/* Lazy loaded routes */}
            <Route 
              path="/shifts" 
              element={
                <LazyLoadWrapper>
                  <LazyShiftsModule />
                </LazyLoadWrapper>
              } 
            />
            <Route 
              path="/calculator" 
              element={
                <LazyLoadWrapper>
                  <LazyCalculatorModule />
                </LazyLoadWrapper>
              } 
            />
            <Route 
              path="/vehicle" 
              element={
                <LazyLoadWrapper>
                  <LazyVehicleModule />
                </LazyLoadWrapper>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <LazyLoadWrapper>
                  <LazySettingsModule />
                </LazyLoadWrapper>
              } 
            />
          </Routes>
        </LayoutWrapper>
        
        <PWAInstallPrompt />
        <Toaster position="bottom-right" />
        <ToasterTwo />
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <AppContent />
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
