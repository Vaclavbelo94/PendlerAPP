
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/auth';
import { ThemeProvider } from '@/components/theme-provider';
import { AdSenseProvider } from '@/components/ads/AdSenseProvider';
import { GDPRConsentProvider } from '@/contexts/GDPRConsentContext';
import ErrorBoundaryWithFallback from '@/components/common/ErrorBoundaryWithFallback';
import PWAInstallPrompt from '@/components/common/PWAInstallPrompt';
import { GlobalScrollToTop } from '@/components/common/GlobalScrollToTop';
import '@/i18n/config';

// Pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Admin from '@/pages/Admin';
import Shifts from '@/pages/Shifts';
import TaxAdvisor from '@/pages/TaxAdvisor';
import Vehicle from '@/pages/Vehicle';
import Travel from '@/pages/Travel';
import Translator from '@/pages/Translator';
import Laws from '@/pages/Laws';
import Analytics from '@/pages/Analytics';
import Help from '@/pages/Help';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundaryWithFallback>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <GDPRConsentProvider>
              <AdSenseProvider>
                <Router>
                  <div className="App">
                    <GlobalScrollToTop />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/shifts" element={<Shifts />} />
                      <Route path="/tax-advisor" element={<TaxAdvisor />} />
                      <Route path="/vehicle" element={<Vehicle />} />
                      <Route path="/travel" element={<Travel />} />
                      <Route path="/translator" element={<Translator />} />
                      <Route path="/laws" element={<Laws />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/help" element={<Help />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <PWAInstallPrompt />
                    <Toaster />
                  </div>
                </Router>
              </AdSenseProvider>
            </GDPRConsentProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundaryWithFallback>
  );
}

export default App;
